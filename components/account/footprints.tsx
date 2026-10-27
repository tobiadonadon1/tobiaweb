"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ACCOUNT_HREF, JOIN_HREF } from "./links";

/**
 * WHERE A NEW MEMBER CAME FROM, quietly. Two first-party cookies, nothing
 * shown and nothing sent anywhere but this site:
 *
 *   cx_from   the last page they looked at before the plans or the account
 *             page (the skill or guide that made them join)
 *   cx_land   the first page of their visit, and the site that sent them
 *             there (x.com, google…), kept from the first visit for 30 days
 *
 * The Join route (/api/membership/join) copies both onto the Stripe
 * subscription's metadata (`from`, `landing`, `ref`), so Tobia can see what
 * a subscription came from.
 */

const DAYS_30 = 60 * 60 * 24 * 30;
const set = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value.slice(0, 300))}; Path=/; Max-Age=${DAYS_30}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
};
const has = (name: string) => document.cookie.split(/;\s*/).some((c) => c.startsWith(`${name}=`));

export function Footprints() {
  const path = usePathname();
  useEffect(() => {
    if (!path) return;
    try {
      if (!has("cx_land")) {
        let ref = "";
        try {
          const r = document.referrer ? new URL(document.referrer) : null;
          ref = r && r.host !== location.host ? r.host : "";
        } catch {}
        set("cx_land", `${path}|${ref}`);
      }
      if (!path.startsWith(JOIN_HREF) && !path.startsWith(ACCOUNT_HREF)) set("cx_from", path);
    } catch {}
  }, [path]);
  return null;
}
