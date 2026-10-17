import { verifyWebhook } from "@/lib/beehiiv";
import { markUnsubscribed } from "@/lib/newsletter";

/**
 * POST /api/newsletter/beehiiv   beehiiv's webhook (Settings → Webhooks in
 * beehiiv, event subscription.deleted, this URL).
 *
 * When someone unsubscribes from "Notes from Tobi", beehiiv tells the site
 * here and the address is recorded as unsubscribed (lib/newsletter.ts), so
 * no box on the site ever adds it again and the account's flag is cleared.
 *
 * Only beehiiv can call it: the raw body must carry a valid Svix signature
 * made with BEEHIIV_WEBHOOK_SECRET (lib/beehiiv.ts), within five minutes.
 * Anything else is refused with 401. Without the secret set, every call is
 * refused with 503, which beehiiv retries for days, so nothing is lost while
 * it is being configured. A failure to record answers 500 for the same
 * reason. Repeats are harmless: unsubscribing twice is the same row.
 */

export const dynamic = "force-dynamic";

type Event = { event_type?: string; data?: { email?: string; id?: string; status?: string } };

const UNSUBSCRIBED = new Set(["subscription.deleted"]);

export async function POST(request: Request) {
  if (!process.env.BEEHIIV_WEBHOOK_SECRET) {
    console.error("[beehiiv webhook] BEEHIIV_WEBHOOK_SECRET is not set; refusing (beehiiv will retry)");
    return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
  }
  const raw = await request.text();
  const valid = verifyWebhook(raw, {
    id: request.headers.get("svix-id") ?? request.headers.get("webhook-id"),
    timestamp: request.headers.get("svix-timestamp") ?? request.headers.get("webhook-timestamp"),
    signature: request.headers.get("svix-signature") ?? request.headers.get("webhook-signature"),
  });
  if (!valid) return Response.json({ ok: false, error: "bad-signature" }, { status: 401 });

  let event: Event;
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "bad-json" }, { status: 400 });
  }
  const type = event.event_type ?? "";
  if (!UNSUBSCRIBED.has(type)) return Response.json({ ok: true, ignored: type || "unknown" });

  const email = typeof event.data?.email === "string" ? event.data.email.trim().toLowerCase() : "";
  if (!email.includes("@")) return Response.json({ ok: true, ignored: "no-email" });

  const done = await markUnsubscribed(email, typeof event.data?.id === "string" ? event.data.id : null);
  if (!done) return Response.json({ ok: false, error: "not-recorded" }, { status: 500 });
  console.info("[beehiiv webhook] unsubscribe recorded");
  return Response.json({ ok: true });
}
