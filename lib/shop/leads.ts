/**
 * WHERE THE ADDRESSES GO.
 *
 * Every free download leaves an address, and this puts it somewhere Tobia can
 * open: a Google Sheet by default, Supabase if that is what is configured.
 *
 *   Google Sheet   LEADS_WEBHOOK_URL is the sheet's Apps Script web-app URL
 *                  and LEADS_TOKEN the shared secret its script checks. One
 *                  row per address: date, email, product, page.
 *   Supabase       SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and a table
 *                  `leads (email text, product text, page text, created_at
 *                  timestamptz default now())`.
 *
 * Whatever happens here, the product has already been emailed, and every
 * delivery also sits in the Gmail Sent folder, so an address is never lost
 * even if the sheet is down. This reports what it did; it never throws.
 */

export type Lead = { email: string; product: string; page: string };
export type LeadResult = "sheet" | "supabase" | "none" | "failed";

/**
 * Google's script can take well over ten seconds to answer when it has not
 * run for a while (a cold start): the first real signup timed out at 10 s
 * and never reached the sheet. So the wait is long, and the route calls this
 * AFTER answering the visitor (next/server `after`), so nobody waits on it.
 * Only a request that never reached Google is tried again (see toSheet).
 */
const SHEET_WAIT_MS = 45_000;

/**
 * HOW GOOGLE ANSWERS. The POST to the script runs doPost (the row is written)
 * and answers 302; the script's reply ("ok"/"no") is then served from a
 * second URL, which Google sometimes fails to serve (404) even though the row
 * went in. Retrying after that wrote the first real Jev signup twice. So:
 * only a request Google never accepted is retried; once it has answered 302
 * the row counts as written, confirmed by "ok" when the reply is readable.
 */
async function toSheet(url: string, body: string): Promise<"ok" | "unconfirmed" | "refused" | "unsent"> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(SHEET_WAIT_MS),
    });
  } catch (err) {
    console.error("[leads] could not reach the sheet", err);
    return "unsent";
  }
  const reply = async (r: Response) => (await r.text().catch(() => "")).trim();
  const location = res.headers.get("location");
  if (res.status >= 300 && res.status < 400 && location) {
    try {
      const echo = await fetch(location, { signal: AbortSignal.timeout(SHEET_WAIT_MS) });
      const text = await reply(echo);
      if (text === "ok") return "ok";
      if (text === "no") {
        console.error("[leads] the sheet refused the token");
        return "refused";
      }
      console.warn("[leads] row sent, Google's reply unreadable", echo.status);
    } catch {
      console.warn("[leads] row sent, Google's reply timed out");
    }
    return "unconfirmed";
  }
  const text = await reply(res);
  if (res.ok && text === "ok") return "ok";
  console.error("[leads] the sheet did not take the row", res.status, text.slice(0, 120));
  return res.status >= 500 ? "unsent" : "refused";
}

export async function recordLead(lead: Lead): Promise<LeadResult> {
  const at = new Date().toISOString();
  try {
    const sheet = process.env.LEADS_WEBHOOK_URL;
    if (sheet) {
      const body = JSON.stringify({ token: process.env.LEADS_TOKEN ?? "", ...lead, at });
      let r = await toSheet(sheet, body);
      // Only a request Google never took is sent again, so a row is never doubled.
      if (r === "unsent") r = await toSheet(sheet, body);
      if (r === "ok" || r === "unconfirmed") return "sheet";
      console.error("[leads] LOST ROW (still in Gmail Sent):", JSON.stringify({ ...lead, at }));
      return "failed";
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "content-type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return "supabase";
      console.error("[leads] Supabase refused the row", res.status, (await res.text()).slice(0, 200));
      return "failed";
    }

    console.info("[leads] no store configured", JSON.stringify({ ...lead, at }));
    return "none";
  } catch (err) {
    console.error("[leads] could not record", err);
    return "failed";
  }
}
