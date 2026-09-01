import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * POST /api/waitlist
 *
 * The one place an address can be left on this site. Two pages use it: the
 * Superhuman shelf ("tell me which one you want first") and the book's close.
 *
 * It never claims to have stored something it did not. There are exactly two
 * ways it can succeed, and the client is told which one happened:
 *
 *   "forwarded"  WAITLIST_WEBHOOK_URL is set and accepted the payload. This is
 *                the production path. Point it at Buttondown, Resend, a Google
 *                Form, a Zapier catch hook, anything that takes a JSON POST.
 *   "logged"     No webhook is configured, so the row went to the server log
 *                and, where the filesystem is writable, to WAITLIST_FILE
 *                (default .data/waitlist.ndjson). Fine locally. On a
 *                serverless host this is EPHEMERAL, which is why the response
 *                says `durable: false` and the form tells the visitor to email
 *                instead.
 *
 * TODO(tobia): set WAITLIST_WEBHOOK_URL in the deployment env and this becomes
 * a real list with no code change.
 */

export const dynamic = "force-dynamic";

/** Deliberately permissive. Real validation is the confirmation email's job. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SOURCES = new Set(["superhuman", "book"]);
/**
 * What the visitor said they want first. Free text is not accepted.
 *
 * The three shelf values are the same strings as `ShelfId` and the URL
 * segments under /projects/construct. They are repeated as literals rather
 * than imported because this is the trust boundary: the allowed set must be
 * readable in the file that enforces it, and a route handler should not widen
 * silently because a component's type changed. If a family is added, add it
 * here on purpose.
 */
const INTERESTS = new Set([
  "material",
  "masterclass",
  "design",
  "book",
  "",
]);

type Payload = { email: string; source: string; interest: string };

function parse(body: unknown): Payload | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 254) : "";
  const source = typeof b.source === "string" ? b.source : "";
  const interest = typeof b.interest === "string" ? b.interest : "";
  if (!EMAIL.test(email)) return null;
  if (!SOURCES.has(source)) return null;
  if (!INTERESTS.has(interest)) return null;
  return { email, source, interest };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const payload = parse(body);
  if (!payload) {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  const row = { ...payload, at: new Date().toISOString() };
  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(row),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        return Response.json({ ok: true, stored: "forwarded", durable: true });
      }
      console.error("[waitlist] webhook rejected", res.status);
    } catch (err) {
      console.error("[waitlist] webhook failed", err);
    }
    // Fall through to the log rather than losing the address entirely.
  }

  // No webhook, or the webhook is down. Keep it where it can still be found,
  // and be honest with the client about how fragile that is.
  console.info("[waitlist]", JSON.stringify(row));
  try {
    const file =
      process.env.WAITLIST_FILE ?? path.join(process.cwd(), ".data", "waitlist.ndjson");
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, JSON.stringify(row) + "\n", "utf8");
  } catch (err) {
    // A read-only filesystem is expected on most hosts. The log line above
    // already ran, so this is not a failure worth showing the visitor.
    console.warn("[waitlist] not persisted to disk", err);
  }

  return Response.json({ ok: true, stored: "logged", durable: false });
}
