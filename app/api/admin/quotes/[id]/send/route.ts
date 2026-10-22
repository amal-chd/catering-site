import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendTransactionalEmail } from "@/lib/email";
import { siteUrl } from "@/lib/content";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const { data: quote } = await staff.supabase.from("quotes")
    .select("id, quote_number, status, enquiry_id, currency, grand_total, customer_note")
    .eq("id", id).maybeSingle();
  if (!quote) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
  if (quote.status !== "draft" && quote.status !== "sent") return NextResponse.json({ error: "This quotation is no longer open for sending." }, { status: 409 });

  const { data: latest } = await staff.supabase.from("quotes").select("id")
    .eq("enquiry_id", quote.enquiry_id).order("revision_number", { ascending: false }).limit(1).maybeSingle();
  if (latest?.id !== quote.id) return NextResponse.json({ error: "Only the latest quotation revision can be sent." }, { status: 409 });

  const { data: items } = await staff.supabase.from("quote_items")
    .select("customer_description, quantity, unit_label, unit_price, line_total")
    .eq("quote_id", id).order("sort_order");
  if (!items?.length) return NextResponse.json({ error: "Add at least one quotation line first." }, { status: 400 });

  const { data: enquiry } = await staff.supabase.from("enquiries")
    .select("id, public_reference, customer_name, email").eq("id", quote.enquiry_id).maybeSingle();
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const ttlDays = Math.max(1, Math.min(90, Number(process.env.QUOTE_LINK_TTL_DAYS || "30")));
  const expiry = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
  const db = createSupabaseServiceClient();
  const { data: updatedQuote, error: updateError } = await db.from("quotes").update({
    status: "sent", public_token_hash: tokenHash, token_expires_at: expiry,
    issued_at: new Date().toISOString(), sent_at: new Date().toISOString(), sent_by: staff.user.id
  }).eq("id", id).eq("status", quote.status).select("id").maybeSingle();
  if (updateError || !updatedQuote) return NextResponse.json({ error: "Could not create the secure quote link." }, { status: 409 });

  const { error: enquiryError } = await db.from("enquiries")
    .update({ status: "quote_sent", updated_at: new Date().toISOString() }).eq("id", enquiry.id);
  if (enquiryError) return NextResponse.json({ error: "Quote link created, but enquiry status could not be updated." }, { status: 500 });

  const { data: activity } = await db.from("activity_events").insert({
    enquiry_id: enquiry.id, actor_user_id: staff.user.id, event_type: "quote_sent",
    safe_metadata: { quote_number: quote.quote_number }
  }).select("id").maybeSingle();

  const url = siteUrl + "/quote/" + token;
  let emailSent = false;
  if (enquiry.email) {
    const lines = items.map((item) => item.customer_description + " — " + item.quantity + " × " + quote.currency + " " + Number(item.unit_price).toFixed(2) + " = " + quote.currency + " " + Number(item.line_total).toFixed(2)).join("\n");
    const result = await sendTransactionalEmail({
      to: enquiry.email,
      subject: "Your catering quotation " + quote.quote_number,
      text: "Hello " + enquiry.customer_name + ",\n\nYour custom catering quotation is ready.\nReference: " + enquiry.public_reference + "\nQuote: " + quote.quote_number + "\n\n" + lines + "\n\nTotal: " + quote.currency + " " + Number(quote.grand_total).toFixed(2) + (quote.customer_note ? "\n\n" + quote.customer_note : "") + "\n\nReview and respond securely: " + url + "\n\nThis quotation does not confirm availability. The team will confirm booking details separately."
    });
    emailSent = result.sent;
  }
  return NextResponse.json({ url, emailSent, activityId: activity?.id || null });
}
