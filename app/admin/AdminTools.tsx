"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type AdminEnquiry = {
  id: string;
  public_reference: string;
  status: string;
  customer_name: string;
  organization_name: string | null;
  email: string | null;
  phone: string | null;
  event_date: string | null;
  guest_count_min: number | null;
  venue_locality: string | null;
  event_notes: string | null;
  created_at: string;
  service_name: string;
};

type AdminBooking = {
  id: string;
  enquiry_id: string;
  status: string;
  event_date: string | null;
  public_reference: string;
  customer_name: string;
};

type QuoteLine = { description: string; quantity: string; unitPrice: string };
const statuses = ["new", "contacted", "needs_information", "qualified", "quote_in_progress", "quote_sent", "won", "lost", "not_proceeding"];

export default function AdminTools({ enquiries, bookings, currency }: { enquiries: AdminEnquiry[]; bookings: AdminBooking[]; currency: string }) {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [links, setLinks] = useState<Record<string, string>>({});

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries/" + id, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status })
      });
      const body = await response.json();
      if (!response.ok) setError(body.error || "Could not update the enquiry.");
      else window.location.reload();
    } catch {
      setError("Could not update the enquiry. Check your connection and try again.");
    } finally { setBusy(""); }
  }

  async function createQuote(id: string, lines: QuoteLine[], note: string) {
    setBusy(id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/enquiries/" + id + "/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, customerNote: note })
      });
      const body = await response.json();
      if (!response.ok) setError(body.error || "Could not create the quote.");
      else window.location.reload();
    } catch {
      setError("Could not create the quotation. Check your connection and try again.");
    } finally { setBusy(""); }
  }

  async function sendQuote(quoteId: string, enquiryId: string) {
    setBusy(enquiryId);
    setError("");
    try {
      const response = await fetch("/api/admin/quotes/" + quoteId + "/send", { method: "POST" });
      const body = await response.json();
      if (!response.ok) setError(body.error || "Could not create the quote link.");
      else {
        setLinks((current) => ({ ...current, [enquiryId]: body.url }));
        setNotice(body.emailSent ? "Quote sent by email. You can also copy the secure link." : "Secure quote link created. Email is not configured or no customer email is available; copy the link to share through an approved channel.");
      }
    } catch {
      setError("Could not create the secure quote link. Check your connection and try again.");
    } finally { setBusy(""); }
  }

  async function confirmBooking(enquiryId: string) {
    if (!window.confirm("Confirm that availability and event details have been checked with the customer?")) return;
    setBusy(enquiryId);
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries/" + enquiryId + "/booking", { method: "POST" });
      const body = await response.json();
      if (!response.ok) setError(body.error || "Could not confirm the booking.");
      else window.location.reload();
    } catch {
      setError("Could not confirm the booking. Check your connection and try again.");
    } finally { setBusy(""); }
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return <>
    <div className="admin-actions" style={{ marginBottom: 18 }}><button className="button button-outline button-small" onClick={signOut}>Sign out</button>{notice ? <span className="admin-meta" role="status">{notice}</span> : null}</div>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    {enquiries.length === 0 ? <div className="admin-card"><p>No enquiries yet. New submissions will appear here.</p></div> :
      <div className="admin-list">{enquiries.map((item) => <article className="admin-card" key={item.id}>
        <div className="admin-card-top">
          <div><span className="eyebrow">{item.public_reference} · {item.service_name}</span><h2>{item.customer_name}{item.organization_name ? " · " + item.organization_name : ""}</h2><div className="admin-meta">{item.email || "No email"}{item.phone ? " · " + item.phone : ""}</div></div>
          <span className="status-pill">{item.status.replaceAll("_", " ")}</span>
        </div>
        <p className="admin-summary">{[
          item.event_date ? "Event date: " + item.event_date : "Date not provided",
          item.guest_count_min ? "Guests / quantity: " + item.guest_count_min : "",
          item.venue_locality ? "Location: " + item.venue_locality : "",
          item.event_notes || ""
        ].filter(Boolean).join("\n")}</p>
        <div className="admin-actions">
          <label className="admin-meta" htmlFor={"status-" + item.id}>Status</label>
          <select id={"status-" + item.id} defaultValue={item.status} disabled={busy === item.id || item.status === "won"} onChange={(event) => updateStatus(item.id, event.target.value)}>
            {statuses.map((status) => <option key={status} value={status} disabled={status === "won"}>{status.replaceAll("_", " ")}{status === "won" ? " (confirm booking below)" : ""}</option>)}
          </select>
          <span className="admin-meta">Received {new Date(item.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</span>
        </div>
        <details>
          <summary>Prepare a custom quotation</summary>
          <QuoteComposer id={item.id} currency={currency} busy={busy === item.id} onSave={createQuote} />
        </details>
        <QuoteHistory enquiryId={item.id} onSend={sendQuote} onConfirm={confirmBooking} bookingConfirmed={bookings.some((booking) => booking.enquiry_id === item.id && booking.status === "confirmed")} busy={busy === item.id} link={links[item.id]} />
      </article>)}</div>}
    <section style={{ marginTop: 56 }}>
      <div className="admin-top"><div><span className="eyebrow">STAFF-CONFIRMED EVENTS</span><h2 style={{ margin: "8px 0 0", fontSize: 34 }}>Bookings</h2></div></div>
      {bookings.length === 0 ? <div className="admin-card"><p>No confirmed bookings yet.</p></div> : <div className="admin-list">
        {bookings.map((booking) => <article className="admin-card admin-card-top" key={booking.id}>
          <div><h2>{booking.customer_name}</h2><span className="admin-meta">{booking.public_reference}{booking.event_date ? " · " + booking.event_date : " · Date to be confirmed"}</span></div>
          <span className="status-pill">{booking.status.replaceAll("_", " ")}</span>
        </article>)}
      </div>}
    </section>
  </>;
}

function QuoteComposer({ id, currency, busy, onSave }: {
  id: string; currency: string; busy: boolean;
  onSave: (id: string, lines: QuoteLine[], note: string) => Promise<void>;
}) {
  const [lines, setLines] = useState<QuoteLine[]>([{ description: "", quantity: "1", unitPrice: "" }]);
  const [note, setNote] = useState("");
  function change(index: number, key: keyof QuoteLine, value: string) {
    setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, [key]: value } : line));
  }
  return <form className="quote-builder" onSubmit={(event) => { event.preventDefault(); void onSave(id, lines, note); }}>
    {lines.map((line, index) => <div className="quote-row" key={index}>
      <input aria-label="Customer-facing line description" placeholder="Line description" value={line.description} maxLength={240} required onChange={(event) => change(index, "description", event.target.value)} />
      <input aria-label="Quantity" type="number" min="1" max="100000" step="1" placeholder="Qty" value={line.quantity} required onChange={(event) => change(index, "quantity", event.target.value)} />
      <input aria-label={"Unit price in " + currency} inputMode="decimal" placeholder={"Unit price (" + currency + ")"} value={line.unitPrice} required onChange={(event) => change(index, "unitPrice", event.target.value)} />
    </div>)}
    <div className="admin-actions">
      <button className="button button-outline button-small" type="button" onClick={() => setLines((current) => [...current, { description: "", quantity: "1", unitPrice: "" }])}>Add line</button>
      {lines.length > 1 ? <button className="button button-outline button-small" type="button" onClick={() => setLines((current) => current.slice(0, -1))}>Remove last</button> : null}
    </div>
    <div className="field"><label htmlFor={"quote-note-" + id}>Customer note <span>Optional</span></label><textarea id={"quote-note-" + id} value={note} maxLength={2000} onChange={(event) => setNote(event.target.value)} /></div>
    <button className="button button-dark button-small" type="submit" disabled={busy}>Save draft quote</button>
  </form>;
}

