import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffContext } from "@/lib/auth";

const schema = z.object({
  status: z.enum(["new", "contacted", "needs_information", "qualified", "quote_in_progress", "quote_sent", "won", "lost", "not_proceeding"])
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const raw = await request.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid status." }, { status: 400 });

  const { data: existing } = await staff.supabase.from("enquiries").select("status").eq("id", id).maybeSingle();
  if (!existing) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });

  const { error } = await staff.supabase.from("enquiries")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update the enquiry." }, { status: 500 });

  await staff.supabase.from("activity_events").insert({
    enquiry_id: id, actor_user_id: staff.user.id, event_type: "status_changed",
    safe_metadata: { from: existing.status, to: parsed.data.status }
  });
  return NextResponse.json({ ok: true });
}
