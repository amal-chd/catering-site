import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catering services",
  description: "Explore catering enquiry options for weddings, corporate events, parties, institutions, and bulk food orders in Kakkanad."
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Services</span></div>
        <span className="eyebrow">RAMAN CATERINGS · KAKKANAD</span>
        <h1>Different occasions.<br />One thoughtful conversation.</h1>
        <p>Choose the type of event or order you are planning. Share the date, location, and a guest or quantity estimate to start a custom quotation.</p>
      </div></section>
      <section className="section section-soft"><div className="container"><div className="service-grid">
        {services.map((service) => <Link className="service-card" href={"/services/" + service.slug} key={service.slug}>
          <span className="service-number">{service.number}<span className="service-arrow" aria-hidden="true">↗</span></span><h3>{service.title}</h3><p>{service.short}</p>
        </Link>)}
      </div></div></section>
      <section className="quote-band"><div className="container quote-band-inner"><div><span className="eyebrow">NOT SURE WHICH FITS?</span><h2>Tell us what you need and we’ll take it from there.</h2></div><Link className="button button-dark" href="/request-quote">Start an enquiry <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
