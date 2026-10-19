import { planName, type Tier } from "@/lib/membership/tiers";

/**
 * THE PLAN, AS A SMALL PILL: in the corner chip, on the account page, in the
 * plan picker. Each plan owns one look, climbing from quiet to loud:
 *
 *   Free       an outline
 *   Pro        the clay
 *   Ultimate   ink, with a clay rim
 *   Universal  clay into amber
 */
const LOOK: Record<Tier, string> = {
  free: "border border-[rgba(11,31,58,0.28)] bg-[linear-gradient(160deg,#ffffff_0%,#ece3d1_100%)] text-[color:rgba(11,31,58,0.8)]",
  pro: "bg-[linear-gradient(155deg,#f0845c_0%,#d9502f_50%,#a82f1d_100%)] text-[var(--paper)]",
  ultimate: "bg-[linear-gradient(160deg,#2a4f85_0%,#0b1f3a_70%)] text-[var(--paper)] ring-1 ring-inset ring-[rgba(240,165,143,0.55)]",
  universal: "bg-[linear-gradient(110deg,#4a1d3d_0%,#b23a2c_50%,#ec8a35_100%)] text-[var(--paper)]",
};

export function PlanBadge({ tier, className = "" }: { tier: Tier; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-[0.2rem] text-[11px] font-medium leading-none tracking-[0.01em] ${LOOK[tier]} ${className}`}
    >
      {planName(tier)}
    </span>
  );
}
