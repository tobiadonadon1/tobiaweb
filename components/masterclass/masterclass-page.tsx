"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { useMember } from "@/components/account/use-member";
import { JOIN_HREF } from "@/components/account/links";
import { hasPerk } from "@/lib/membership/tiers";
import { TRACKS } from "./tracks";

/**
 * THE MASTERCLASS, laid out like a YouTube channel: a banner, Tobi's face
 * and name, tabs, then a row of videos per subject (tracks.ts). Only for
 * people with an account (proxy.ts sends everyone else to sign in).
 *
 * Until the lessons are filmed every video is a grey "Coming soon" frame.
 * A member whose plan opens the Masterclass sees their real lessons
 * (/api/membership/perks, shelf "masterclass") in "Latest" as they go in.
 */

type Lesson = { id: string; title: string; summary: string | null; url: string | null; locked: boolean; shelf: string };

const PER_ROW = 6;
const TABS = ["Home", "Videos", "Playlists"] as const;
type Tab = (typeof TABS)[number];

export function MasterclassPage() {
  const member = useMember();
  const open = Boolean(member && hasPerk(member.tier, "masterclass"));
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [tab, setTab] = useState<Tab>("Home");

  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetch("/api/membership/perks", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((r: { ok?: boolean; training?: Lesson[] }) => {
        if (alive && r.ok) setLessons((r.training ?? []).filter((t) => t.shelf === "masterclass"));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [open]);

  const real = lessons ?? [];
  const total = real.length + TRACKS.length * PER_ROW;

  return (
    <div className="mx-auto w-full max-w-[80rem] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      {/* the banner */}
      <div className="flex h-28 items-center sm:aspect-[6.2/1] sm:h-auto justify-center overflow-hidden rounded-[1.1rem] bg-[#0a0a0a] px-6">
        <p className="text-center text-[clamp(1.4rem,3.6vw,2.8rem)] font-semibold tracking-[-0.03em] text-white">
          Masterclass<span className="text-white/45"> · by Tobi</span>
        </p>
      </div>

      {/* the channel */}
      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
        <Image
          src="/shop/copycat-detective/tobi-avatar-v1.jpg"
          alt="Tobia Donadon"
          width={400}
          height={400}
          className="h-24 w-24 shrink-0 rounded-full object-cover sm:h-36 sm:w-36"
        />
        <div className="min-w-0">
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight tracking-[-0.02em]">Tobia Donadon</h1>
          <p className="mt-1 text-[0.95rem] text-black/60">
            Masterclass · {total} videos · members only
          </p>
          <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-[1.5] text-black/70">
            How I build, design, launch and sell. Never on YouTube.
          </p>
          {member && !open ? (
            <Link
              href={`${JOIN_HREF}#pro`}
              className="mt-4 inline-flex rounded-full bg-[#0a0a0a] px-5 py-2.5 text-[0.92rem] font-semibold text-white transition-colors hover:bg-black/80"
            >
              Watch with Pro
            </Link>
          ) : null}
        </div>
      </header>

      {/* tabs */}
      <nav aria-label="Masterclass" className="mt-6 flex gap-7 border-b border-black/10">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? "page" : undefined}
            className={`-mb-px border-b-2 pb-3 text-[1rem] font-semibold transition-colors ${tab === t ? "border-[#0a0a0a] text-[#0a0a0a]" : "border-transparent text-black/50 hover:text-black/80"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Home" ? (
        <div>
          {real.length ? (
            <Shelf title="Latest" line="The newest lessons, as they go in.">
              {real.map((l) => (
                <Video key={l.id} title={l.title} meta={l.summary ?? "Masterclass"} url={l.locked ? null : l.url} />
              ))}
            </Shelf>
          ) : null}
          {TRACKS.map((t) => (
            <Shelf key={t.id} title={t.title} line={t.line}>
              {Array.from({ length: PER_ROW }, (_, i) => (
                <Video key={i} title="Coming soon" meta={t.title} />
              ))}
            </Shelf>
          ))}
        </div>
      ) : tab === "Videos" ? (
        <ul className="mt-8 grid list-none grid-cols-1 gap-x-4 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {real.map((l) => (
            <Video key={l.id} title={l.title} meta={l.summary ?? "Masterclass"} url={l.locked ? null : l.url} grid />
          ))}
          {TRACKS.flatMap((t) => Array.from({ length: PER_ROW }, (_, i) => <Video key={`${t.id}-${i}`} title="Coming soon" meta={t.title} grid />))}
        </ul>
      ) : (
        <ul className="mt-8 grid list-none grid-cols-1 gap-x-4 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((t) => (
            <li key={t.id}>
              <div className="relative">
                <div className="absolute inset-x-3 -top-1.5 h-3 rounded-t-[0.7rem] bg-black/10" aria-hidden />
                <Thumb label="Coming soon" />
                <span className="absolute bottom-2 right-2 rounded-[0.35rem] bg-black/75 px-1.5 py-0.5 text-[0.75rem] font-semibold text-white">
                  {PER_ROW} videos
                </span>
              </div>
              <p className="mt-3 text-[1rem] font-semibold leading-snug">{t.title}</p>
              <p className="mt-1 text-[0.86rem] text-black/55">{t.line}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** One category: a title, a line, and its videos in a row that scrolls sideways. */
function Shelf({ title, line, children }: { title: string; line: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-black/10 py-8 last:border-b-0">
      <div className="flex items-center gap-5">
        <h2 className="text-[1.25rem] font-bold tracking-[-0.01em]">{title}</h2>
        <span className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-black/40">
          <Play aria-hidden className="h-4 w-4 fill-current" />
          Play all
        </span>
      </div>
      <p className="mt-1 text-[0.9rem] text-black/55">{line}</p>
      <ul className="-mx-5 mt-4 flex list-none snap-x scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:scroll-px-0 [scrollbar-width:none] md:mx-0 md:px-0">
        {children}
      </ul>
    </section>
  );
}

function Thumb({ label }: { label: string }) {
  return (
    <div className="grid aspect-video w-full place-items-center rounded-[0.8rem] bg-[#dcdad3]">
      <span className="text-[0.85rem] font-semibold text-black/45">{label}</span>
    </div>
  );
}

function Video({ title, meta, url, grid = false }: { title: string; meta: string; url?: string | null; grid?: boolean }) {
  const body = (
    <>
      <Thumb label={url ? "Watch" : "Coming soon"} />
      <p className="mt-3 line-clamp-2 text-[0.98rem] font-semibold leading-snug">{title}</p>
      <p className="mt-1 text-[0.85rem] text-black/55">{meta}</p>
    </>
  );
  return (
    <li className={grid ? "" : "w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-5rem)/6)]"}>
      {url ? (
        <a href={url} className="block" target="_blank" rel="noopener noreferrer">
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
