"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Play } from "lucide-react";
import { useMember } from "@/components/account/use-member";
import { JOIN_HREF } from "@/components/account/links";
import { hasPerk } from "@/lib/membership/tiers";
import { LESSONS, clock, type Lesson as SiteLesson } from "@/lib/masterclass/lessons";
import { TRACKS } from "./tracks";

/**
 * THE MASTERCLASS, laid out like a YouTube channel: a banner, Tobi's face
 * and name, tabs, then the lesson playing now and a row of videos per
 * subject (tracks.ts). Only for people with an account (proxy.ts sends
 * everyone else to sign in).
 *
 * THE LESSONS THAT PLAY HERE (lib/masterclass/lessons.ts) open on top, in a
 * proper player: the cover, the chapters beside it, and it picks up where
 * you left off. The video comes through /api/membership/watch, which only
 * answers a member whose plan opens the Masterclass (or who bought the skill
 * the lesson comes with); anyone else sees the cover and the way in.
 *
 * Every subject still has its grey "Coming soon" frames next to what's out:
 * the room is being filled, and it should look like it.
 *
 * Lessons added only in the database (scripts/shelf-add.mjs, a link
 * somewhere else) still show in "Latest" for members, as before.
 */

type DbLesson = { id: string; title: string; summary: string | null; url: string | null; locked: boolean; shelf: string };
type Access = "checking" | "open" | "locked";

const PER_ROW = 6;
const TABS = ["Home", "Videos", "Playlists"] as const;
type Tab = (typeof TABS)[number];

