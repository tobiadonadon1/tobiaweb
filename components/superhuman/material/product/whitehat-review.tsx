/**
 * THE REVIEW, WORKING. On the left, the one thing the whole business turns on:
 * a signed scope, and the consultant's log of a review kept inside it. On the
 * right, the report the client actually pays for: findings ranked by severity,
 * each with a fix, then every one cleared on retest. Argon helps validate, rank
 * and fix; it never tests anything on its own, so nothing here says it does.
 *
 * Everything here is an EXAMPLE, and the frame says so. The target is a
 * .example domain, which can never resolve to a real site. Nothing claims a
 * result the guide has not produced; it shows the shape of a legitimate,
 * authorized engagement. Pure CSS motion (globals.css, .lx-* / .rm-*),
 * stopped for reduced motion.
 */

const INK_PANEL = "#0b0f17";

type Sev = "critical" | "high" | "medium";
const SEV: Record<Sev, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#f0564a" },
  high: { label: "High", color: "#f0954a" },
  medium: { label: "Medium", color: "#e0bf4a" },
};
const CLEARED = "#36e0a2";

const LOG: string[] = [
  "scope signed · non-destructive only",
  "14 inputs · 3 roles mapped",
  "OWASP A01–A10 checked",
  "47 candidates → 6 confirmed",
];

const FINDINGS: { sev: Sev; title: string; cvss: string; fix: string }[] = [
  { sev: "critical", title: "Booking records reachable without login", cvss: "CVSS 9.1", fix: "Enforce access checks on every record" },
  { sev: "high", title: "Any logged-in user can open the admin panel", cvss: "CVSS 8.1", fix: "Check the role on every admin route" },
  { sev: "medium", title: "Session cookie missing HttpOnly & Secure", cvss: "CVSS 4.8", fix: "Set both flags; rotate on login" },
];

export function WhitehatReview() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[rgba(244,242,236,0.12)] bg-[#0b0f17] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
      <figcaption className="flex items-center justify-between border-b border-[rgba(244,242,236,0.08)] px-4 py-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.45)]">
        <span className="flex items-center gap-2">
          <span aria-hidden className="lx-pulse inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#2743b8" }} />
          Web Security Review
        </span>
        <span>Example report</span>
      </figcaption>

      <div className="grid grid-cols-1 sm:grid-cols-[0.92fr_1.08fr]">
        {/* The authorized scope, and the log of a review kept inside it. */}
        <div className="border-b border-[rgba(244,242,236,0.08)] p-4 sm:border-b-0 sm:border-r sm:p-5">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.4)]">
            Scope · signed
          </p>
          <div className="mt-3 rounded-xl border border-[rgba(244,242,236,0.1)] bg-[rgba(244,242,236,0.04)] p-3.5">
            <p className="font-mono text-[0.82rem] text-[#f4f2ec]">bella-clinic.example</p>
            <p className="mt-1 text-[0.78rem] leading-snug text-[rgba(244,242,236,0.6)]">
              Booking &amp; intake forms · client portal
            </p>
            <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em]" style={{ color: CLEARED }}>
              <span aria-hidden className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[0.6rem]" style={{ background: CLEARED, color: INK_PANEL }}>✓</span>
              Authorized by owner · in writing
            </p>
          </div>

          <p className="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.4)]">
            Review log
          </p>
          <ul className="mt-3 flex list-none flex-col gap-2">
            {LOG.map((line, i) => (
              <li key={line} className="flex items-start gap-2 font-mono text-[0.72rem] leading-snug text-[rgba(244,242,236,0.72)]">
                <span aria-hidden style={{ color: i === LOG.length - 1 ? CLEARED : "rgba(244,242,236,0.35)" }}>›</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* The report: findings, ranked, each with a fix. Then all cleared. */}
        <div className="p-4 sm:p-5">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(244,242,236,0.4)]">
            Findings · ranked
          </p>
          <ol className="mt-3 flex list-none flex-col gap-3">
            {FINDINGS.map((f) => {
              const s = SEV[f.sev];
              return (
                <li key={f.title} className="rounded-xl border border-[rgba(244,242,236,0.1)] bg-[rgba(244,242,236,0.03)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em]" style={{ color: s.color }}>
                      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="font-mono text-[0.56rem] uppercase tracking-[0.1em] text-[rgba(244,242,236,0.45)]">{f.cvss}</span>
                  </div>
                  <p className="mt-1.5 text-[0.9rem] leading-snug text-[#f4f2ec]">{f.title}</p>
                  <p className="mt-1.5 flex items-start gap-1.5 text-[0.76rem] leading-snug text-[rgba(244,242,236,0.6)]">
                    <span aria-hidden className="font-mono text-[0.58rem] uppercase tracking-[0.12em]" style={{ color: CLEARED }}>Fix</span>
                    {f.fix}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex items-center justify-between rounded-xl border px-3.5 py-2.5" style={{ borderColor: "rgba(54,224,162,0.3)", background: "rgba(54,224,162,0.06)" }}>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: CLEARED }}>Retest</span>
            <span className="flex items-center gap-1.5 text-[0.82rem] text-[#f4f2ec]">
              <span aria-hidden className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.62rem]" style={{ background: CLEARED, color: INK_PANEL }}>✓</span>
              6 of 6 cleared
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}
