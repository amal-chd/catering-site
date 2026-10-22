import type { Metadata } from "next";
import { requireStaffPage } from "@/lib/auth";
import AdminTools, { type AdminEnquiry } from "./AdminTools";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiry inbox", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const context = await requireStaffPage();
  const { data } = await context.supabase
    .from("enquiries")
    .select("id, public_reference, status, customer_name, organization_name, email, phone, event_date, guest_count_min, venue_locality, event_notes, created_at, service_type_id, service_types(display_name)")
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(100);
  const { data: bookingData } = await context.supabase
    .from("bookings")
    .select("id, enquiry_id, status, event_date, created_at, enquiries(public_reference, customer_name)")
    .order("event_date", { ascending: true })
    .limit(100);

  const enquiries = (data || []).map((record: Record<string, unknown>) => {
    const service = record.service_types as { display_name?: string } | null;
    return { ...record, service_name: service?.display_name || "Catering enquiry" } as AdminEnquiry;
  });
  const bookings = (bookingData || []).map((record: Record<string, unknown>) => {
    const enquiry = record.enquiries as { public_reference?: string; customer_name?: string } | null;
    return { ...record, public_reference: enquiry?.public_reference || "", customer_name: enquiry?.customer_name || "Customer" };
  }) as { id: string; enquiry_id: string; status: string; event_date: string | null; public_reference: string; customer_name: string }[];

  return <section className="admin-page"><div className="container">
    <div className="admin-top"><div><span className="eyebrow">PRIVATE STAFF AREA</span><h1>Enquiry inbox</h1></div><div className="admin-user">Signed in as {context.user.email}<br />Role: {context.role}</div></div>
    <p>Review requests, update their status, and prepare custom quotations. A quote acceptance still requires staff confirmation before a booking is confirmed.</p>
    <AdminTools enquiries={enquiries} bookings={bookings} currency={process.env.QUOTE_CURRENCY || "INR"} />
  </div></section>;
}
