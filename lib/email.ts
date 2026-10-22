import "server-only";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return replacements[character] || character;
  });
}

export async function sendTransactionalEmail(input: { to: string; subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { sent: false, reason: "email_not_configured" as const };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [input.to], subject: input.subject, text: input.text,
        html: "<p>" + escapeHtml(input.text).replace(/\n/g, "<br>") + "</p>"
      }),
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) return { sent: false, reason: "provider_error" as const };
    return { sent: true, reason: "sent" as const };
  } catch {
    return { sent: false, reason: "provider_error" as const };
  }
}
