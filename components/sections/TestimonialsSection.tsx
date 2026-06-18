import { BentoGridShowcase } from "@/components/ui/bento-grid-showcase";

/**
 * "Why me" — the differentiators, between Projects and Thoughts. Built on the
 * 6-slot BentoGridShowcase (Tobia's pick), in the HOUSE palette (Ink & Paper,
 * never the demo's dark SaaS). REPLACES generic testimonials: Tobia's proof is
 * what sets him apart, not borrowed quotes.
 *
 * Slots: a tall ink statement (his real edge) + glass cards + two clay stat
 * cards (grounded in his real story) + a wide "right now" strip. Where we have
 * nothing real yet, the cards use grounded mock from his actual road — never a
 * fabricated claim.
 */

const GLASS_BG =
  "linear-gradient(145deg, rgba(253,252,249,0.9), rgba(247,245,239,0.7))";
const GLASS_SHADOW =
  "0 14px 36px rgba(28,24,14,0.09), inset 0 1px 0 rgba(255,255,255,0.7)";
const INK_GRID =
  "linear-gradient(to right, rgba(207,233,238,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(207,233,238,0.10) 1px, transparent 1px)";
const GRID_MASK =
  "radial-gradient(ellipse 80% 60% at 28% 0%, #000 58%, transparent 112%)";

function GlassCard({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <article
      className="flex h-full flex-col justify-between overflow-hidden rounded-[24px] border p-6"
      style={{ background: GLASS_BG, borderColor: "rgba(30,26,14,0.08)", boxShadow: GLASS_SHADOW }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-900/70">
        {kicker}
      </span>
      <div className="mt-6">
        <h3 className="font-serif text-2xl leading-tight tracking-tight text-[#0a0a0a]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-black/60">{body}</p>
      </div>
    </article>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article
      className="flex h-full flex-col justify-between overflow-hidden rounded-[24px] border p-6"
      style={{ background: GLASS_BG, borderColor: "rgba(30,26,14,0.08)", boxShadow: GLASS_SHADOW }}
    >
      <span className="font-serif text-5xl leading-none tracking-tight text-accent-clay md:text-6xl">
        {value}
      </span>
      <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-black/45">
        {label}
      </p>
    </article>
  );
}

export function TestimonialsSection() {
  return (
    <section id="proof" className="paper-bg relative">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        {/* Masthead */}
        <div className="mb-14 text-center">
          <div className="mx-auto flex max-w-md items-center gap-4">
            <span className="h-px flex-1 bg-black/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
              Why me
            </span>
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <h2 className="mt-6 font-serif text-4xl tracking-tight text-[#0a0a0a] md:text-5xl">
            What sets the work apart.
          </h2>
        </div>

        <BentoGridShowcase
          /* Tall left — the real edge: context + vision (ink statement). */
          integration={
            <article
              className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[color:var(--hairline-on-ink)] bg-ink p-8 md:p-10"
              style={{ boxShadow: "0 24px 60px rgba(8,18,34,0.35), inset 0 1px 0 rgba(207,233,238,0.06)" }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: INK_GRID, backgroundSize: "46px 52px", maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
              />
              <div className="relative flex h-full flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7dd3fc]/80">
                  Real context
                </span>
                <h3 className="mt-6 max-w-sm font-serif text-3xl leading-[1.05] tracking-tight text-[#faf8f2] md:text-4xl">
                  I know what&rsquo;s actually being built.
                </h3>
                <p className="mt-6 max-w-sm text-pretty text-base leading-relaxed text-[#cfe9ee]/75 md:text-lg">
                  I build alongside the people my age who are making things right
                  now, and I&rsquo;ve sat with some of the brightest minds in the
                  room. I don&rsquo;t guess where this is going. I have the
                  context, and the vision to use it.
                </p>
              </div>
            </article>
          }
          /* Top-middle — credibility. */
          trackers={
            <GlassCard
              kicker="Credibility"
              title="Inside a major company."
              body="A major company pays me to do exactly this, not just my own projects. That bar is the bar I bring to your work."
            />
          }
          /* Top-right — grounded stat. */
          statistic={
            <StatCard value="15" label="age I started my first agency, with real, paying clients." />
          }
          /* Middle-middle — range. */
          focus={
            <GlassCard
              kicker="Range"
              title="Built across many fronts."
              body="An agency, AI systems for businesses, a book in progress. The range is the point. I find the through-line fast."
            />
          }
          /* Middle-right — grounded stat. */
          productivity={
            <StatCard value="3 yrs" label="finished a US degree early, then straight into a major company." />
          }
          /* Wide bottom — what's live right now. */
          shortcuts={
            <article
              className="flex h-full flex-col justify-center overflow-hidden rounded-[24px] border p-6 md:p-8"
              style={{ background: GLASS_BG, borderColor: "rgba(30,26,14,0.08)", boxShadow: GLASS_SHADOW }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-900/70">
                Right now
              </span>
              <p className="mt-3 font-serif text-xl tracking-tight text-[#0a0a0a] md:text-2xl">
                What I&rsquo;m building.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Superhuman", "Sole", "MakeFunnels", "The Book"].map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-black/10 bg-white/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black/55"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </article>
          }
        />
      </div>
    </section>
  );
}
