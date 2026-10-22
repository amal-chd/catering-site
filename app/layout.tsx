import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteUrl } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Catering in Kakkanad, Kerala | Request a custom quotation", template: "%s | Catering in Kakkanad" },
  description: "Share your event details with a catering service in Kakkanad, Kerala, and request a custom quotation.",
  openGraph: {
    type: "website", locale: "en_IN", siteName: "Catering in Kakkanad",
    title: "Catering in Kakkanad, Kerala", description: "Tell us about your event and request a custom quotation."
  }
};

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="wordmark" href="/" aria-label="Catering service home">
          <Mark /><span className="wordmark-text">CATERING<span className="wordmark-small">KAKKANAD · KERALA</span></span>
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
          <Link className="wordmark footer-wordmark" href="/"><Mark /><span className="wordmark-text">CATERING<span className="wordmark-small">KAKKANAD · KERALA</span></span></Link>
          <p className="footer-note">Tell us what you are planning. The team will review your details and prepare a custom quotation.</p>
        </div>
        <div className="footer-links">
          <div><span className="eyebrow">EXPLORE</span><Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy details</Link></div>
          <div><span className="eyebrow">GET STARTED</span><Link href="/request-quote">Request a quotation</Link><Link href="/admin/login">Staff sign in</Link></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} · Catering in Kakkanad</span><span>Custom quotations · Enquiries reviewed by the team</span></div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
