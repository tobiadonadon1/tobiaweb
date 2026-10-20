"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMember } from "@/components/account/use-member";
import { ACCOUNT_HREF } from "@/components/account/links";
import { planName, type Tier } from "@/lib/membership/tiers";

/**
 * THE FOOT OF A MEMBERS-ONLY CELL. Everyone else reads which plans open it;
 * a member whose plan does gets the way in: their dashboard's Training.
 * The check here only picks the words: the training itself is checked on
 * the server (/api/membership/perks).
 */
export function MembersDoor({ members, className }: { members: Tier[]; className: string }) {
  const member = useMember();
  // Universal is above every plan, so it opens whatever they do.
  if (member && (members.includes(member.tier) || member.tier === "universal")) {
    return (
      <Link
        href={`${ACCOUNT_HREF}#training`}
        className={`${className} group inline-flex items-center gap-1.5 self-start rounded underline-offset-4 hover:text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]`}
      >
        Open in your dashboard
        <ArrowUpRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    );
  }
  return <p className={className}>Available only for {members.map(planName).join(" and ")} members</p>;
}
