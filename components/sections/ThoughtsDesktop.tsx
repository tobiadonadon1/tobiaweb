"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X as XIcon } from "lucide-react";
import { THOUGHTS, getThought, TAG_HREF } from "@/lib/thoughts";

/**
 * Thoughts — "my desktop, in public." Full-bleed macOS desktop: Tobia's photo
 * is the wallpaper, each thought is a DRAGGABLE document file you can move
 * anywhere, the dock holds his socials (new tab), and a click opens a real
 * window with the piece inside. The reading page (/thoughts/[slug]) stays as
 * the deep-link / SEO surface (the window's ↗ opens it full).
 *
 * The top edge blends from the Projects navy (#0b1f3a) into the wallpaper, so
 * the ink chapter above flows into the desktop with no white seam.
 *
 * PLACEHOLDERS to swap once Tobia sends them:
 *  - WALLPAPER: a stand-in (a trail photo) until his portrait.
 *  - SOCIALS: Instagram + X links are placeholders; LinkedIn + email are real.
 */
const WALLPAPER = "/trail/trail-02.jpg"; // ← replace with Tobia's portrait

// Deterministic starting scatter (no Math.random — SSR/hydration parity). %s of
// the desktop; users can drag from here. Dodges the centre + the dock.
const SPOTS = [
  { x: 14, y: 24 },
  { x: 37, y: 17 },
  { x: 66, y: 15 },
  { x: 85, y: 30 },
  { x: 12, y: 54 },
  { x: 88, y: 56 },
  { x: 30, y: 46 },
  { x: 72, y: 47 },
  { x: 20, y: 74 },
];

// Scoped styling for the authored HTML body (no prose plugin).
const BODY_HTML_CLASS =
  "text-[15px] leading-relaxed text-black/70 [&>*+*]:mt-4 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-[#0a0a0a] [&_h3]:mt-7 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:tracking-tight [&_h3]:text-[#0a0a0a] [&_strong]:font-semibold [&_strong]:text-[#0a0a0a] [&_em]:italic [&_a]:underline [&_a]:decoration-black/30 [&_a]:underline-offset-4";

type Social = {
  label: string;
  href: string;
  tile: string;
  glyph: React.ReactNode;
  placeholder?: boolean;
};

const SOCIALS: Social[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    tile: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
    placeholder: true,
    glyph: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/",
    tile: "bg-black",
    placeholder: true,
    glyph: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="white">
        <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.4L18.9 2Zm-2.4 18h1.9L7.6 3.9H5.6L16.5 20Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tobia-donadon",
    tile: "bg-[#0a66c2]",
    glyph: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
        <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21H17.6v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9.86L9 9Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:tobia@donadon.com?subject=Hi%20Tobia",
    tile: "bg-[#f4f1ea]",
    glyph: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#0b1f3a" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
];

type Pos = { x: number; y: number };

