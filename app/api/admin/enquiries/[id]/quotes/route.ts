import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getStaffContext } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const lineSchema = z.object({
  description: z.string().trim().min(1).max(240),
  quantity: z.coerce.number().int().min(1).max(100000),
  unitPrice: z.string().regex(/^\d{1,10}(\.\d{1,2})?$/, "Enter a valid price with up to two decimals.")
});
const schema = z.object({
  items: z.array(lineSchema).min(1).max(30),
  customerNote: z.string().trim().max(2000).optional().default("")
});

function toCents(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const { data, error } = await staff.supabase.from("quotes")
    .select("id, quote_number, status, created_at, customer_response_note").eq("enquiry_id", id)
    .order("revision_number", { ascending: false }).limit(5);
  if (error) return NextResponse.json({ error: "Could not load quotations." }, { status: 500 });
  return NextResponse.json({ quotes: data || [] });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the quote details." }, { status: 400 });

  const { data: enquiry } = await staff.supabase.from("enquiries").select("id").eq("id", id).maybeSingle();
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });

  const { data: previous } = await staff.supabase.from("quotes").select("id, revision_number, status")
    .eq("enquiry_id", id).order("revision_number", { ascending: false }).limit(1).maybeSingle();
  if (previous?.status === "accepted") {
    return NextResponse.json({ error: "This quotation was accepted. Confirm or follow up on the booking before creating another revision." }, { status: 409 });
  }
  const revision = (previous?.revision_number || 0) + 1;
  const currency = (process.env.QUOTE_CURRENCY || "INR").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) return NextResponse.json({ error: "Quote currency is not configured." }, { status: 500 });
  const lineCents = parsed.data.items.map((item) => toCents(item.unitPrice) * item.quantity);
  const subtotalCents = lineCents.reduce((sum, amount) => sum + amount, 0);
  const quoteNumber = "Q-" + new Date().getFullYear() + "-" + randomBytes(4).toString("hex").toUpperCase();

  const { data: quote, error: quoteError } = await staff.supabase.from("quotes").insert({
    enquiry_id: id,
    quote_number: quoteNumber,
    revision_number: revision,
    status: "draft",
    currency,
    subtotal: (subtotalCents / 100).toFixed(2),
    grand_total: (subtotalCents / 100).toFixed(2),
    customer_note: parsed.data.customerNote || null,
    supersedes_quote_id: previous?.id || null
  }).select("id, quote_number").single();
  if (quoteError || !quote) return NextResponse.json({ error: "Could not save the quotation." }, { status: 500 });

  const { error: itemError } = await staff.supabase.from("quote_items").insert(parsed.data.items.map((item, index) => {
    const cents = toCents(item.unitPrice) * item.quantity;
    return {
      quote_id: quote.id, sort_order: index, category: "other",
      customer_description: item.description, quantity: item.quantity,
      unit_label: "item", unit_price: (toCents(item.unitPrice) / 100).toFixed(2),
      line_total: (cents / 100).toFixed(2), customer_visible: true
    };
  }));
  if (itemError) {
    await staff.supabase.from("quotes").delete().eq("id", quote.id);
    return NextResponse.json({ error: "Could not save the quotation lines." }, { status: 500 });
  }

  if (previous) {
    let service;
    try { service = createSupabaseServiceClient(); }
    catch {
      await staff.supabase.from("quotes").delete().eq("id", quote.id);
      return NextResponse.json({ error: "Quotation service is not configured yet." }, { status: 503 });
    }
    const { error: supersedeError } = await service.from("quotes")
      .update({ status: "superseded" }).eq("id", previous.id);
    if (supersedeError) {
      await staff.supabase.from("quotes").delete().eq("id", quote.id);
      return NextResponse.json({ error: "Could not supersede the previous quotation." }, { status: 500 });
    }
  }

  await staff.supabase.from("enquiries")
    .update({ status: "quote_in_progress", updated_at: new Date().toISOString() }).eq("id", id);
  await staff.supabase.from("activity_events").insert({
    enquiry_id: id, actor_user_id: staff.user.id, event_type: "quote_drafted",
    safe_metadata: { quote_number: quote.quote_number, revision }
  });
  return NextResponse.json({ id: quote.id, quoteNumber: quote.quote_number }, { status: 201 });
}