export function MasterclassPage() {
  const member = useMember();
  const plan = Boolean(member && hasPerk(member.tier, "masterclass"));
  const [lessons, setLessons] = useState<DbLesson[] | null>(null);
  const [tab, setTab] = useState<Tab>("Home");
  const [current, setCurrent] = useState<SiteLesson>(LESSONS[0]);
  const [access, setAccess] = useState<Record<string, Access>>({});
  const player = useRef<PlayerHandle>(null);
  const stage = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!plan) return;
    let alive = true;
    fetch("/api/membership/perks", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((r: { ok?: boolean; training?: DbLesson[] }) => {
        // A lesson that plays here is already on top; its dashboard row only points back to it.
        if (alive && r.ok) setLessons((r.training ?? []).filter((t) => t.shelf === "masterclass" && !t.url?.includes("?watch=")));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [plan]);

  // Who can play what: asked once per lesson, as soon as we know who's here.
  useEffect(() => {
    if (!member) return;
    let alive = true;
    for (const l of LESSONS) {
      fetch(`/api/membership/watch?v=${l.slug}`, { cache: "no-store", credentials: "same-origin" })
        .then((r) => (alive ? setAccess((a) => ({ ...a, [l.slug]: r.ok ? "open" : "locked" })) : null))
        .catch(() => alive && setAccess((a) => ({ ...a, [l.slug]: "locked" })));
    }
    return () => {
      alive = false;
    };
  }, [member]);

  // ?watch=<slug> (the dashboard's link, the emails): that lesson, in view.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("watch");
    const asked = LESSONS.find((l) => l.slug === slug);
    if (!asked) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(asked);
    requestAnimationFrame(() => stage.current?.scrollIntoView({ block: "start" }));
  }, []);

  const watch = (l: SiteLesson) => {
    setTab("Home");
    setCurrent(l);
    requestAnimationFrame(() => {
      stage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (accessOf(l.slug) === "open") player.current?.play();
    });
  };

  // Signed out (proxy.ts normally stops that before the page): nothing plays.
  const accessOf = (slug: string): Access => (member === null ? "locked" : (access[slug] ?? "checking"));
  const real = lessons ?? [];
  const count = LESSONS.length + real.length;

  return (
    <div className="mx-auto w-full max-w-[80rem] px-5 pb-28 pt-24 md:px-8 md:pt-28">
      {/* the banner */}
      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#0a0a0b] px-6 sm:aspect-[6.2/1] sm:h-auto">
        <div aria-hidden className="absolute -right-[10%] -top-[140%] h-[300%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(36,64,255,0.5),rgba(36,64,255,0)_65%)]" />
        <p className="relative text-center text-[clamp(1.4rem,3.6vw,2.8rem)] font-semibold tracking-[-0.03em] text-white">
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
            Masterclass · {count} {count === 1 ? "lesson" : "lessons"} · more being filmed · members only
          </p>
          <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-[1.5] text-black/70">
            How I build, design, launch and sell. Never on YouTube.
          </p>
          {member && !plan ? (
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
          <Stage ref={stage} lesson={current} access={accessOf(current.slug)} player={player} />

          {real.length ? (
            <Shelf title="Latest" line="The newest lessons, as they go in.">
              {real.map((l) => (
                <Video key={l.id} title={l.title} meta={l.summary ?? "Masterclass"} url={l.locked ? null : l.url} />
              ))}
            </Shelf>
          ) : null}
          {TRACKS.map((t) => {
            const out = LESSONS.filter((l) => l.track === t.id);
            return (
              <Shelf key={t.id} title={t.title} line={t.line}>
                {out.map((l) => (
                  <LessonCard key={l.slug} lesson={l} onWatch={() => watch(l)} playing={l.slug === current.slug} />
                ))}
                {Array.from({ length: PER_ROW - out.length }, (_, i) => (
                  <Video key={i} title="Coming soon" meta={t.title} />
                ))}
              </Shelf>
            );
          })}
        </div>
      ) : tab === "Videos" ? (
        <ul className="mt-8 grid list-none grid-cols-1 gap-x-4 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map((l) => (
            <LessonCard key={l.slug} lesson={l} onWatch={() => watch(l)} grid />
          ))}
          {real.map((l) => (
            <Video key={l.id} title={l.title} meta={l.summary ?? "Masterclass"} url={l.locked ? null : l.url} grid />
          ))}
          {TRACKS.flatMap((t) =>
            Array.from({ length: PER_ROW - LESSONS.filter((l) => l.track === t.id).length }, (_, i) => (
              <Video key={`${t.id}-${i}`} title="Coming soon" meta={t.title} grid />
            )),
          )}
        </ul>
      ) : (
        <ul className="mt-8 grid list-none grid-cols-1 gap-x-4 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((t) => {
            const out = LESSONS.filter((l) => l.track === t.id);
            const body = (
              <>
                <div className="relative">
                  <div className="absolute inset-x-3 -top-1.5 h-3 rounded-t-[0.7rem] bg-black/10" aria-hidden />
                  {out[0] ? <Cover lesson={out[0]} /> : <Thumb label="Coming soon" />}
                  <span className="absolute bottom-2 right-2 rounded-[0.35rem] bg-black/75 px-1.5 py-0.5 text-[0.75rem] font-semibold text-white">
                    {out.length ? `${out.length} out · more coming` : `${PER_ROW} videos`}
                  </span>
                </div>
                <p className="mt-3 text-[1rem] font-semibold leading-snug">{t.title}</p>
                <p className="mt-1 text-[0.86rem] text-black/55">{t.line}</p>
              </>
            );
            return (
              <li key={t.id}>
                {out[0] ? (
                  <button type="button" onClick={() => watch(out[0])} className="block w-full text-left">
                    {body}
                  </button>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * THE LESSON PLAYING NOW: the player, and beside it what it is and its
 * chapters. On a phone the chapters go under it.
 * ------------------------------------------------------------------ */

type PlayerHandle = { play: () => void; seek: (s: number) => void };

function Stage({
  ref,
  lesson,
  access,
  player,
}: {
  ref: React.Ref<HTMLElement>;
  lesson: SiteLesson;
  access: Access;
  player: React.RefObject<PlayerHandle | null>;
}) {
  const [at, setAt] = useState(0);
  const chapter = lesson.chapters.reduce((n, [s], i) => (at >= s ? i : n), 0);
  const open = access === "open";

  return (
    <section ref={ref} aria-labelledby="now-title" className="scroll-mt-24 border-b border-black/10 py-8 md:py-10">
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-9">
        <Player key={lesson.slug} ref={player} lesson={lesson} access={access} onTime={setAt} />

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-black/50">
            <span className="rounded-full bg-[#b93a26] px-2 py-0.5 text-[0.7rem] tracking-[0.1em] text-white">New</span>
            Lesson {String(lesson.number).padStart(2, "0")} · {lesson.duration}
          </p>
          <h2 id="now-title" className="mt-3 text-balance text-[clamp(1.6rem,2.6vw,2.15rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            {lesson.title}
          </h2>
          <p className="mt-3 text-pretty text-[0.98rem] leading-[1.55] text-black/65">{lesson.line}</p>

          <h3 className="mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-black/45">Chapters</h3>
          <ol className="mt-2 list-none border-t border-black/10 p-0">
            {lesson.chapters.map(([s, what], i) => {
              const here = open && at > 0 && i === chapter;
              return (
                <li key={s} className="border-b border-black/10">
                  <button
                    type="button"
                    disabled={!open}
                    onClick={() => player.current?.seek(s)}
                    aria-current={here ? "true" : undefined}
                    className={`flex w-full items-baseline gap-4 py-2.5 text-left text-[0.94rem] leading-[1.35] transition-colors enabled:hover:text-black disabled:cursor-default ${here ? "font-semibold text-black" : "text-black/70"}`}
                  >
                    <span className={`w-10 shrink-0 font-mono text-[0.8rem] tabular-nums ${here ? "text-[#b93a26]" : "text-black/45"}`}>{clock(s)}</span>
                    <span>{what}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

const resumeKey = (slug: string) => `masterclass:${slug}:at`;
const readResume = (slug: string) => {
  try {
    return Number(localStorage.getItem(resumeKey(slug))) || 0;
  } catch {
    return 0;
  }
};
const saveResume = (slug: string, s: number) => {
  try {
    if (s > 0) localStorage.setItem(resumeKey(slug), String(Math.floor(s)));
    else localStorage.removeItem(resumeKey(slug));
  } catch {}
};

/**
 * THE PLAYER. The cover and one big button until it's pressed; then the
 * video with the browser's own controls (they work everywhere, keyboard and
 * fullscreen included). The source is a signed link, fetched on the first
 * play and fetched again if it runs out mid-lesson.
 */
function Player({
  ref,
  lesson,
  access,
  onTime,
}: {
  ref: React.Ref<PlayerHandle>;
  lesson: SiteLesson;
  access: Access;
  onTime: (s: number) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [resume, setResume] = useState(0);
  const pending = useRef<number | null>(null);
  const lastSave = useRef(0);

  useEffect(() => {
    const s = readResume(lesson.slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResume(s > 10 && s < lesson.seconds - 15 ? s : 0);
  }, [lesson]);

  const source = async () => {
    const r = await fetch(`/api/membership/watch?v=${lesson.slug}`, { cache: "no-store", credentials: "same-origin" });
    const body = (await r.json().catch(() => ({}))) as { src?: string };
    if (!r.ok || !body.src) throw new Error("no source");
    return body.src;
  };

  const start = async (from: number) => {
    if (access !== "open") return;
    setFailed(false);
    setStarted(true);
    pending.current = from;
    if (src) {
      const v = video.current;
      if (v) {
        v.currentTime = from;
        void v.play().catch(() => {});
      }
      return;
    }
    try {
      setSrc(await source());
    } catch {
      setFailed(true);
      setStarted(false);
    }
  };

  // The handle the chapters and the lesson cards use.
  useImperativeHandle(ref, () => ({ play: () => void start(resume), seek: (s: number) => void start(s) }));

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[1.1rem] bg-[#0a0a0b] shadow-[0_30px_60px_-30px_rgba(10,10,11,0.55)] ring-1 ring-black/10">
      {src ? (
        <video
          ref={video}
          src={src}
          poster={lesson.poster}
          controls
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full bg-black ${started ? "" : "invisible"}`}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (pending.current !== null) {
              v.currentTime = pending.current;
              pending.current = null;
            }
            void v.play().catch(() => {});
          }}
          onTimeUpdate={(e) => {
            const t = e.currentTarget.currentTime;
            onTime(t);
            if (Math.abs(t - lastSave.current) > 5) {
              lastSave.current = t;
              saveResume(lesson.slug, t);
            }
          }}
          onEnded={() => saveResume(lesson.slug, 0)}
          onError={async (e) => {
            // The signed link ran out (a tab left open for hours): a fresh one, same spot.
            const at = e.currentTarget.currentTime;
            try {
              pending.current = at;
              setSrc(await source());
            } catch {
              setFailed(true);
            }
          }}
        />
      ) : null}

      {!started ? (
        <div className="absolute inset-0">
          <Image src={lesson.poster} alt="" fill priority sizes="(min-width: 1024px) 56rem, 100vw" className={`object-cover ${access === "locked" ? "opacity-45" : ""}`} />
          {access === "locked" ? (
            <div className="absolute inset-0 grid place-items-center bg-black/60 p-6 text-center text-white backdrop-blur-md">
              <div className="max-w-[26rem]">
                <span className="mx-auto hidden h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur sm:grid">
                  <Lock aria-hidden className="h-5 w-5" />
                </span>
                <p className="text-[clamp(1.1rem,2vw,1.4rem)] sm:mt-4 font-semibold leading-tight tracking-[-0.01em]">Included in Pro and Ultimate</p>
                {lesson.product ? (
                  <p className="mt-2 hidden text-[0.92rem] leading-[1.5] text-white/75 sm:block">
                    Bought the skill it&rsquo;s about? This lesson is yours too: the link is in your email.
                  </p>
                ) : null}
                <Link
                  href={`${JOIN_HREF}#pro`}
                  className="mt-3 inline-flex rounded-full bg-white px-5 py-2.5 text-[0.92rem] font-semibold text-[#0a0a0a] sm:mt-5 transition-transform hover:-translate-y-0.5"
                >
                  Watch with Pro
                </Link>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void start(resume)}
              disabled={access !== "open"}
              aria-label={`Play lesson ${lesson.number}: ${lesson.title}`}
              className="group absolute inset-0 grid place-items-center focus-visible:outline-none"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#0a0a0a] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-white/60 group-disabled:opacity-70 sm:h-[5.5rem] sm:w-[5.5rem]">
                <Play aria-hidden className="ml-1 h-6 w-6 fill-current sm:h-8 sm:w-8" />
              </span>
            </button>
          )}
          {access === "open" ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
              <span className="text-[0.85rem] font-semibold">{resume ? `Pick up at ${clock(resume)}` : `${lesson.duration} · watch from the start`}</span>
              {resume ? (
                <button
                  type="button"
                  onClick={() => void start(0)}
                  className="pointer-events-auto rounded-full bg-white/15 px-3 py-1 text-[0.8rem] font-semibold backdrop-blur transition-colors hover:bg-white/25"
                >
                  Start over
                </button>
              ) : null}
            </div>
          ) : null}
          {failed ? (
            <p role="alert" className="absolute inset-x-0 top-0 bg-[#b93a26] px-4 py-2 text-center text-[0.88rem] font-semibold text-white">
              The video didn&rsquo;t load. Try again in a moment.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * THE ROWS
 * ------------------------------------------------------------------ */

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

function Cover({ lesson }: { lesson: SiteLesson }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[0.8rem] bg-[#0a0a0b]">
      <Image src={lesson.poster} alt="" fill sizes="(min-width: 1024px) 20rem, 80vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      <span className="absolute bottom-2 right-2 rounded-[0.35rem] bg-black/80 px-1.5 py-0.5 text-[0.75rem] font-semibold tabular-nums text-white">{lesson.duration}</span>
    </div>
  );
}

const rowItem = "w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-5rem)/6)]";

function LessonCard({ lesson, onWatch, playing = false, grid = false }: { lesson: SiteLesson; onWatch: () => void; playing?: boolean; grid?: boolean }) {
  return (
    <li className={grid ? "" : rowItem}>
      <button type="button" onClick={onWatch} className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]">
        <Cover lesson={lesson} />
        <p className="mt-3 line-clamp-2 text-[0.98rem] font-semibold leading-snug">{lesson.title}</p>
        <p className="mt-1 text-[0.85rem] text-black/55">
          {playing ? <span className="font-semibold text-[#b93a26]">Now showing · </span> : null}
          Lesson {String(lesson.number).padStart(2, "0")} · {lesson.duration}
        </p>
      </button>
    </li>
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
    <li className={grid ? "" : rowItem}>
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
