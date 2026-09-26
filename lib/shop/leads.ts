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
 * A refusal or a network error is tried once more; a timeout is not, because
 * the script may still have written the row, and a double row beats none.
 */
const SHEET_WAIT_MS = 45_000;

async function toSheet(url: string, body: string): Promise<"ok" | "timeout" | "failed"> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      redirect: "follow",
      signal: AbortSignal.timeout(SHEET_WAIT_MS),
    });
    const text = (await res.text()).trim();
    if (res.ok && text === "ok") return "ok";
    console.error("[leads] the sheet refused the row", res.status, text.slice(0, 120));
    return "failed";
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[leads] the sheet did not answer in time");
      return "timeout";
    }
    console.error("[leads] could not reach the sheet", err);
    return "failed";
  }
}

export async function recordLead(lead: Lead): Promise<LeadResult> {
  const at = new Date().toISOString();
  try {
    const sheet = process.env.LEADS_WEBHOOK_URL;
    if (sheet) {
      const body = JSON.stringify({ token: process.env.LEADS_TOKEN ?? "", ...lead, at });
      let r = await toSheet(sheet, body);
      if (r === "failed") r = await toSheet(sheet, body);
      if (r === "ok") return "sheet";
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
