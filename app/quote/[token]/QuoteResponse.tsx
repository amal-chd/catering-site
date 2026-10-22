"use client";

import { useState } from "react";

export default function QuoteResponse({ token }: { token: string }) {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function respond(response: "accepted" | "revision_requested" | "declined") {
    setBusy(true);
    setState("");
    try {
      const result = await fetch("/api/quotes/" + token + "/response", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ response, note })
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || "Could not save your response.");
      setState(response === "accepted" ? "Your response is recorded. The team will confirm availability and booking details separately." : response === "revision_requested" ? "Your request for a revision has been sent to the team." : "Your response has been recorded.");
    } catch (error) {
      setState(error instanceof Error ? error.message : "Could not save your response.");
    } finally {
      setBusy(false);
    }
  }

  return <div>
    <div className="field" style={{ marginTop: 24 }}>
      <label htmlFor="response-note">Note for the team <span>Optional</span></label>
      <textarea id="response-note" value={note} maxLength={1000} onChange={(event) => setNote(event.target.value)} placeholder="Add context if you are requesting a revision." />
    </div>
    <div className="quote-reply">
      <button className="button button-dark" disabled={busy} onClick={() => respond("accepted")}>Accept quotation</button>
      <button className="button button-outline" disabled={busy} onClick={() => respond("revision_requested")}>Request a revision</button>
      <button className="button button-outline" disabled={busy} onClick={() => respond("declined")}>Decline</button>
    </div>
    {state ? <p className="notice" role="status" style={{ marginTop: 18 }}>{state}</p> : null}
  </div>;
}
