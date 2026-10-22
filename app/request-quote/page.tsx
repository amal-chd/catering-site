import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "./EnquiryForm";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request a catering quotation",
  description: "Tell the catering team about your event in Kakkanad, Kerala and request a custom quotation."
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function RequestQuotePage({ searchParams }: Props) {
  const query = await searchParams;
  const selectedService = services.some((service) => service.slug === query.service) ? query.service : "";
  return (
    <section className="form-section">
      <div className="container form-shell">
        <div className="form-intro">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Request a quotation</span></div>
          <div className="form-intro-card">
            <div className="form-intro-visual"><Image src="/images/raman-feast-illustration.jpg" alt="Illustrated Kerala feast" fill sizes="(max-width: 760px) 100vw, 35vw" /></div>
            <span className="eyebrow"><i className="eyebrow-dot" /> A CUSTOM QUOTATION STARTS HERE</span>
            <h1>Tell us what you’re planning.</h1>
            <p>Share the details you have. The catering team will review your request and follow up if more information is needed.</p>
            <div className="form-side-note"><strong>Helpful details to include</strong><span>Date · location · guests or quantity · service preferences</span></div>
            <span className="form-location">Kakkanad · Kerala</span>
          </div>
        </div>
        <EnquiryForm selectedService={selectedService} />
      </div>
    </section>
  );
}