function QuoteHistory({ enquiryId, onSend, onConfirm, bookingConfirmed, busy, link }: { enquiryId: string; onSend: (quoteId: string, enquiryId: string) => Promise<void>; onConfirm: (enquiryId: string) => Promise<void>; bookingConfirmed: boolean; busy: boolean; link?: string }) {
  const [quote, setQuote] = useState<{ id: string; quote_number: string; status: string; customer_response_note: string | null } | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    if (loaded) return;
    const response = await fetch("/api/admin/enquiries/" + enquiryId + "/quotes");
    const body = await response.json();
    if (response.ok && body.quotes?.[0]) setQuote(body.quotes[0]);
    setLoaded(true);
  }

  return <details onToggle={(event) => { if ((event.currentTarget as HTMLDetailsElement).open) void load(); }}>
    <summary>Existing quotation</summary>
    {!loaded ? <p className="admin-meta">Open to load quote status.</p> : quote ? <div className="quote-builder">
      <span className="admin-meta">{quote.quote_number} · {quote.status}</span>
      {quote.customer_response_note ? <p className="admin-summary">Customer note: {quote.customer_response_note}</p> : null}
      {(quote.status === "draft" || quote.status === "sent") && !link ? <button className="button button-dark button-small" disabled={busy} onClick={() => onSend(quote.id, enquiryId)}>{quote.status === "draft" ? "Create secure link / send" : "Create fresh link / resend"}</button> : null}
      {quote.status === "accepted" && !bookingConfirmed ? <button className="button button-dark button-small" disabled={busy} onClick={() => onConfirm(enquiryId)}>Confirm booking</button> : null}
      {bookingConfirmed ? <span className="status-pill">booking confirmed</span> : null}
      {link ? <div className="form-success"><strong>Secure quote link</strong><a href={link} target="_blank" rel="noreferrer">{link}</a><button className="button button-outline button-small" onClick={() => navigator.clipboard.writeText(link)}>Copy link</button></div> : null}
    </div> : <p className="admin-meta">No quotation yet. Save a draft above, then open this section again.</p>}
  </details>;
}
