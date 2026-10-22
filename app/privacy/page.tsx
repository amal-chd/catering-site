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
      <section className="page-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Privacy details</span></div>
        <span className="eyebrow">PRIVACY DETAILS · OWNER REVIEW REQUIRED</span>
        <h1>How enquiry details are used.</h1>
        <p>This draft describes the current website workflow. The business owner must review and complete it before the site collects real enquiries.</p>
      </div></section>
      <section className="section"><div className="content-narrow">
        <h2 style={{ fontSize: 30 }}>Details submitted through the form</h2>
        <p>The enquiry form can collect your name, contact information, event or order details, and any note you choose to include. These details are stored in the website’s private enquiry system so the catering team can review your request, contact you, and prepare a quotation.</p>
        <p>If an email address is provided and email delivery is configured, the website may send a receipt, quotation, or reply related to your enquiry. The website does not collect payment card details.</p>
        <p>The business must add its preferred privacy contact, retention and deletion approach, and any additional information required for its actual practices before launch. Do not use this draft as the final notice.</p>
        <p><Link className="button button-outline button-small" href="/request-quote">Return to the enquiry form</Link></p>
      </div></section>
    </>
  );
}
