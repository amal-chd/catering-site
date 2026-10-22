import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return { title: "Service not found" };
  return { title: service.title, description: service.description };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <section className="page-hero service-detail-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link><span>/</span><span>{service.title}</span></div>
        <div className="service-hero-grid">
          <div className="service-hero-copy"><span className="eyebrow"><i className="eyebrow-dot" /> {service.number} · RAMAN CATERINGS</span><h1>{service.title}</h1><p>{service.short}</p><Link className="button button-coral" href={`/request-quote?service=${service.slug}`}>Enquire about this service <span aria-hidden="true">↗</span></Link></div>
          <figure className="service-hero-image"><Image src={service.image} alt={service.imageAlt} fill priority sizes="(max-width: 760px) 100vw, 48vw" /><figcaption>{service.number} <span>·</span> Kakkanad, Kerala</figcaption></figure>
        </div>
      </div></section>
      <section className="service-detail"><div className="container detail-layout">
        <div className="detail-copy"><span className="eyebrow">A QUOTATION THAT STARTS WITH YOUR DETAILS</span><h2>Start with what you know.</h2><p>{service.description}</p><p>{service.prompt} Menu and service details can be discussed after the team reviews your request.</p><div className="detail-note"><span className="detail-note-icon" aria-hidden="true">✳</span><p>A submitted enquiry is a request for follow-up, not a confirmed booking. The team will confirm service coverage and availability after reviewing the details.</p></div></div>
        <aside className="detail-aside"><span className="eyebrow">YOUR NEXT STEP</span><h3>Request a custom quotation</h3><p>Share the date, location, guest estimate, and any preferences you already have.</p><Link className="button button-dark" href={`/request-quote?service=${service.slug}`}>Tell us about it <span aria-hidden="true">↗</span></Link><Link className="aside-text-link" href="/how-it-works">See how the process works <span aria-hidden="true">→</span></Link></aside>
      </div></section>
      <section className="quote-band"><div className="container quote-band-inner"><div><span className="eyebrow">CUSTOM QUOTATIONS</span><h2>Have a few details ready? That’s enough to begin.</h2></div><Link className="button button-light" href="/request-quote">Tell us about it <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
