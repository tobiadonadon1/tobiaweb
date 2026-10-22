"use client";

import { useEffect, useState } from "react";
import type { PaidTier, Tier } from "@/lib/membership/tiers";

/**
 * Who is signed in, for the parts of the page that change with it (the
 * claim button, the download card, the corner chip, the buy button's price).
 * One request per page load, shared by every caller; `undefined` while it is
 * still asking, so a form never flashes in and out.
 */
export type MemberInfo = {
  email: string;
  /** Their plan: "free" without a membership (lib/membership/tiers.ts). */
  tier: Tier;
  /** The plan was given by Tobia (no Stripe subscription behind it). */
  granted?: boolean;
  subscription: { tier: PaidTier; status: string; renews: string | null; cancelAtPeriodEnd: boolean } | null;
  /** Said yes to the newsletter box (lib/newsletter.ts), so it isn't shown to them. */
  newsletter?: boolean;
} | null;

let pending: Promise<MemberInfo> | null = null;

function ask(): Promise<MemberInfo> {
  pending ??= fetch("/api/account/me", { cache: "no-store", credentials: "same-origin" })
    .then((r) => r.json())
    .then((b: { member?: MemberInfo }) => b.member ?? null)
    .catch(() => null);
  return pending;
}

export function useMember(): MemberInfo | undefined {
  const [member, setMember] = useState<MemberInfo | undefined>(undefined);
  useEffect(() => {
    let live = true;
    ask().then((m) => live && setMember(m));
    return () => {
      live = false;
    };
  }, []);
  return member;
}

/** Start a download without leaving the page. */
export function startDownload(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
