import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * BEEHIIV: THE NEWSLETTER'S SENDING SIDE ("Notes from Tobi").
 *
 * The site keeps who said yes (lib/newsletter.ts); beehiiv sends the issues.
 * Two things cross between them:
 *
 *   addSubscriber   a tick on the site → a subscriber in the publication.
 *                   Never reactivates an address that unsubscribed there
 *                   (reactivate_existing: false: beehiiv answers "inactive"
 *                   and the site records them as unsubscribed), and has beehiiv
 *                   send its welcome email. utm_campaign says which box.
 *   verifyWebhook   beehiiv → the site, when someone unsubscribes
 *                   (app/api/newsletter/beehiiv). beehiiv signs its webhooks
 *                   the Svix way: HMAC-SHA256 of "<svix-id>.<svix-timestamp>.<raw body>"
 *                   with the endpoint's secret ("whsec_<base64>", shown in
 *                   beehiiv under Settings → Webhooks), sent as "v1,<base64>"
 *                   in svix-signature. Old or future timestamps are refused,
 *                   so a captured request can't be replayed.
 *
 * Server only. The key and the publication id live in the environment
 * (BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID, BEEHIIV_WEBHOOK_SECRET), never
 * in the browser. Nothing here throws: a beehiiv that is down or slow is an
 * answer like any other, and the caller keeps the tick to send again later.
 */

export type Campaign = "account_signup" | "free_skill" | "login_prompt";

export type AddResult =
  | { ok: true; id: string; status: string }
  | { ok: false; error: string; retry: boolean };

const API = "https://api.beehiiv.com/v2";
const TIMEOUT_MS = 6000;

export function beehiivConfigured(): boolean {
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID);
}

/** Add one address to the publication. `fetcher` is for the tests. */
export async function addSubscriber(email: string, campaign: Campaign, fetcher: typeof fetch = fetch): Promise<AddResult> {
  const key = process.env.BEEHIIV_API_KEY;
  const pub = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) return { ok: false, error: "not-configured", retry: true };
  try {
    const res = await fetcher(`${API}/publications/${encodeURIComponent(pub)}/subscriptions`, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "tobia_website",
        utm_medium: "website",
        utm_campaign: campaign,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = (await res.json().catch(() => null)) as { data?: { id?: string; status?: string }; errors?: { message?: string }[] } | null;
    if (res.ok && body?.data?.id) return { ok: true, id: body.data.id, status: body.data.status ?? "unknown" };
    const message = body?.errors?.map((e) => e.message).filter(Boolean).join("; ") || res.statusText || "no body";
    // A 4xx other than rate limiting won't change by asking again (a bad key
    // will, once fixed, so 401/403 are retried too).
    const retry = res.status === 429 || res.status >= 500 || res.status === 401 || res.status === 403;
    return { ok: false, error: `${res.status} ${message}`.slice(0, 300), retry };
  } catch (err) {
    return { ok: false, error: `network: ${(err as Error)?.name ?? "error"} ${(err as Error)?.message ?? ""}`.slice(0, 300), retry: true };
  }
}

/** beehiiv's statuses that mean "not receiving": the site records them as unsubscribed. */
export function isGone(status: string): boolean {
  return status === "inactive" || status === "invalid";
}

const TOLERANCE_S = 5 * 60;

/**
 * Check a webhook's Svix signature against the raw body. Returns false on
 * anything missing, malformed, stale or wrong; never throws.
 */
export function verifyWebhook(
  raw: string,
  headers: { id: string | null; timestamp: string | null; signature: string | null },
  secret = process.env.BEEHIIV_WEBHOOK_SECRET ?? "",
  now = Math.floor(Date.now() / 1000),
): boolean {
  const { id, timestamp, signature } = headers;
  if (!secret || !id || !timestamp || !signature) return false;
  const ts = Number(timestamp);
  if (!Number.isInteger(ts) || Math.abs(now - ts) > TOLERANCE_S) return false;
  let key: Buffer;
  try {
    key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  } catch {
    return false;
  }
  if (!key.length) return false;
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${raw}`).digest();
  // The header can carry several signatures ("v1,abc v1,def") while a secret rotates.
  for (const part of signature.split(" ")) {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) continue;
    const given = Buffer.from(value, "base64");
    if (given.length === expected.length && timingSafeEqual(given, expected)) return true;
  }
  return false;
}
