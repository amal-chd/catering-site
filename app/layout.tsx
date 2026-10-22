import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import BrandMark from "@/components/BrandMark";
import "./globals.css";
import { siteUrl } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Raman Caterings | Thoughtful catering in Kakkanad, Kerala", template: "%s | Raman Caterings" },
  description: "Plan weddings, traditional events, corporate catering, parties, institutional meals, and bulk food orders with Raman Caterings in Kakkanad, Kerala. Request a custom quotation.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Raman Caterings",
    title: "Raman Caterings | Kakkanad, Kerala",
    description: "Tell us about your gathering and request a custom catering quotation.",
    images: [{ url: "/images/raman-feast-illustration.jpg", width: 1774, height: 887, alt: "An illustrated Kerala feast set for a gathering" }]
  },
  twitter: { card: "summary_large_image", images: ["/images/raman-feast-illustration.jpg"] }
};

function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`wordmark${footer ? " wordmark-footer" : ""}`} href="/" aria-label="Raman Caterings home">
      <BrandMark className="brand-symbol" />
      <span className="wordmark-text"><span className="wordmark-name">Raman</span><span className="wordmark-small">CATERINGS · KAKKANAD</span></span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <>
      <div className="brand-ribbon"><div className="container ribbon-inner"><span>Food for the moments that bring us together</span><span className="ribbon-location"><span aria-hidden="true">⌖</span> Kakkanad · Kerala</span></div></div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Wordmark />
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/services">Services</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <details className="mobile-menu">
            <summary><span className="menu-lines" aria-hidden="true"><i /><i /></span><span>Menu</span></summary>
            <div className="mobile-menu-panel">
              <Link href="/services">Services</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </details>
          <Link className="button button-small button-dark nav-cta" href="/request-quote">Request a quote <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-topline"><span className="footer-spark" aria-hidden="true">✳</span><p>Tell us what you’re gathering for.<br /><em>We’ll help shape the next step.</em></p><Link className="button button-light" href="/request-quote">Start an enquiry <span aria-hidden="true">↗</span></Link></div>
      <div className="container footer-main">
        <div className="footer-brand"><Wordmark footer /><p className="footer-note">Thoughtful catering enquiries for weddings, traditional events, businesses, parties, institutions, and bulk orders.</p><span className="footer-location">Kakkanad · Kerala</span></div>
        <div className="footer-links">
          <div><span className="eyebrow">EXPLORE</span><Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy details</Link></div>
          <div><span className="eyebrow">GET STARTED</span><Link href="/request-quote">Request a quotation</Link><Link href="/services/weddings-traditional-events">Weddings & events</Link><Link href="/services/corporate-catering">Corporate catering</Link></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Raman Caterings</span><span>Custom quotations · Enquiries reviewed by the team</span></div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content">{children}</main><SiteFooter />
    <Script
      id="usercentrics-cmp"
      src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
      data-settings-id="Ur-faH6OBUly-h"
      strategy="beforeInteractive"
      async
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', 'G-CG47TTK70T');
var googleTagScript = document.createElement('script');
googleTagScript.async = true;
googleTagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-CG47TTK70T';
document.head.appendChild(googleTagScript);`}
    </Script>
  </body></html>;
}
