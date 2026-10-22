import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendTransactionalEmail } from "@/lib/email";

export const runtime = "nodejs";
const schema = z.object({
  response: z.enum(["accepted", "revision_requested", "declined"]),
  note: z.string().trim().max(1000).optional().default("")
});

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  if (!/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "This quotation link is unavailable." }, { status: 404 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid response." }, { status: 400 });

  let db;
  try { db = createSupabaseServiceClient(); }
  catch { return NextResponse.json({ error: "This quotation link is unavailable." }, { status: 404 }); }
  const hash = createHash("sha256").update(token).digest("hex");
  const { data: quote } = await db.from("quotes").select("id, enquiry_id, status, token_expires_at, quote_number")
    .eq("public_token_hash", hash).maybeSingle();
  if (!quote || quote.status !== "sent" || !quote.token_expires_at || new Date(quote.token_expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "This quotation link is unavailable or already has a response." }, { status: 404 });
  }

  const { data: updated, error } = await db.from("quotes").update({
    status: parsed.data.response,
    customer_response: parsed.data.response,
    customer_response_note: parsed.data.note || null,
    responded_at: new Date().toISOString()
  }).eq("id", quote.id).eq("status", "sent").select("id").maybeSingle();
  if (error || !updated) return NextResponse.json({ error: "This quotation has already received a response." }, { status: 409 });

  await db.from("enquiries").update({ status: "quote_sent", updated_at: new Date().toISOString() }).eq("id", quote.enquiry_id);
  await db.from("activity_events").insert({
    enquiry_id: quote.enquiry_id, event_type: "customer_quote_response",
    safe_metadata: { quote_number: quote.quote_number, response: parsed.data.response }
  });
  if (process.env.STAFF_ALERT_EMAIL) {
    await sendTransactionalEmail({
      to: process.env.STAFF_ALERT_EMAIL,
      subject: "Customer response to " + quote.quote_number,
      text: "A customer responded to quotation " + quote.quote_number + ": " + parsed.data.response.replaceAll("_", " ") + ". Review it in the staff dashboard."
    });
  }
  return NextResponse.json({ ok: true });
}
