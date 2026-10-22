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
      <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>How it works</span></div><span className="eyebrow">THE ENQUIRY PROCESS</span><h1>A clear path to a custom quotation.</h1><p>There are no fixed online prices. The team reviews each request and follows up with a quotation for the event or order.</p></div></section>
      <section className="section"><div className="container process-grid"><div className="process-intro"><span className="eyebrow">FIVE MINUTES TO START</span><h2>Begin with the details you have.</h2><p>If your date, guest count, or menu preferences are still taking shape, you can say so in the form.</p><Link className="button button-dark" href="/request-quote">Request a quotation <span aria-hidden="true">↗</span></Link></div><div className="steps">{steps.map(([n, title, body]) => <div className="step" key={n}><span className="step-number">{n}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div></div></section>
      <section className="quote-band"><div className="container quote-band-inner"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Tell the team what you’re planning.</h2></div><Link className="button button-dark" href="/request-quote">Start an enquiry <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
