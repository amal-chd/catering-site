import type { Metadata } from "next";
import { createHash } from "node:crypto";
import Link from "next/link";
import QuoteResponse from "./QuoteResponse";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Custom quotation", robots: { index: false, follow: false } };

type Props = { params: Promise<{ token: string }> };

export default async function PublicQuotePage({ params }: Props) {
  const { token } = await params;
  const hash = createHash("sha256").update(token).digest("hex");
  let db;
  try { db = createSupabaseServiceClient(); }
  catch { return <QuoteUnavailable />; }

  const { data: quote } = await db.from("quotes")
    .select("id, enquiry_id, quote_number, status, currency, subtotal, grand_total, customer_note, issued_at, token_expires_at")
    .eq("public_token_hash", hash).maybeSingle();
  if (!quote || !quote.token_expires_at || new Date(quote.token_expires_at).getTime() < Date.now()) return <QuoteUnavailable />;

  const [{ data: enquiry }, { data: items }] = await Promise.all([
    db.from("enquiries").select("public_reference, customer_name, event_date").eq("id", quote.enquiry_id).maybeSingle(),
    db.from("quote_items").select("customer_description, quantity, unit_label, unit_price, line_total").eq("quote_id", quote.id).eq("customer_visible", true).order("sort_order")
  ]);
  if (!enquiry || !items) return <QuoteUnavailable />;

  const canRespond = quote.status === "sent";
  return <section className="public-quote"><article className="quote-document">
    <span className="quote-number">Custom catering quotation · {quote.quote_number}</span>
    <h1>Your event, considered.</h1>
    <p>Prepared for {enquiry.customer_name}{enquiry.event_date ? " · Event date " + enquiry.event_date : ""}</p>
    <p className="admin-meta">Enquiry reference {enquiry.public_reference}</p>
    <table className="quote-lines"><thead><tr><th>Details</th><th>Qty</th><th>Amount</th></tr></thead><tbody>
      {items.map((item, index) => <tr key={index}><td>{item.customer_description}<br /><span className="admin-meta">{quote.currency} {Number(item.unit_price).toFixed(2)} per {item.unit_label}</span></td><td>{item.quantity}</td><td>{quote.currency} {Number(item.line_total).toFixed(2)}</td></tr>)}
    </tbody></table>
    <div className="quote-total"><span>Total</span><span>{quote.currency} {Number(quote.grand_total).toFixed(2)}</span></div>
    {quote.customer_note ? <div className="notice" style={{ whiteSpace: "pre-wrap", marginTop: 22 }}>{quote.customer_note}</div> : null}
    <p style={{ marginTop: 24, fontSize: 12 }}>Please respond below if you would like to accept this quotation, request a revision, or decline. Availability and booking details are confirmed by the team separately. This link is available until {new Date(quote.token_expires_at).toLocaleDateString("en-IN")}.</p>
    {canRespond ? <QuoteResponse token={token} /> : <div className="notice">This quotation has already received a response or is no longer open. Please contact the team through your existing conversation.</div>}
    <p className="form-footnote"><Link href="/">Catering in Kakkanad, Kerala</Link></p>
  </article></section>;
}

function QuoteUnavailable() {
  return <section className="error-page"><span className="eyebrow">QUOTE LINK UNAVAILABLE</span><h1 style={{ fontSize: 44 }}>This link may have expired.</h1><p>Ask the catering team to share a current quotation link.</p></section>;
}
