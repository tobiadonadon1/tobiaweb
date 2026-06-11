import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface ProjectSection {
  /** Tiny mono kicker above the sub-head — e.g. "What it is". */
  kicker: string;
  heading: string;
  body: string;
}

interface ProjectPageShellProps {
  eyebrow: string;
  /** Quiet mono status echoed from the bento card — "in motion", "open", "becoming". */
  status: string;
  title: string;
  /** One italic serif line under the title. */
  lede: string;
  sections: ProjectSection[];
}

/**
 * Shared shell for the project pages — paper, serif, quiet. A structured
 * landing-page skeleton: eyebrow, big serif title, italic lede, a few
 * kicker/heading/body blocks, and a quiet closing row. Copy is draft.
 */
export function ProjectPageShell({
  eyebrow,
  status,
  title,
  lede,
  sections,
}: ProjectPageShellProps) {
  return (
    <main className="paper-bg min-h-screen px-6 py-10 text-[#0a0a0a]">
      <div className="page-rise mx-auto w-full max-w-3xl">
        <Link
          href="/#projects"
          className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-black/40 transition-colors hover:text-black/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <header className="pt-20 md:pt-28">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
              {eyebrow}
            </span>
            <span className="h-px w-8 bg-black/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-black/35">
              {status}
            </span>
          </div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.04] tracking-tight md:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-xl font-serif text-xl italic leading-snug text-black/45 md:text-2xl">
            {lede}
          </p>
        </header>

        <div className="mt-16 h-px w-full bg-black/10 md:mt-20" />

        <div className="flex flex-col gap-16 py-16 md:gap-20 md:py-20">
          {sections.map((section) => (
            <section key={section.kicker}>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/35">
                {section.kicker}
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                {section.heading}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-black/55 md:text-lg">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="h-px w-full bg-black/10" />

        <footer className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6 py-12 md:py-14">
          <Link
            href="/#projects"
            className="font-mono text-xs uppercase tracking-[0.3em] text-black/40 transition-colors hover:text-black/70"
          >
            All projects
          </Link>
          <a
            href="mailto:tobia@donadon.com"
            className="font-serif text-xl italic text-black/55 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black/80 hover:decoration-black/40"
          >
            Write me
          </a>
        </footer>
      </div>
    </main>
  );
}
