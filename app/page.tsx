import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/content";

const serviceImages: Record<string, { src: string; alt: string }> = {
  "weddings-traditional-events": { src: "/images/traditional-events.jpg", alt: "Kerala event table set with banana leaves and brass serving vessels" },
  "corporate-catering": { src: "/images/corporate-catering.jpg", alt: "A catered buffet arranged in a bright meeting venue" },
  parties: { src: "/images/traditional-events.jpg", alt: "A welcoming dining table prepared for a gathering" },
  "institutional-catering": { src: "/images/corporate-catering.jpg", alt: "A generous buffet prepared for group dining" },
  "bulk-food-orders": { src: "/images/raman-caterings-hero.jpg", alt: "A Kerala meal presented on a fresh banana leaf" }
};

const steps = [
  { n: "01", title: "Tell us what you’re planning", body: "Share the occasion, date, location, and a guest estimate. You can leave details undecided." },
  { n: "02", title: "The team reviews your enquiry", body: "The team looks through your request and may follow up to clarify what you need." },
  { n: "03", title: "Receive a custom quotation", body: "Your quotation is prepared for your event. No instant fixed-price checkout or automatic date confirmation." }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-ornament" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">RAMAN CATERINGS · KAKKANAD, KERALA</span>
            <h1>Thoughtful food for the moments that bring us <em>together.</em></h1>
            <p>From weddings and traditional events to business gatherings, parties, institutional catering, and bulk orders, tell Raman Caterings what you are planning and request a custom quotation.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/request-quote">Tell us about your event <span aria-hidden="true">↗</span></Link>
              <Link className="hero-link" href="/services">Explore catering services</Link>
            </div>
          </div>
          <div className="hero-visual">
            <Image className="hero-photo" src="/images/raman-caterings-hero.jpg" alt="A Kerala feast arranged with banana leaves and brass serving vessels" fill priority sizes="(max-width: 640px) 100vw, 48vw" />
            <span className="art-caption">A gathering begins at the table</span>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="container trust-inner">
          <span className="trust-label">A considered start for every occasion</span>
          <span className="trust-item"><i className="trust-dot" /> Weddings & traditional events</span>
          <span className="trust-item"><i className="trust-dot" /> Corporate & institutions</span>
          <span className="trust-item"><i className="trust-dot" /> Parties & bulk orders</span>
        </div>
      </div>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">WHAT ARE YOU PLANNING?</span><h2>Made to fit the occasion.</h2></div>
            <p>Start with the kind of gathering. The team will review the details and prepare a quotation around your request.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <Link className="service-card" href={"/services/" + service.slug} key={service.slug}>
                <span className="service-card-image"><Image src={serviceImages[service.slug].src} alt={serviceImages[service.slug].alt} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" /></span>
                <span className="service-number">{service.number}<span className="service-arrow" aria-hidden="true">↗</span></span>
                <h3>{service.title}</h3><p>{service.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container process-grid">
          <div className="process-intro"><span className="eyebrow">A CLEAR NEXT STEP</span><h2>From first note to a considered quote.</h2><p>Every event is different. A few practical details help the team understand what you are looking for.</p><Link className="button button-outline" href="/how-it-works">See how it works <span aria-hidden="true">↗</span></Link></div>
          <div className="steps">{steps.map((step) => <div className="step" key={step.n}><span className="step-number">{step.n}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}</div>
        </div>
      </section>

      <section className="quote-band"><div className="container quote-band-inner"><div><span className="eyebrow">START WITH THE DETAILS YOU HAVE</span><h2>Let’s talk about the gathering you’re planning.</h2></div><Link className="button button-dark" href="/request-quote">Request a quotation <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
