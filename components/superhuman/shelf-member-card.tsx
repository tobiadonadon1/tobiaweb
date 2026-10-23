"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useMember } from "@/components/account/use-member";
import { ACCOUNT_HREF } from "@/components/account/links";
import { HandNote } from "@/components/ui/hand-note";
import { hasPerk } from "@/lib/membership/tiers";
import { ShelfLockedCard } from "./shelf-locked-card";

/**
 * A MEMBERS' FAMILY ON THE SHELF (Masterclass, Design).
 *
 * Everyone else gets the locked card that shakes its head. A member whose
 * plan opens it gets a plain door into that section of their dashboard, and
 * the lock comes off the title. Design is the exception: its card always
 * opens the library page, where anyone can play and members copy (the server passes both bodies, so the words
 * stay in one place: superhuman-shelf.tsx). Until the member is known the
 * card stays locked, which is what most visitors will see anyway.
 *
 * The plan check here only picks the card: what is behind the door is
 * checked on the server (/api/membership/perks).
 */
export function ShelfMemberCard({
  id,
  perk,
  mark,
  locked,
  open,
}: {
  id: string;
  perk: "masterclass" | "design";
  mark: ReactNode;
  locked: ReactNode;
  open: ReactNode;
}) {
  const member = useMember();
  const unlocked = Boolean(member && hasPerk(member.tier, perk));
  // Design is a library anyone can walk into and play with (the code is
  // what the plan opens, on the page itself), so its card is always a door.
  if (perk === "design") {
    return (
      <Link
        href="/projects/construct/design"
        className="group flex h-full flex-col rounded-sm p-2 text-[var(--paper)] transition-colors duration-[600ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
      >
        {mark}
        {unlocked ? open : locked}
      </Link>
    );
  }
  if (unlocked) {
    return (
      <Link
        href={`${ACCOUNT_HREF}#${id}`}
        className="group flex h-full flex-col rounded-sm p-2 text-[var(--paper)] transition-colors duration-[600ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
      >
        {mark}
        {open}
      </Link>
    );
  }
  return <ShelfLockedCard mark={mark} body={locked} flash="For Pro & Ultimate" />;
}

/**
 * The hand over the two members' columns: one line, a smaller one under it,
 * and two arrows forking down to Masterclass and Design. "Free to open" is
 * its sibling over Material. A member who has both sees it say so instead.
 * `phone` is the one-arrow version that sits above Masterclass when the
 * columns stack.
 */
export function MembersShelfNote({ phone = false }: { phone?: boolean }) {
  const member = useMember();
  const open = Boolean(member && hasPerk(member.tier, "masterclass"));
  const label = open ? "open with your plan" : "only for Pro & Ultimate";
  const sub = open ? null : "check your account status to unlock these";
  const color = "var(--m-gold, #e8a41f)";

  if (phone) {
    return (
      <div className="md:hidden">
        <HandNote gesture="down" label={label} color={color} size={72} className="flex flex-col items-start gap-0.5" labelClassName="-rotate-2" />
        {sub ? <Sub className="-mt-1 mb-2 pl-1" text={sub} /> : null}
      </div>
    );
  }
  return (
    <div aria-hidden className="relative hidden flex-col items-center md:flex">
      <span className="-rotate-1 text-center font-hand text-[1.6rem] leading-[1.1]" style={{ color }}>
        {label}
      </span>
      {sub ? <Sub className="mt-1 text-center" text={sub} /> : null}
      {/* Two arrows from under the words, one to each column's drawing. */}
      <div className="flex w-full justify-between px-[16%]">
        <HandNote gesture="fork" label="" color={color} size={92} className="flex flex-col" />
        <HandNote gesture="fork" flip label="" color={color} size={92} className="flex flex-col" />
      </div>
    </div>
  );
}

function Sub({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span aria-hidden className={`block font-hand text-[1.05rem] leading-[1.2] text-[color:rgba(232,164,31,0.78)] ${className}`}>
      {text}
    </span>
  );
}
