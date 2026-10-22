"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

type Props = { selectedService?: string };

export default function EnquiryForm({ selectedService = "" }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submissionKey = useRef("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = event.currentTarget;
    const values = new FormData(form);
    if (!submissionKey.current) submissionKey.current = crypto.randomUUID();

    const payload = Object.fromEntries(values.entries());
    payload.privacyConsent = values.get("privacyConsent") === "on" ? "true" : "false";
    payload.turnstileToken = String(values.get("cf-turnstile-response") || "");
    payload.idempotencyKey = submissionKey.current;

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not submit your enquiry. Please try again.");
      const reference = typeof result.reference === "string" ? result.reference : "";
      router.replace(reference ? `/thank-you?reference=${encodeURIComponent(reference)}` : "/thank-you");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not submit your enquiry. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer /> : null}
        <form className="form-card" onSubmit={submit}>
          <h2>Event details</h2>
          <p>Required fields are marked. Approximate details are welcome.</p>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="serviceType">What are you planning? <span>Required</span></label>
              <select id="serviceType" name="serviceType" required defaultValue={selectedService}>
                <option value="" disabled>Select a service</option>
                <option value="weddings-traditional-events">Wedding or traditional event</option>
                <option value="corporate-catering">Corporate catering</option>
                <option value="parties">Party</option>
                <option value="institutional-catering">Institutional catering</option>
                <option value="bulk-food-orders">Bulk food order</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div className="field"><label htmlFor="eventDate">Event date <span>Optional</span></label><input id="eventDate" name="eventDate" type="date" /></div>
            <div className="field"><label htmlFor="guestCountMin">Guest or quantity estimate <span>Optional</span></label><input id="guestCountMin" name="guestCountMin" type="number" min="1" max="100000" placeholder="For example, 120" /></div>
            <div className="field"><label htmlFor="venueLocality">Venue or locality <span>Optional</span></label><input id="venueLocality" name="venueLocality" maxLength={160} placeholder="Area or venue name" /></div>
            <div className="field field-full"><label htmlFor="eventNotes">Anything else the team should know? <span>Optional</span></label><textarea id="eventNotes" name="eventNotes" maxLength={3000} placeholder="Service style, preferences, timing, or details still to be decided" /></div>
          </div>

          <h2 style={{ marginTop: 34 }}>Your contact details</h2>
          <p>Provide at least one way for the team to reply.</p>
          <div className="field-grid">
            <div className="field"><label htmlFor="customerName">Your name <span>Required</span></label><input id="customerName" name="customerName" autoComplete="name" maxLength={120} required /></div>
            <div className="field"><label htmlFor="organizationName">Organization <span>Optional</span></label><input id="organizationName" name="organizationName" autoComplete="organization" maxLength={160} /></div>
            <div className="field"><label htmlFor="email">Email <span>Optional</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} /></div>
            <div className="field"><label htmlFor="phone">Phone <span>Optional</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} /></div>
            <div className="field field-full"><label htmlFor="preferredContact">Preferred way to be contacted</label><select id="preferredContact" name="preferredContact" defaultValue=""><option value="">No preference</option><option value="email">Email</option><option value="phone">Phone</option></select></div>
          </div>

          <div className="hp-field" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? <div className="turnstile-wrap"><div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} /></div> : null}
          <div className="checkbox-row"><input id="privacyConsent" name="privacyConsent" type="checkbox" required /><span><label htmlFor="privacyConsent">I agree that the catering team may use these details to respond to this enquiry.</label> <a href="/privacy">Read the privacy details</a>.</span></div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button button-dark form-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send enquiry"} <span aria-hidden="true">↗</span></button>
          <p className="form-footnote">A quotation is prepared by the team. Submitting this form does not confirm a booking.</p>
        </form>
    </>
  );
}

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}
