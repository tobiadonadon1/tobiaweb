import type { Metadata } from "next";
import { BackLink } from "@/components/ui/back-link";
import { JoinPlans } from "@/components/membership/join-plans";

export const metadata: Metadata = {
  title: "Membership · Construct",
  description:
    "Free, Pro, Ultimate and Universal: every premium skill, my training, live Q&As and workshops, 1-on-1 calls and a direct line to me. Cancel any time.",
  alternates: { canonical: "/projects/construct/join" },
};

/**
 * THE PLANS PAGE. Static, on paper like the rest of Construct; the plans are
 * a client component (components/membership/join-plans.tsx) only so a
 * signed-in member sees their own plan marked.
 */
export default function JoinPage() {
  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[var(--ink)]">
      <BackLink href="/projects/construct" label="Construct" />
      <div className="mx-auto w-full max-w-[76rem] px-5 pb-28 pt-28 md:px-8 md:pt-36">
        <header className="mx-auto mb-14 max-w-[44rem] text-center">
          <p className="text-[0.92rem] uppercase tracking-[0.14em] text-[var(--accent-clay-text)]">Membership</p>
          <h1 className="mt-4 text-balance font-serif text-[clamp(2.8rem,9vw,5rem)] leading-[0.95] tracking-[-0.04em]">
            Closer to the <em>work</em>.
          </h1>
          <p className="mx-auto mt-6 max-w-[36rem] text-pretty text-[1.15rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">
            Free stays free. Pro opens every premium skill and a line to me. Ultimate opens everything: the training,
            the calls, the people, and a say in what I build next. Universal is all of it, and we build with you.
          </p>
        </header>
        <JoinPlans />
      </div>
    </main>
  );
}
