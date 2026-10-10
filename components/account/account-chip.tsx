"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { ACCOUNT_HREF } from "./links";
import { useMember } from "./use-member";

/**
 * The way in, on every Construct page: "Sign in" in the top right corner,
 * the mirror of the Back chip in the top left, with the same size and border,
 * stepping aside when the footer opens. Signed in, it reads "Account".
 *
 * Desktop and tablet only: on a phone the nav runs to the right edge, so
 * there the way in sits under each email form instead (FreeClaim and the
 * download card say "sign in" right where the address is asked for).
 *
 * It isn't shown on the account page itself, and it waits for the answer
 * from /api/account/me rather than guessing, so it never flips its words.
 */
export function AccountChip() {
  const pathname = usePathname();
  const member = useMember();
  if (pathname?.startsWith(ACCOUNT_HREF) || member === undefined) return null;

  const href = member ? ACCOUNT_HREF : `${ACCOUNT_HREF}?next=${encodeURIComponent(pathname ?? "/projects/construct")}`;
  return (
    <Link
      href={href}
      className={[
        "back-link group fixed right-5 z-40 hidden sm:inline-flex min-h-11 items-center gap-2 rounded-full",
        "border px-4 py-3 text-[13px] leading-none backdrop-blur-md",
        "transition-[color,border-color,opacity,translate] duration-300 sm:right-7 sm:top-7",
        "top-[max(1.25rem,env(safe-area-inset-top))]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "border-[rgba(11,31,58,0.2)] bg-[rgba(250,248,242,0.75)] text-[color:rgba(11,31,58,0.8)] outline-[var(--accent-sky)] hover:border-[rgba(11,31,58,0.45)] hover:text-[var(--ink)]",
      ].join(" ")}
    >
      <UserRound aria-hidden className="h-4 w-4" />
      {member ? "Account" : "Sign in"}
    </Link>
  );
}
