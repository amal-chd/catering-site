import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the catering team in Kakkanad, Kerala by sending an event enquiry."
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Contact</span></div><span className="eyebrow">CONTACT THE TEAM</span><h1>Start with a few details.</h1><p>Use the enquiry form to describe your event or order. The team can then review the request and follow up using your preferred contact method.</p></div></section>
      <section className="section"><div className="container contact-grid">
        <div className="contact-panel"><span className="eyebrow">SERVICE AREA</span><h2>Kakkanad, Kerala</h2><div className="contact-detail"><strong>What to share</strong><span>Event date, location, approximate guest count, and service type.</span></div><div className="contact-detail"><strong>Custom quotations</strong><span>Pricing and service details are reviewed for each enquiry.</span></div><div className="contact-detail"><strong>Availability</strong><span>The team will confirm whether the date and location can be accommodated.</span></div></div>
        <div className="contact-cta"><span className="eyebrow">SEND AN ENQUIRY</span><h2>We’ll take it from there.</h2><p>Phone, email, and other direct contact details can be added here once the business confirms the preferred channel.</p><Link className="button button-light" href="/request-quote">Request a quotation <span aria-hidden="true">↗</span></Link></div>
      </div></section>
    </>
  );
}
