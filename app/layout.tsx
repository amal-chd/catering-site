import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteUrl } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Raman Caterings | Custom catering in Kakkanad, Kerala", template: "%s | Raman Caterings" },
  description: "Plan weddings, traditional events, corporate catering, parties, institutional meals, and bulk food orders with Raman Caterings in Kakkanad, Kerala. Request a custom quotation.",
  openGraph: {
    type: "website", locale: "en_IN", siteName: "Raman Caterings",
    title: "Raman Caterings | Kakkanad, Kerala", description: "Tell us about your gathering and request a custom catering quotation.",
    images: [{ url: "/images/raman-caterings-hero.jpg", width: 1680, height: 945, alt: "A Kerala feast arranged for a gathering" }]
  },
  twitter: { card: "summary_large_image", images: ["/images/raman-caterings-hero.jpg"] }
};

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 28 28"><path d="M5.5 23V5h8c4.7 0 7.5 2.6 7.5 6.8 0 3.2-1.6 5.4-4.6 6.3L22 23h-5.1l-5.4-6.3h-1V23zm5-10.1h2.7c2.1 0 3.2-.8 3.2-2.6s-1.1-2.6-3.2-2.6h-2.7z" /></svg></span>;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="wordmark" href="/" aria-label="Raman Caterings home">
          <Mark /><span className="wordmark-text">RAMAN<span className="wordmark-small">CATERINGS · KAKKANAD</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/contact">Contact</Link>
        </nav>
        <details className="mobile-menu">
          <summary>Menu</summary>
          <div className="mobile-menu-panel">
            <Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/contact">Contact</Link>
          </div>
        </details>
        <Link className="button button-small button-dark nav-cta" href="/request-quote">Request a quote <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link className="wordmark footer-wordmark" href="/"><Mark /><span className="wordmark-text">RAMAN<span className="wordmark-small">CATERINGS · KAKKANAD</span></span></Link>
          <p className="footer-note">Tell us what you are planning. The team will review your details and prepare a custom quotation.</p>
        </div>
        <div className="footer-links">
          <div><span className="eyebrow">EXPLORE</span><Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy details</Link></div>
          <div><span className="eyebrow">GET STARTED</span><Link href="/request-quote">Request a quotation</Link><Link href="/admin/login">Staff sign in</Link></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Raman Caterings · Kakkanad, Kerala</span><span>Custom quotations · Enquiries reviewed by the team</span></div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></body></html>;
}
