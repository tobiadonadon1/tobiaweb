import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { THOUGHTS, getThought, TAG_HREF } from "@/lib/thoughts";

// All thought slugs are known at build time → fully static pages. Unknown
// slugs 404 at routing (dynamicParams off).
export function generateStaticParams() {
  return THOUGHTS.map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getThought(slug);
  if (!t) return {};
  return {
    title: t.headline,
    description: t.excerpt,
    openGraph: {
      title: t.headline,
      description: t.excerpt,
      type: "article",
      images: t.cover ? [{ url: t.cover }] : undefined,
    },
  };
}

/**
 * A single Thought, as a long-form reading page — Ink & Paper, the same shell
 * language as the project pages (paper, serif, quiet, `page-rise` entrance).
 *
 * Until a full essay is written, the page shows the excerpt as the piece's
 * standfirst and says plainly that the rest is still forming (drafts in
 * public). No body is ever fabricated — when `body` lands (Tobia, or later
 * Mind), it renders here automatically.
 */
export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getThought(slug);
  if (!t) notFound();

  const tagHref = t.tag ? TAG_HREF[t.tag] : undefined;

  return (
    <main className="paper-bg min-h-screen px-6 pb-28 pt-10 text-[#0a0a0a]">
      <article className="page-rise mx-auto w-full max-w-3xl">
        <Link
          href="/#thoughts"
          className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-black/40 transition-colors hover:text-black/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Thoughts
        </Link>

        {/* ---- Title block ---- */}
        <header className="pt-16">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.4em] text-black/40">
            {t.tag &&
              (tagHref ? (
                <Link
                  href={tagHref}
                  className="rounded-full border px-2.5 py-1 transition-colors hover:text-cyan-900"
                  style={{ borderColor: "rgba(30,26,14,0.12)" }}
                >
                  {t.tag}
                </Link>
              ) : (
                <span
                  className="rounded-full border px-2.5 py-1"
                  style={{ borderColor: "rgba(30,26,14,0.12)" }}
                >
                  {t.tag}
                </span>
              ))}
            {t.date && <span>{t.date}</span>}
            {t.date && t.readTime && (
              <span className="h-1 w-1 rounded-full bg-black/20" />
            )}
            {t.readTime && <span>{t.readTime}</span>}
          </div>

          <h1 className="mt-6 font-serif text-4xl leading-[1.06] tracking-tight md:text-6xl">
            {t.headline}
          </h1>
        </header>

        {/* ---- Cover (natural / ungraded — no sea-tone) ---- */}
        {t.cover && (
          <div
            className="mt-10 overflow-hidden rounded-2xl border"
            style={{ borderColor: "rgba(30,26,14,0.08)" }}
          >
            <div className="relative aspect-[3/2] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- local photo */}
              <img
                src={t.cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* ---- The standfirst: the excerpt, set large as the piece's lede ---- */}
        <p className="mt-12 font-serif text-2xl italic leading-snug text-black/60 md:text-3xl">
          {t.excerpt}
        </p>

        <div className="mt-10 border-t border-black/10 pt-10">
          {t.body && t.body.length > 0 ? (
            <div className="space-y-6 text-base leading-relaxed text-black/70 md:text-lg">
              {t.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            // Honest in-progress state — never a fabricated essay.
            <div className="max-w-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/35">
                Still forming
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/60 md:text-lg">
                This one is still a draft — I write these in public, so the full
                piece arrives a little after the thought does. The line above is
                the seed of it.
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/60 md:text-lg">
                If you want to read it when it&rsquo;s finished, the writing
                surfaces first on{" "}
                <a
                  href="https://www.linkedin.com/in/tobia-donadon"
                  target="_blank"
                  rel="me noreferrer"
                  className="underline decoration-black/25 underline-offset-4 transition-colors hover:text-cyan-900"
                >
                  LinkedIn
                </a>{" "}
                — or just{" "}
                <a
                  href="mailto:tobia@donadon.com?subject=Your%20writing"
                  className="underline decoration-black/25 underline-offset-4 transition-colors hover:text-cyan-900"
                >
                  write me
                </a>
                .
              </p>
            </div>
          )}
        </div>

        {/* ---- Close ---- */}
        <div className="mt-16 flex flex-col gap-6 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          {t.writer && (
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
              {t.writer}
            </span>
          )}
          <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
            <Link href="/#thoughts" className="hover:text-black/70">
              All thoughts
            </Link>
            <a
              href="mailto:tobia@donadon.com?subject=Hi%20Tobia"
              className="inline-flex items-center gap-1 hover:text-black/70"
            >
              Write me <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
