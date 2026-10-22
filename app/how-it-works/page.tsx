import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How quotations and bookings work",
  description: "Learn how to request a catering quotation and what happens after you send an enquiry."
};

const steps = [
  ["01", "Share your event details", "Tell us the occasion, date or timing if known, location, approximate guest count, and any preferences you would like the team to consider."],
  ["02", "The team reviews your request", "A team member reviews the details. They may contact you to clarify the service format, quantities, or other information needed to prepare a quotation."],
  ["03", "Receive a custom quotation", "The quotation is prepared for your request. It can be reviewed and the team can discuss revisions with you."],
  ["04", "Confirm the booking with the team", "A submitted enquiry or accepted quotation does not confirm availability. The team will explicitly confirm the booking and next steps."]
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero process-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>How it works</span></div><span className="eyebrow"><i className="eyebrow-dot" /> THE ENQUIRY PROCESS</span><h1>A clear path from first note to next step.</h1><p>There are no fixed online prices. The team reviews each request and follows up with a quotation for the event or order.</p><div className="page-hero-stamp" aria-hidden="true"><span>✳</span><small>One step<br />at a time</small></div></div></section>
      <section className="section process-page-section"><div className="container process-grid"><div className="process-intro"><span className="eyebrow">BEGIN WITH WHAT YOU HAVE</span><h2>A few practical details help.</h2><p>If your date, guest count, or menu preferences are still taking shape, you can say so in the form.</p><div className="process-prompt"><span className="process-prompt-icon" aria-hidden="true">✳</span><p>Useful starting points: occasion, date, location, guest or quantity estimate, and service preferences if known.</p></div><Link className="button button-coral" href="/request-quote">Request a quotation <span aria-hidden="true">↗</span></Link></div><div className="steps steps-numbered">{steps.map(([n, title, body]) => <article className="step" key={n}><span className="step-number">{n}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></div></section>
      <section className="quote-band"><div className="container quote-band-inner"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Tell the team what you’re planning.</h2></div><Link className="button button-light" href="/request-quote">Start an enquiry <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
