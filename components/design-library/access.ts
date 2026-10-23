"use client";

import { useMember } from "@/components/account/use-member";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { hasPerk } from "@/lib/membership/tiers";
import type { Block } from "./catalog.generated";

/**
 * WHO IS LOOKING, as far as the Design library cares:
 *
 *   loading  still asking (/api/account/me)
 *   guest    no account
 *   free     an account whose plan doesn't open Design (the free blocks are theirs)
 *   member   Pro and up: every block, the code, the zip
 *
 * This only picks the words and the buttons. The source itself comes from
 * /api/design/source, which checks the plan on the server.
 */
export type Access = "loading" | "guest" | "free" | "member";

export function useAccess(): Access {
  const member = useMember();
  if (member === undefined) return "loading";
  if (member === null) return "guest";
  return hasPerk(member.tier, "design") ? "member" : "free";
}

export const canCopy = (access: Access, block: Pick<Block, "free">) =>
  access === "member" || (access === "free" && block.free);

export const LIBRARY_HREF = "/projects/construct/design";

/** Sign in or create an account, and come back to this block. */
export const accountHref = (mode: "signin" | "signup", slug?: string) =>
  `${ACCOUNT_HREF}?mode=${mode}&next=${encodeURIComponent(slug ? `${LIBRARY_HREF}?block=${slug}` : LIBRARY_HREF)}`;

/**
 * Download a file from the library's API without leaving the page on a
 * refusal: the file is fetched first and handed to the browser as a
 * download. A session that ended goes to sign in (and comes back here); a
 * plan that doesn't open it goes to the plans. False: it didn't download.
 */
export async function downloadFile(href: string, filename: string, slug?: string): Promise<boolean> {
  try {
    const res = await fetch(href, { cache: "no-store" });
    if (res.status === 401) {
      window.location.assign(accountHref("signin", slug));
      return true;
    }
    if (res.status === 403) {
      window.location.assign(`${JOIN_HREF}#pro`);
      return true;
    }
    if (!res.ok) return false;
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}
