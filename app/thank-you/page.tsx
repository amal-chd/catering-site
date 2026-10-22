import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Enquiry received",
  description: "Your enquiry has been received by Raman Caterings.",
  robots: { index: false, follow: false }
};

type Props = { searchParams: Promise<{ reference?: string }> };

export default async function ThankYouPage({ searchParams }: Props) {
  const { reference } = await searchParams;
  const safeReference = reference && /^KAK-[A-Z0-9-]{4,30}$/.test(reference) ? reference : null;

  return (
    <section className="thank-you-section">
      <div className="thank-you-card">
        <span className="thank-you-mark" aria-hidden="true">✓</span>
        <span className="eyebrow">RAMAN CATERINGS · KAKKANAD</span>
        <h1>Thank you for getting in touch.</h1>
        <p>Your enquiry has been received. The team will review the details and follow up using your preferred contact method.</p>
        {safeReference ? <p className="thank-you-reference">Enquiry reference <strong>{safeReference}</strong></p> : null}
        <p className="thank-you-note">Your enquiry is not a booking confirmation. Availability and event details will be confirmed with you directly.</p>
        <div className="thank-you-actions"><Link className="button button-dark" href="/">Back to home <span aria-hidden="true">↗</span></Link><Link className="hero-link" href="/services">Explore services</Link></div>
      </div>
    </section>
  );
}