export function ThoughtsDesktop() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = openSlug ? getThought(openSlug) : undefined;

  const deskRef = useRef<HTMLDivElement>(null);
  // File positions (% of the desktop), draggable. Seeded from SPOTS.
  const [positions, setPositions] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(THOUGHTS.map((t, i) => [t.slug, SPOTS[i % SPOTS.length]]))
  );
  const [dragSlug, setDragSlug] = useState<string | null>(null);

  // Esc closes the window.
  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenSlug(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSlug]);

  // Pointer-drag a file. Below a small move threshold it counts as a CLICK and
  // opens the thought; past it, it's a drag and the file just relocates.
  const startDrag = (e: React.PointerEvent, slug: string) => {
    if (e.button !== 0) return;
    const desk = deskRef.current;
    if (!desk) return;
    e.preventDefault();
    const rect = desk.getBoundingClientRect();
    const start = positions[slug];
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    setDragSlug(slug);

    const onMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - sx) / rect.width) * 100;
      const dyPct = ((ev.clientY - sy) / rect.height) * 100;
      if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 4) moved = true;
      setPositions((p) => ({
        ...p,
        [slug]: {
          x: Math.min(94, Math.max(3, start.x + dxPct)),
          y: Math.min(84, Math.max(4, start.y + dyPct)), // keep clear of the dock
        },
      }));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setDragSlug(null);
      if (!moved) setOpenSlug(slug);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <section id="thoughts" data-cursor-quiet className="relative bg-black">
      <style>{`
        @keyframes mac-window-in {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Tall region → the desktop PINS (holds, filling the screen) as you
          arrive: a real scroll STOP, the same hold the Projects title uses, so a
          strong scroll can't fly past it. It releases to the footer after. */}
      <div className="relative h-[160vh]">
        {/* ---- The desktop "screen" — pinned, full viewport height ---- */}
        <div
          ref={deskRef}
          className="sticky top-0 h-[100svh] min-h-[560px] w-full overflow-hidden bg-black"
        >
          {/* Wallpaper. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- desktop wallpaper plate */}
          <img
            src={WALLPAPER}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.82) contrast(1.02)" }}
          />
          {/* Vignette so files + dock read on any photo. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 36%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.30) 100%), linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.34))",
            }}
          />

        {/* ---- Desktop files (draggable, document-style) ---- */}
        {THOUGHTS.map((t) => {
          const pos = positions[t.slug];
          const isDragging = dragSlug === t.slug;
          return (
            <div
              key={t.slug}
              role="button"
              tabIndex={0}
              aria-label={`Open: ${t.headline}`}
              onPointerDown={(e) => startDrag(e, t.slug)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setOpenSlug(t.slug)
              }
              className="group absolute flex w-[80px] -translate-x-1/2 cursor-grab select-none flex-col items-center gap-1.5 outline-none active:cursor-grabbing"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                zIndex: isDragging ? 30 : 12,
                touchAction: "none",
              }}
            >
              {/* The file icon: a clean rounded photo thumbnail (macOS-style —
                  the cover IS the icon), exactly like the reference. */}
              <div
                className={
                  "h-[44px] w-[60px] overflow-hidden rounded-[7px] shadow-[0_7px_18px_rgba(0,0,0,0.45)] ring-1 ring-white/20 transition-transform duration-150 " +
                  (isDragging ? "scale-105" : "group-hover:scale-[1.06]")
                }
              >
                {t.cover && (
                  // eslint-disable-next-line @next/next/no-img-element -- file thumbnail
                  <img
                    src={t.cover}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="line-clamp-2 max-w-[82px] rounded px-1 text-center text-[11px] font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]">
                {t.headline}
              </span>
            </div>
          );
        })}

        {/* ---- Open window ---- */}
        {open && (
          <>
            <button
              type="button"
              aria-label="Close window"
              onClick={() => setOpenSlug(null)}
              className="absolute inset-0 z-40 cursor-default bg-black/10"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={open.headline}
              className="absolute left-1/2 top-1/2 z-50 flex h-[82%] w-[78%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-black/10 bg-[#faf8f2] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
              style={{ animation: "mac-window-in 0.22s ease-out" }}
            >
              {/* Title bar */}
              <div className="relative flex h-10 flex-shrink-0 items-center gap-2 border-b border-black/10 bg-[#f1ede4] px-4">
                <button
                  type="button"
                  onClick={() => setOpenSlug(null)}
                  aria-label="Close"
                  className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57]"
                >
                  <XIcon className="h-2.5 w-2.5 text-black/50 opacity-0 group-hover:opacity-100" />
                </button>
                <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e]" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#28c840]" />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 truncate font-mono text-[11px] text-black/45">
                  {open.headline}
                </span>
                <Link
                  href={`/thoughts/${open.slug}`}
                  aria-label="Open full page"
                  className="ml-auto text-black/40 transition-colors hover:text-black/70"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-7 py-7 md:px-10 md:py-9">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.35em] text-black/40">
                  {open.tag && <span>{open.tag}</span>}
                  {open.tag && open.date && <span className="text-black/20">·</span>}
                  {open.date && <span>{open.date}</span>}
                  {open.readTime && <span className="text-black/20">·</span>}
                  {open.readTime && <span>{open.readTime}</span>}
                </div>

                <h3 className="mt-4 font-serif text-3xl leading-[1.06] tracking-tight text-[#0a0a0a] md:text-4xl">
                  {open.headline}
                </h3>

                {open.excerpt && (
                  <p className="mt-4 font-serif text-xl italic leading-snug text-black/55">
                    {open.excerpt}
                  </p>
                )}

                {open.cover && (
                  <div className="mt-7 overflow-hidden rounded-xl border border-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element -- cover */}
                    <img
                      src={open.cover}
                      alt=""
                      className="block max-h-[320px] w-full object-cover"
                    />
                  </div>
                )}

                {open.bodyHtml && (
                  <div
                    className={"mt-7 border-t border-black/10 pt-7 " + BODY_HTML_CLASS}
                    // Trusted, authored HTML from Tobia's blog export.
                    dangerouslySetInnerHTML={{ __html: open.bodyHtml }}
                  />
                )}

                {open.tag && TAG_HREF[open.tag] && (
                  <div className="mt-9 border-t border-black/10 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-black/35">
                    <Link href={TAG_HREF[open.tag]} className="hover:text-cyan-900">
                      More on {open.tag} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---- Dock ---- */}
        <div className="absolute bottom-6 left-1/2 z-[30] -translate-x-1/2">
          <div
            className="flex items-end gap-2.5 rounded-2xl border border-white/25 px-3 py-2 shadow-xl"
            style={{
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(16px) saturate(150%)",
              WebkitBackdropFilter: "blur(16px) saturate(150%)",
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.placeholder ? `${s.label} (placeholder)` : s.label}
                aria-label={s.label}
                className={
                  "flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition-transform duration-200 hover:-translate-y-1.5 " +
                  s.tile
                }
              >
                {s.glyph}
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
