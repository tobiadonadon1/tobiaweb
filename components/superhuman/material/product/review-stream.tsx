/**
 * THE MINER, WORKING. Reviews stream up on the left with the words that
 * matter highlighted and tagged; the brief they add up to sits on the right.
 *
 * Every review and every count here is an EXAMPLE, and the frame says so in
 * its own chrome. Nothing on this page claims a result the guide has not
 * produced. Pure CSS motion (globals.css, .rm-*), stopped for reduced motion.
 */

const HL = "#ffd84d";

type Tag = "bought" | "left" | "wished";

const TAGS: Record<Tag, { label: string; color: string }> = {
  bought: { label: "Why they bought", color: "#36e0a2" },
  left: { label: "Why they left", color: "#f07a5f" },
  wished: { label: "What they wish existed", color: "#7aa7ff" },
};

const REVIEWS: { source: string; stars: number; before: string; quote: string; after: string; tag: Tag }[] = [
  { source: "App Store", stars: 5, before: "Honestly I ", quote: "was up and running before my coffee got cold", after: ". Nothing else came close.", tag: "bought" },
  { source: "G2", stars: 2, before: "They ", quote: "doubled the price and gave us nothing new", after: ", so we moved the team.", tag: "left" },
  { source: "Amazon", stars: 4, before: "Works well. I just ", quote: "wish it synced with my calendar", after: ", that's all.", tag: "wished" },
  { source: "App Store", stars: 1, before: "Support ", quote: "took nine days to answer a billing question", after: ". Cancelled.", tag: "left" },
  { source: "G2", stars: 5, before: "We picked it because ", quote: "the whole team got it without training", after: ".", tag: "bought" },
  { source: "Amazon", stars: 3, before: "Fine, but ", quote: "please add a dark mode", after: ". My eyes at night.", tag: "wished" },
];

const THEMES: { tag: Tag; label: string; share: number; mentions: string; quote: string }[] = [
  { tag: "bought", label: "Fast to set up", share: 0.92, mentions: "412 mentions · 18%", quote: "up and running before my coffee got cold" },
  { tag: "left", label: "Price went up, value didn't", share: 0.64, mentions: "287 mentions · 12%", quote: "doubled the price and gave us nothing new" },
  { tag: "wished", label: "Calendar sync", share: 0.41, mentions: "184 mentions · 8%", quote: "wish it synced with my calendar" },
];

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} of 5 stars`} className="tracking-[0.1em]">
      <span className="text-[#ffd84d]">{"★".repeat(n)}</span>
      <span className="text-[rgba(244,242,236,0.2)]">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  const tag = TAGS[r.tag];
  return (
    <li className="rounded-xl border border-[rgba(244,242,236,0.1)] bg-[rgba(244,242,236,0.04)] p-3.5">
      <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[rgba(244,242,236,0.5)]">
        <span>{r.source}</span>
        <Stars n={r.stars} />
      </div>
      <p className="mt-2 text-[0.86rem] leading-[1.45] text-[rgba(244,242,236,0.72)]">
        {r.before}
        <mark className="rm-mark rounded-[3px] px-0.5 text-[#0b0b0d]" style={{ background: HL }}>
          {r.quote}
        </mark>
        {r.after}
      </p>
      <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: tag.color }}>
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: tag.color }} />
        {tag.label}
      </p>
    </li>
  );
}

export function ReviewStream() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[rgba(244,242,236,0.12)] bg-[#0b0b0f] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
      <figcaption className="flex items-center justify-between border-b border-[rgba(244,242,236,0.08)] px-4 py-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.45)]">
        <span className="flex items-center gap-2">
          <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full" style={{ background: HL }} />
          Jev Review Miner
        </span>
        <span>Example run</span>
      </figcaption>

      <div className="grid grid-cols-1 sm:grid-cols-[0.95fr_1.05fr]">
        {/* The reviews, streaming. The list is drawn twice so the loop has no seam. */}
        <div className="relative h-[15rem] overflow-hidden border-b border-[rgba(244,242,236,0.08)] sm:h-[25rem] sm:border-b-0 sm:border-r">
          <p className="absolute left-4 top-3 z-10 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.4)]">
            Reviews in
          </p>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-14 bg-gradient-to-b from-[#0b0b0f] to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-14 bg-gradient-to-t from-[#0b0b0f] to-transparent" />
          <div className="px-4 pt-9">
            <div className="rm-stream">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className="flex list-none flex-col gap-3 pb-3">
                  {REVIEWS.map((r) => (
                    <ReviewCard key={r.quote} r={r} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        {/* The brief they add up to. */}
        <div className="p-4 sm:p-5">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.4)]">Brief out</p>
          <ol className="mt-4 flex list-none flex-col gap-5">
            {THEMES.map((t, i) => {
              const tag = TAGS[t.tag];
              return (
                <li key={t.label}>
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em]" style={{ color: tag.color }}>
                    {tag.label}
                  </p>
                  <p className="mt-1 text-[1rem] leading-tight text-[#f4f2ec]">{t.label}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[rgba(244,242,236,0.08)]">
                    <div
                      className="rm-bar h-full rounded-full"
                      style={{ width: `${t.share * 100}%`, background: tag.color, animationDelay: `${0.4 + i * 0.25}s` }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[rgba(244,242,236,0.45)]">
                    {t.mentions}
                  </p>
                  <p className="mt-1 text-[0.82rem] italic leading-snug text-[rgba(244,242,236,0.65)]">&ldquo;{t.quote}&rdquo;</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </figure>
  );
}
