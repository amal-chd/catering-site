# Raman Caterings Website

A mobile-first Next.js website for Raman Caterings, serving enquiries for Kakkanad, Kerala and staff-created custom quotations. The interface intentionally contains no invented phone number, menu, prices, testimonials, service-radius promises, or legal claims. The editorial food photography is original image-generation artwork and should not be presented as a photograph of a specific completed event.

## Included

- Public home, service overview, five service detail pages, process, contact, quotation enquiry, and post-enquiry confirmation pages.
- Server-validated enquiry API with idempotency, honeypot, database-backed rate limiting, and production Turnstile verification.
- Supabase Auth staff sign-in and RLS-protected admin inbox.
- Staff status updates and custom quote creation with server-calculated line totals.
- Opaque quote links and customer response capture.
- Supabase migration and environment template.

## Start

1. Install Node.js compatible with Next.js 16.
2. Copy .env.example to .env.local, set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` for local work, and fill in the Supabase URL, publishable key, and server-only secret key.
3. Apply the SQL files in supabase/migrations in filename order.
4. Create the initial staff account in Supabase Auth, then insert its user UUID and role in public.admin_profiles.
5. Install dependencies with npm install and start with npm run dev.

The app renders without Supabase values, but enquiry submissions and admin pages require a configured project. Production enquiry submissions require both Turnstile keys. Email requires a verified sender domain and Resend settings. Without email, staff can copy a generated quote link and send it through an owner-approved channel. A successful enquiry redirects to `/thank-you?reference=KAK-…`; the stable post-submit URL is `https://raman.vercel.app/thank-you`.

## Before launch

Confirm currency, service coverage, menu content, quote and booking terms, privacy wording, production domain ownership, and staff roles. Complete the privacy page and set PRIVACY_NOTICE_VERSION only after the owner approves the final notice. Configure Turnstile, transactional email, backups, retention, and provider limits. The original generated images are editorial illustrations of catering settings; they do not represent documented past events or a verified portfolio.

The public site can be deployed independently. Enquiry storage and staff workflows need the Supabase values and migrations above; spam protection needs both Turnstile keys; email notifications need the Resend settings. Configure and verify those services, along with the owner-approved privacy notice, before accepting live enquiries.
