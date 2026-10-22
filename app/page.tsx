import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";

const steps = [
  { n: "01", title: "Share what you know", body: "Tell us the occasion, date, location, and guest or quantity estimate. It is fine if a few details are still taking shape." },
  { n: "02", title: "The team reviews your request", body: "A team member looks over the details and may follow up to understand the service you have in mind." },
  { n: "03", title: "Receive a custom quotation", body: "Your quotation is prepared for your event or order. Pricing is discussed with the team rather than shown as a fixed online checkout." },
  { n: "04", title: "Confirm the next step together", body: "Availability and booking details are confirmed directly with you by the team." }
];

const planningNotes = [
  { number: "01", title: "Start with the occasion", body: "Weddings, traditional events, business gatherings, parties, institutions, and bulk orders." },
  { number: "02", title: "Share the useful details", body: "Date, location, approximate guests or quantities, timing, and service preferences if known." },
  { number: "03", title: "Shape a quotation together", body: "The team reviews your enquiry and follows up about the details needed for a tailored quote." }
];

const faqs = [
  ["What details should I include in my enquiry?", "Share the occasion, event date, location, and approximate guest count or order quantity if you know them. You can mention any service preferences or details still to be decided."],
  ["Will I see a fixed price online?", "No. The team reviews each request and prepares a custom quotation around the event or order details."],
  ["Does submitting an enquiry confirm my booking?", "No. An enquiry is a request for follow-up. The team confirms availability and booking details with you directly."],
  ["Can I enquire before all my plans are final?", "Yes. Share what you know and note what is undecided. The team may follow up if more information is needed for the quotation."]
];

export default function HomePage() {
  return (
    <>
      <section className="hero hero-home">
        <div className="hero-sunwash" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i className="eyebrow-dot" /> Catering for gatherings in Kakkanad</span>
            <h1>Gather around something <em>good.</em></h1>
            <p>From weddings and traditional celebrations to business meals, parties, institutional catering, and bulk orders, tell us what you’re planning and request a custom quotation.</p>
            <div className="hero-actions">
              <Link className="button button-coral" href="/request-quote">Tell us about your event <span aria-hidden="true">↗</span></Link>
              <Link className="hero-link" href="/services">Explore our catering <span aria-hidden="true">→</span></Link>
            </div>
            <div className="hero-points"><span><i aria-hidden="true">✳</i> Custom quotations</span><span><i aria-hidden="true">✳</i> Enquiries reviewed by the team</span></div>
          </div>
          <figure className="hero-visual">
            <Image className="hero-photo" src="/images/raman-feast-illustration.jpg" alt="Illustration of a Kerala feast arranged on banana leaves beside brass serving vessels" fill priority sizes="(max-width: 700px) 100vw, 50vw" />
            <span className="hero-image-chip"><span className="chip-dot" /> A table for your gathering</span>
            <figcaption className="art-caption">Raman Caterings <span>· Kakkanad, Kerala</span></figcaption>
          </figure>
        </div>
        <span className="hero-flower flower-one" aria-hidden="true">✳</span><span className="hero-flower flower-two" aria-hidden="true">✳</span>
      </section>

      <section className="occasion-strip" aria-label="Catering occasions">
        <div className="container occasion-inner"><span className="occasion-label">A thoughtful start for</span><span className="occasion-pill">Weddings & traditions</span><span className="occasion-pill">Business & institutions</span><span className="occasion-pill">Parties & bulk orders</span></div>
      </section>

      <section className="section service-section">
        <div className="container">
          <div className="section-heading section-heading-home">
            <div><span className="eyebrow">WHAT ARE YOU PLANNING?</span><h2>Food for every kind of gathering.</h2></div>
            <div className="section-heading-side"><p>Choose a starting point. The team will review your details and prepare a quotation around your request.</p><Link className="text-link" href="/services">View all services <span aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <Link className={`service-card service-card-${index + 1}`} href={`/services/${service.slug}`} key={service.slug}>
                <span className="service-card-image"><Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" /></span>
                <span className="service-card-body"><span className="service-number"><span>{service.number} <i aria-hidden="true">·</i> {index === 0 ? "CELEBRATE" : index === 1 ? "GATHER" : index === 2 ? "SHARE" : index === 3 ? "SERVE" : "ORDER"}</span><span className="service-arrow" aria-hidden="true">↗</span></span><span className="service-card-title">{service.title}</span><span className="service-card-copy">{service.short}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="planning-section">
        <div className="container planning-layout">
          <div className="planning-visual">
            <Image src="/images/traditional-events.jpg" alt="A Kerala meal arranged for a traditional gathering" fill sizes="(max-width: 760px) 100vw, 42vw" />
            <div className="planning-sticker"><span>Made for</span><strong>your<br />gathering</strong><i aria-hidden="true">✳</i></div>
          </div>
          <div className="planning-copy"><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h2>Every gathering has its own shape.</h2><p>Start with the details you have. Menu and service preferences can be discussed with the team as your request takes shape.</p>
            <div className="planning-notes">{planningNotes.map((note) => <div className="planning-note" key={note.number}><span className="planning-note-number">{note.number}</span><div><h3>{note.title}</h3><p>{note.body}</p></div></div>)}</div>
            <Link className="button button-outline" href="/how-it-works">How the enquiry works <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="process-section section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">FROM FIRST NOTE TO NEXT STEP</span><h2>A clear path to a custom quote.</h2></div><p>There are no fixed online packages. Share what you know and the team will guide the conversation from there.</p></div>
          <div className="process-cards">{steps.map((step) => <article className="process-card" key={step.n}><span className="process-card-number">{step.n}</span><span className="process-card-flourish" aria-hidden="true">✳</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
        </div>
      </section>

      <section className="section faq-section"><div className="container faq-layout"><div className="faq-intro"><span className="eyebrow">GOOD TO KNOW</span><h2>A few helpful answers.</h2><p>Start with the details you have. The team can follow up about the rest.</p><Link className="text-link" href="/how-it-works">See how it works <span aria-hidden="true">↗</span></Link></div><div className="faq-list">{faqs.map(([question, answer], index) => <details className="faq-item" key={question}><summary><span>{question}</span><i aria-hidden="true">{index === 0 ? "−" : "+"}</i></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="quote-band"><div className="quote-band-shape quote-band-shape-one" aria-hidden="true" /><div className="quote-band-shape quote-band-shape-two" aria-hidden="true" /><div className="container quote-band-inner"><div><span className="eyebrow">START WITH THE DETAILS YOU HAVE</span><h2>Let’s talk about the table you’re planning.</h2><p>A date, a place, or simply an idea is enough to start an enquiry.</p></div><Link className="button button-light" href="/request-quote">Request a custom quote <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
