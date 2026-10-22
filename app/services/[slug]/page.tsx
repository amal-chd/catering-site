import type { Metadata } from "next";
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
      <section className="page-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link><span>/</span><span>{service.title}</span></div>
        <span className="eyebrow">{service.number} · RAMAN CATERINGS · KAKKANAD</span>
        <h1>{service.title}</h1><p>{service.short}</p>
      </div></section>
      <section className="service-detail"><div className="container detail-layout">
        <div className="detail-copy"><h2>Start with what you know.</h2><p>{service.description}</p><p>{service.prompt} Menu and service details can be discussed after the team reviews your request. A submitted enquiry is a request for follow-up, not a confirmed booking.</p><p>Service coverage and availability are confirmed by the team after reviewing your event details.</p></div>
        <aside className="detail-aside"><span className="eyebrow">YOUR NEXT STEP</span><h3>Request a custom quotation</h3><p>Share the date, location, guest estimate, and any preferences you already have.</p><Link className="button button-dark" href={"/request-quote?service=" + service.slug}>Enquire about this service <span aria-hidden="true">↗</span></Link></aside>
      </div></section>
      <section className="quote-band"><div className="container quote-band-inner"><div><span className="eyebrow">CUSTOM QUOTATIONS</span><h2>Have a few details ready? That’s enough to begin.</h2></div><Link className="button button-dark" href="/request-quote">Tell us about it <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
