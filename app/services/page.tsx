import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catering services",
  description: "Explore catering enquiry options for weddings, corporate events, parties, institutions, and bulk food orders in Kakkanad."
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero services-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Services</span></div>
        <span className="eyebrow"><i className="eyebrow-dot" /> RAMAN CATERINGS · KAKKANAD</span>
        <h1>One table. Many reasons to gather.</h1>
        <p>Choose the kind of event or order you are planning. Share the date, location, and a guest or quantity estimate to start a custom quotation.</p>
        <div className="page-hero-stamp" aria-hidden="true"><span>✳</span><small>Made for<br />your occasion</small></div>
      </div></section>
      <section className="section service-section service-page-section"><div className="container">
        <div className="service-page-intro"><span className="eyebrow">FIND YOUR STARTING POINT</span><p>Each enquiry is reviewed by the team. Menu, quantities, and service details can be discussed as the quotation takes shape.</p></div>
        <div className="service-grid service-grid-page">
          {services.map((service, index) => <Link className={`service-card service-card-${index + 1}`} href={`/services/${service.slug}`} key={service.slug}>
            <span className="service-card-image"><Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" /></span>
            <span className="service-card-body"><span className="service-number"><span>{service.number} <i aria-hidden="true">·</i> {index === 0 ? "CELEBRATE" : index === 1 ? "GATHER" : index === 2 ? "SHARE" : index === 3 ? "SERVE" : "ORDER"}</span><span className="service-arrow" aria-hidden="true">↗</span></span><span className="service-card-title">{service.title}</span><span className="service-card-copy">{service.short}</span><span className="service-card-link">Explore this service <span aria-hidden="true">→</span></span></span>
          </Link>)}
        </div>
      </div></section>
      <section className="quote-band"><div className="quote-band-shape quote-band-shape-one" aria-hidden="true" /><div className="container quote-band-inner"><div><span className="eyebrow">NOT SURE WHERE TO START?</span><h2>Tell us what you need and we’ll take it from there.</h2></div><Link className="button button-light" href="/request-quote">Start an enquiry <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
