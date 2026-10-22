import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Raman Caterings in Kakkanad, Kerala by sending an event enquiry."
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero contact-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Contact</span></div><span className="eyebrow"><i className="eyebrow-dot" /> CONTACT THE TEAM</span><h1>Let’s start with your gathering.</h1><p>Use the enquiry form to describe your event or order. The team can review the request and follow up using your preferred contact method.</p></div></section>
      <section className="section contact-page-section"><div className="container contact-grid">
        <div className="contact-visual"><Image src="/images/raman-feast-illustration.jpg" alt="Illustration of a Kerala feast set for a gathering" fill sizes="(max-width: 760px) 100vw, 54vw" /><span className="contact-visual-caption">A table set for your plans</span></div>
        <div className="contact-info-stack"><div className="contact-panel"><span className="eyebrow">SERVICE AREA</span><h2>Kakkanad, Kerala</h2><p className="contact-panel-intro">Share a few details about what you are planning, and the team will review your enquiry.</p><div className="contact-detail"><span className="contact-detail-icon" aria-hidden="true">01</span><div><strong>Event or order</strong><span>Occasion, service type, and approximate guest count or quantity.</span></div></div><div className="contact-detail"><span className="contact-detail-icon" aria-hidden="true">02</span><div><strong>Date and place</strong><span>Event date, timing, venue, or locality if you know them.</span></div></div><div className="contact-detail"><span className="contact-detail-icon" aria-hidden="true">03</span><div><strong>How to reach you</strong><span>Share at least one contact method in the enquiry form.</span></div></div></div>
          <div className="contact-cta"><span className="eyebrow">SEND AN ENQUIRY</span><h2>We’ll take it from there.</h2><p>Pricing and service details are reviewed for each request. Availability is confirmed by the team.</p><Link className="button button-light" href="/request-quote">Request a quotation <span aria-hidden="true">↗</span></Link></div></div>
      </div></section>
    </>
  );
}
