import Link from "next/link";
import { services } from "@/lib/content";

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
            <span className="eyebrow">CATERING IN KAKKANAD · KERALA</span>
            <h1>Good food brings a gathering <em>together.</em></h1>
            <p>Planning a wedding, a business event, a celebration, or a bulk order? Share what you have in mind and request a custom quotation.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/request-quote">Tell us about your event <span aria-hidden="true">↗</span></Link>
              <Link className="hero-link" href="/services">Explore catering services</Link>
            </div>
          </div>
          <div className="hero-visual" aria-label="Stylized illustration of a shared meal">
            <div className="plate-art">
              <span className="art-leaf leaf-a" /><span className="art-leaf leaf-b" />
              <span className="art-leaf leaf-c" /><span className="art-leaf leaf-d" />
              <span className="plate-center" />
            </div>
            <span className="art-caption">made for sharing</span>
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
