import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy details",
  description: "How enquiry details are used on this catering website.",
  robots: { index: false, follow: false }
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero privacy-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Privacy details</span></div>
        <span className="eyebrow"><i className="eyebrow-dot" /> PRIVACY DETAILS</span>
        <h1>Clear about the details you share.</h1>
        <p>This draft describes the current website workflow. The business owner must review and complete it before the site collects real enquiries.</p>
      </div></section>
      <section className="section privacy-section"><div className="content-narrow">
        <div className="privacy-review-note"><span aria-hidden="true">✳</span><p><strong>Owner review required.</strong> This is a draft for the website’s current enquiry workflow, not a final notice. The business must confirm and complete the details before launch.</p></div>
        <article className="privacy-block"><span className="eyebrow">01 · ENQUIRY DETAILS</span><h2>Details submitted through the form</h2><p>The enquiry form can collect your name, contact information, event or order details, and any note you choose to include. These details are stored in the website’s private enquiry system so the catering team can review your request, contact you, and prepare a quotation.</p></article>
        <article className="privacy-block"><span className="eyebrow">02 · RELATED MESSAGES</span><h2>Replies about your request</h2><p>If an email address is provided and email delivery is configured, the website may send a receipt, quotation, or reply related to your enquiry. The website does not collect payment card details.</p></article>
        <article className="privacy-block"><span className="eyebrow">03 · BEFORE LAUNCH</span><h2>Business contact and retention</h2><p>The business must add its preferred privacy contact, retention and deletion approach, and any additional information required for its actual practices before launch. Do not use this draft as the final notice.</p><Link className="button button-outline button-small" href="/request-quote">Return to the enquiry form <span aria-hidden="true">↗</span></Link></article>
      </div></section>
    </>
  );
}
