import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/auth";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;

  const { data: enquiry } = await staff.supabase.from("enquiries")
    .select("id, event_date").eq("id", id).maybeSingle();
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });

  const { data: acceptedQuote } = await staff.supabase.from("quotes")
    .select("id").eq("enquiry_id", id).eq("status", "accepted")
    .order("revision_number", { ascending: false }).limit(1).maybeSingle();
  if (!acceptedQuote) return NextResponse.json({ error: "Confirm only after the customer accepts a quotation." }, { status: 409 });
  const { data: existingBooking } = await staff.supabase.from("bookings")
    .select("id, status").eq("enquiry_id", id).maybeSingle();
  if (existingBooking?.status === "confirmed") return NextResponse.json({ error: "This booking is already confirmed." }, { status: 409 });

  const now = new Date().toISOString();
  const { data: booking, error } = await staff.supabase.from("bookings").upsert({
    enquiry_id: id,
    accepted_quote_id: acceptedQuote.id,
    status: "confirmed",
    confirmed_at: now,
    confirmed_by: staff.user.id,
    event_date: enquiry.event_date
  }, { onConflict: "enquiry_id" }).select("id, status, event_date").single();
  if (error || !booking) return NextResponse.json({ error: "Could not confirm the booking." }, { status: 500 });

  await staff.supabase.from("enquiries").update({ status: "won", updated_at: now }).eq("id", id);
  await staff.supabase.from("activity_events").insert({
    enquiry_id: id, actor_user_id: staff.user.id, event_type: "booking_confirmed",
    safe_metadata: { quote_id: acceptedQuote.id }
  });
  return NextResponse.json({ booking });
}
