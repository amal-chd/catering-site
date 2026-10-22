import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getStaffContext() {
  let supabase;
  try { supabase = await createSupabaseServerClient(); }
  catch { return null; }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;
  const { data: profile } = await supabase
    .from("admin_profiles").select("role, active").eq("user_id", userData.user.id).maybeSingle();
  if (!profile?.active) return null;
  return { supabase, user: userData.user, role: profile.role as "owner" | "staff" };
}

export async function requireStaffPage() {
  const context = await getStaffContext();
  if (!context) redirect("/admin/login");
  return context;
}
