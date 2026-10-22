import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendTransactionalEmail } from "@/lib/email";
import { services, siteUrl } from "@/lib/content";

export const runtime = "nodejs";

const optionalCount = z.preprocess(
  (value) => value === "" || value === null || value === undefined ? undefined : value,
  z.coerce.number().int().min(1).max(100000).optional()
);

const enquirySchema = z.object({
  serviceType: z.string().min(1).max(80),
  eventDate: z.string().max(10).optional().default(""),
  guestCountMin: optionalCount,
  venueLocality: z.string().trim().max(160).optional().default(""),
  eventNotes: z.string().trim().max(3000).optional().default(""),
  customerName: z.string().trim().min(1).max(120),
  organizationName: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().default(""),
  preferredContact: z.enum(["", "email", "phone"]).optional().default(""),
  privacyConsent: z.enum(["true", "false"]),
  turnstileToken: z.string().max(2048).optional().default(""),
  idempotencyKey: z.string().uuid(),
  website: z.string().optional().default("")
}).refine((value) => Boolean(value.email || value.phone), {
  message: "Add an email address or phone number so the team can reply."
}).refine((value) => value.preferredContact !== "email" || Boolean(value.email), {
  message: "Add an email address or choose another contact preference."
}).refine((value) => value.preferredContact !== "phone" || Boolean(value.phone), {
  message: "Add a phone number or choose another contact preference."
}).refine((value) => value.privacyConsent === "true", {
  message: "Please agree to be contacted about this enquiry."
}).refine((value) => !value.eventDate || /^\d{4}-\d{2}-\d{2}$/.test(value.eventDate), {
  message: "Enter a valid event date."
}).refine((value) => {
  if (!value.eventDate) return true;
  const parsed = new Date(value.eventDate + "T00:00:00.000Z");
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value.eventDate;
}, {
  message: "Enter a valid event date."
});

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

class PayloadTooLargeError extends Error {}

async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  if (!request.body) throw new Error("Request body is empty.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new PayloadTooLargeError();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function verifyTurnstile(token: string, remoteIp: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: remoteIp });
  try {
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body, cache: "no-store"
    });
    const data = await result.json() as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > 20000) return responseError("The submitted form is too large.", 413);
    raw = await readJsonBody(request, 20000);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) return responseError("The submitted form is too large.", 413);
    return responseError("Please submit the form again.", 400);
  }
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || "Check the form fields and try again.";
    return responseError(firstIssue, 400);
  }

  const input = parsed.data;
  if (process.env.NODE_ENV === "production" && !process.env.PRIVACY_NOTICE_VERSION) {
    return responseError("Enquiry service is not ready yet. Please try again later.", 503);
  }
  if (input.website.trim()) return NextResponse.json({ reference: "received" });
  if (!services.some((service) => service.slug === input.serviceType) && input.serviceType !== "other") {
    return responseError("Choose a valid service type.", 400);
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");
  if (!await verifyTurnstile(input.turnstileToken, ip)) return responseError("Please complete the security check and try again.", 400);

  let db;
  try { db = createSupabaseServiceClient(); }
  catch { return responseError("Enquiry service is not configured yet. Please try again later.", 503); }

  const { data: allowed, error: rateError } = await db.rpc("consume_public_submission", {
    p_ip_hash: ipHash,
    p_limit: 5
  });
  if (rateError) return responseError("Enquiry service is not ready yet. Please try again later.", 503);
  if (!allowed) return responseError("Too many requests. Please wait a little and try again.", 429);

  const serviceResult = await db.from("service_types").select("id").eq("key", input.serviceType).eq("active", true).maybeSingle();
  if (!serviceResult.data) return responseError("This service option is not available. Please choose another.", 400);

  const reference = "KAK-" + new Date().getFullYear() + "-" + createHash("sha256")
    .update(input.idempotencyKey + Date.now().toString()).digest("hex").slice(0, 6).toUpperCase();
  const insertResult = await db.from("enquiries").insert({
    public_reference: reference,
    idempotency_key: input.idempotencyKey,
    status: "new",
    service_type_id: serviceResult.data.id,
    event_date: input.eventDate || null,
    guest_count_min: input.guestCountMin ?? null,
    venue_locality: input.venueLocality || null,
    event_notes: input.eventNotes || null,
    customer_name: input.customerName,
    organization_name: input.organizationName || null,
    email: input.email || null,
    phone: input.phone || null,
    preferred_contact: input.preferredContact || null,
    privacy_notice_version: process.env.PRIVACY_NOTICE_VERSION || "development-draft",
    privacy_acknowledged_at: new Date().toISOString()
  }).select("id, public_reference").single();

  if (insertResult.error) {
    if (insertResult.error.code === "23505") {
      const existing = await db.from("enquiries").select("public_reference").eq("idempotency_key", input.idempotencyKey).maybeSingle();
      if (existing.data) return NextResponse.json({ reference: existing.data.public_reference });
    }
    return responseError("We could not save your enquiry. Please try again.", 500);
  }

  const chosen = services.find((service) => service.slug === input.serviceType)?.title || "Other enquiry";
  await db.from("activity_events").insert({
    enquiry_id: insertResult.data.id,
    event_type: "enquiry_received",
    safe_metadata: { service_type: input.serviceType }
  });
  const messages: Promise<unknown>[] = [];
  if (input.email) {
    messages.push(sendTransactionalEmail({
      to: input.email,
      subject: "We received your catering enquiry",
      text: "Thank you for contacting the catering team. Your reference is " + insertResult.data.public_reference + ". The team will review the details and follow up. This message is not a booking confirmation."
    }));
  }
  if (process.env.STAFF_ALERT_EMAIL) {
    messages.push(sendTransactionalEmail({
      to: process.env.STAFF_ALERT_EMAIL,
      subject: "New catering enquiry " + insertResult.data.public_reference,
      text: "New enquiry " + insertResult.data.public_reference + " · " + chosen + (input.eventDate ? " · Event date: " + input.eventDate : "") + "\nReview it in the staff dashboard: " + siteUrl + "/admin"
    }));
  }
  await Promise.allSettled(messages);

  return NextResponse.json({ reference: insertResult.data.public_reference }, { status: 201 });
}
