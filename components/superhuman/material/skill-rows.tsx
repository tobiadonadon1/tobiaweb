import { Download } from "lucide-react";
import type { MaterialFolder } from "./material-types";

/** Locked order. Do not invent extras. */
const ORDER = [
  "atelier",
  "page-copy",
  "motion-scale",
  "the-spec",
  "tester",
  "ship-check",
] as const;

/**
 * Skills as six compact rows. One line. Download SKILL.md.
 * No nested markdown on the page.
 */
export function SkillRows({ folder }: { folder: MaterialFolder }) {
  const rows = ORDER.map((slug) => folder.entries.find((e) => e.slug === slug)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  return (
    <ul className="list-none border-t border-[var(--hairline)]">
      {rows.map((entry, i) => (
        <li
          key={entry.slug}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-[var(--hairline)] py-4 md:py-5"
        >
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.4)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <span className="font-serif text-[1.15rem] leading-tight tracking-tight text-[var(--ink)] md:text-[1.25rem]">
              {entry.title}
            </span>
            <p className="mt-1 truncate text-[0.95rem] leading-snug text-[color:rgba(11,31,58,0.58)]">
              {entry.summary}
            </p>
          </div>
          <a
            href={`/construct/skills/${entry.slug}/SKILL.md`}
            download="SKILL.md"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)] transition-colors duration-[600ms] ease-out hover:text-[var(--accent-sky)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-sky)]"
          >
            <Download className="h-3.5 w-3.5 opacity-50 transition-opacity duration-[600ms] ease-out group-hover:opacity-100" />
            SKILL.md
          </a>
        </li>
      ))}
    </ul>
  );
}
