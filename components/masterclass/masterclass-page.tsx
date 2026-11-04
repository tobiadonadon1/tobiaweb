"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, FileText, Lock, Play, X } from "lucide-react";
import { useMember } from "@/components/account/use-member";
import { JOIN_HREF } from "@/components/account/links";
import { hasPerk } from "@/lib/membership/tiers";
import { COMING, LESSONS, START_HERE, clock, type Lesson as SiteLesson } from "@/lib/masterclass/lessons";
import { SHEETS, type Sheet } from "@/lib/training/sheets";

/**
 * THE MASTERCLASS: a banner, Tobi's face and name, then three rows.
 *
 *   New          the latest drops, big: title, two lines, length, Video or Doc
 *   Start here   the ones I'd hand a new member first (START_HERE)
 *   Coming soon  what's being made, greyed: a title and one line (COMING)
 *
 * Any card opens the detail view on top. A video plays there (lessons.ts),
 * with its chapters beside it; the video comes through /api/membership/watch,
 * which only answers a member whose plan opens the Masterclass (or who bought
 * the skill the lesson comes with). A doc (a guide in lib/training/sheets.ts
 * with `masterclass` set) shows its first page and its sections instead, read
 * or downloaded through /api/membership/file (the same plan check).
 *
 * Only for people with an account (proxy.ts sends everyone else to sign in).
 * Lessons added only in the database (scripts/shelf-add.mjs, a link
 * somewhere else) still show in New for members, as before.
 */

type DbLesson = { id: string; title: string; summary: string | null; kind: string; url: string | null; locked: boolean; shelf: string; added: string };
type Access = "checking" | "open" | "locked";

/** One lesson on the page, whether it's watched or read. */
type Item = { kind: "video"; id: string; added: string; lesson: SiteLesson } | { kind: "doc"; id: string; added: string; doc: Sheet };

const ITEMS: Item[] = [
  ...LESSONS.map((lesson) => ({ kind: "video" as const, id: lesson.slug, added: lesson.added, lesson })),
  ...SHEETS.filter((s) => s.masterclass).map((doc) => ({ kind: "doc" as const, id: doc.id, added: doc.added, doc })),
].sort((a, b) => b.added.localeCompare(a.added));
const START = START_HERE.map((id) => ITEMS.find((i) => i.id === id)).filter((i): i is Item => Boolean(i));

const FILTERS = ["All", "Videos", "Docs"] as const;
type Filter = (typeof FILTERS)[number];
const shows = (f: Filter, kind: "video" | "doc") => f === "All" || (f === "Videos") === (kind === "video");

export function MasterclassPage() {
  const member = useMember();
  const plan = Boolean(member && hasPerk(member.tier, "masterclass"));
  const [lessons, setLessons] = useState<DbLesson[] | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [current, setCurrent] = useState<Item | null>(null);
  const [access, setAccess] = useState<Record<string, Access>>({});
  const player = useRef<PlayerHandle>(null);
  const stage = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!plan) return;
    let alive = true;
    fetch("/api/membership/perks", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((r: { ok?: boolean; training?: DbLesson[] }) => {
        // A lesson that plays here or a doc is already on the page: their dashboard rows only point back.
        if (alive && r.ok) setLessons((r.training ?? []).filter((t) => t.shelf === "masterclass" && t.kind !== "sheet" && !t.url?.includes("?watch=")));
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

  // ?watch=<slug> (the dashboard's link, the emails): that lesson, open.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("watch");
    const asked = ITEMS.find((i) => i.id === id);
    if (!asked) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(asked);
    requestAnimationFrame(() => stage.current?.scrollIntoView({ block: "start" }));
  }, []);

  const open = (item: Item) => {
    setCurrent(item);
    requestAnimationFrame(() => stage.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  // Signed out (proxy.ts normally stops that before the page): nothing plays.
  const accessOf = (slug: string): Access => (member === null ? "locked" : (access[slug] ?? "checking"));
  const real = lessons ?? [];
  const count = ITEMS.length + real.length;
  const fresh = ITEMS.filter((i) => shows(filter, i.kind));
  const start = START.filter((i) => shows(filter, i.kind));
  const extra = filter === "Docs" ? [] : real;

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
            Masterclass · {count} {count === 1 ? "lesson" : "lessons"} · more on the way · members only
          </p>
          <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-[1.5] text-black/70">
            How I build, design, launch and sell, on video and on paper. Never on YouTube.
          </p>
          {member && !plan ? (
            <Link
              href={`${JOIN_HREF}#pro`}
              className="mt-4 inline-flex rounded-full bg-[#0a0a0a] px-5 py-2.5 text-[0.92rem] font-semibold text-white transition-colors hover:bg-black/80"
            >
              Open with Pro
            </Link>
          ) : null}
        </div>
      </header>

      {current ? (
        current.kind === "video" ? (
          <Stage ref={stage} lesson={current.lesson} access={accessOf(current.lesson.slug)} player={player} onClose={() => setCurrent(null)} />
        ) : (
          <DocStage ref={stage} doc={current.doc} open={plan} onClose={() => setCurrent(null)} />
        )
      ) : null}

      <div role="group" aria-label="Show" className="mt-8 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-4 py-1.5 text-[0.9rem] font-semibold transition-colors ${filter === f ? "bg-[#0a0a0a] text-white" : "bg-black/[0.06] text-black/65 hover:bg-black/10"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <Row title="New" line="The latest drops.">
        <ul className="mt-4 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {fresh.map((i) => (
            <Card key={i.id} item={i} plan={plan} onOpen={() => open(i)} active={current?.id === i.id} big />
          ))}
          {extra.map((l) => (
            <li key={l.id}>
              {l.url && !l.locked ? (
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <Thumb label="Watch" />
                  <p className="mt-3 line-clamp-2 text-[1.05rem] font-semibold leading-snug">{l.title}</p>
                  <p className="mt-1 line-clamp-2 text-[0.9rem] leading-[1.45] text-black/60">{l.summary ?? "Masterclass"}</p>
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </Row>

      {start.length ? (
        <Row title="Start here" line="New to the Construct? These first, in this order.">
          <ol className="mt-4 grid list-none grid-cols-1 gap-x-5 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {start.map((i, n) => (
              <Card key={i.id} item={i} plan={plan} onOpen={() => open(i)} active={current?.id === i.id} n={n + 1} />
            ))}
          </ol>
        </Row>
      ) : null}

      <Row title="Coming soon" line="Being made now.">
        <ul className="mt-4 grid list-none grid-cols-1 gap-x-5 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {COMING.map((c) => (
            <li key={c.title} className="select-none opacity-60">
              <Thumb label="Coming soon" />
              <p className="mt-3 text-[0.98rem] font-semibold leading-snug">{c.title}</p>
              <p className="mt-1 text-[0.85rem] leading-[1.45] text-black/55">{c.line}</p>
            </li>
          ))}
        </ul>
      </Row>
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
  onClose,
}: {
  ref: React.Ref<HTMLElement>;
  lesson: SiteLesson;
  access: Access;
  player: React.RefObject<PlayerHandle | null>;
  onClose: () => void;
}) {
  const [at, setAt] = useState(0);
  const chapter = lesson.chapters.reduce((n, [s], i) => (at >= s ? i : n), 0);
  const open = access === "open";

  return (
    <section ref={ref} aria-labelledby="now-title" className="relative mt-8 scroll-mt-24 border-y border-black/10 py-8 md:py-10">
      <CloseButton onClose={onClose} />
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-9">
        <Player key={lesson.slug} ref={player} lesson={lesson} access={access} onTime={setAt} />

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-black/50">
            <Tag kind="video" />
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
 * A LESSON TO READ, OPEN: its first page beside what it is, its sections
 * with the page each starts on, and the two ways in.
 * ------------------------------------------------------------------ */
function DocStage({ ref, doc, open, onClose }: { ref: React.Ref<HTMLElement>; doc: Sheet; open: boolean; onClose: () => void }) {
  const file = `/api/membership/file?id=${doc.id}`;
  return (
    <section ref={ref} aria-labelledby="now-title" className="relative mt-8 scroll-mt-24 border-y border-black/10 py-8 md:py-10">
      <CloseButton onClose={onClose} />
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-9">
        <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-[1.1rem] bg-[#e7e4dc] ring-1 ring-black/10">
          <Page doc={doc} open={open} className="absolute top-[8%] w-[38%]" />
          {!open ? (
            <div className="absolute inset-0 grid place-items-center bg-black/45 p-6 text-center text-white backdrop-blur-sm">
              <div>
                <p className="text-[clamp(1.1rem,2vw,1.4rem)] font-semibold">Included in Pro and Ultimate</p>
                <Link href={`${JOIN_HREF}#pro`} className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-[0.92rem] font-semibold text-[#0a0a0a] transition-transform hover:-translate-y-0.5">
                  Read with Pro
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-black/50">
            <Tag kind="doc" />
            {length({ kind: "doc", id: doc.id, added: doc.added, doc })}
          </p>
          <h2 id="now-title" className="mt-3 text-balance text-[clamp(1.6rem,2.6vw,2.15rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            {doc.title}
          </h2>
          <p className="mt-3 text-pretty text-[0.98rem] leading-[1.55] text-black/65">{doc.summary}</p>
          {open ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-5 py-2.5 text-[0.92rem] font-semibold text-white transition-colors hover:bg-black/80">
                <FileText aria-hidden className="h-4 w-4" />
                Read
              </a>
              <a href={`${file}&download=1`} className="inline-flex items-center gap-2 rounded-full bg-black/[0.06] px-5 py-2.5 text-[0.92rem] font-semibold transition-colors hover:bg-black/10">
                <Download aria-hidden className="h-4 w-4" />
                Download
              </a>
            </div>
          ) : null}

          <h3 className="mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-black/45">Sections</h3>
          <ol className="mt-2 list-none border-t border-black/10 p-0">
            {(doc.masterclass ?? []).map(([page, what]) => (
              <li key={what} className="flex items-baseline gap-4 border-b border-black/10 py-2.5 text-[0.94rem] leading-[1.35] text-black/70">
                <span className="w-10 shrink-0 font-mono text-[0.8rem] tabular-nums text-black/45">p. {page}</span>
                <span>{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-0 top-2 grid h-9 w-9 place-items-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black"
    >
      <X aria-hidden className="h-5 w-5" />
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * THE ROWS
 * ------------------------------------------------------------------ */

function Row({ title, line, children }: { title: string; line: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-black/10 py-8 last:border-b-0">
      <h2 className="text-[1.25rem] font-bold tracking-[-0.01em]">{title}</h2>
      <p className="mt-1 text-[0.9rem] text-black/55">{line}</p>
      {children}
    </section>
  );
}

function Tag({ kind }: { kind: "video" | "doc" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white ${kind === "video" ? "bg-[#b93a26]" : "bg-[#2440ff]"}`}>
      {kind === "video" ? <Play aria-hidden className="h-2.5 w-2.5 fill-current" /> : <FileText aria-hidden className="h-2.5 w-2.5" />}
      {kind === "video" ? "Video" : "Doc"}
    </span>
  );
}

const length = (i: Item) => (i.kind === "video" ? i.lesson.duration : `${i.doc.pages ?? 1} ${(i.doc.pages ?? 1) === 1 ? "page" : "pages"}`);

function Thumb({ label }: { label: string }) {
  return (
    <div className="grid aspect-video w-full place-items-center rounded-[0.8rem] bg-[#dcdad3]">
      <span className="text-[0.85rem] font-semibold text-black/45">{label}</span>
    </div>
  );
}

/** A doc's first page, on paper. Without the plan, blurred. */
function Page({ doc, open, className }: { doc: Sheet; open: boolean; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={open ? `/api/membership/file?id=${doc.id}&picture=1` : `/training/${doc.id}-locked.webp`}
      alt=""
      loading="lazy"
      className={`${className} rounded-t-[0.3rem] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-translate-y-1 ${open ? "" : "opacity-60"}`}
    />
  );
}

/**
 * A LESSON'S CARD: its cover (the video's, or the doc's first page), the
 * Video or Doc tag, the title, two lines on it and its length. It opens
 * the detail view. `n` numbers the Start here row.
 */
function Card({ item, plan, onOpen, active, big = false, n }: { item: Item; plan: boolean; onOpen: () => void; active: boolean; big?: boolean; n?: number }) {
  const title = item.kind === "video" ? item.lesson.title : item.doc.title;
  const line = item.kind === "video" ? item.lesson.line : item.doc.summary;
  return (
    <li>
      <button type="button" onClick={onOpen} aria-current={active ? "true" : undefined} className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0a0a]">
        <div className={`relative aspect-video w-full overflow-hidden rounded-[0.8rem] ${item.kind === "video" ? "bg-[#0a0a0b]" : "bg-[#e7e4dc]"} ${active ? "ring-2 ring-[#0a0a0a] ring-offset-2 ring-offset-[#f7f4ec]" : ""}`}>
          {item.kind === "video" ? (
            <Image src={item.lesson.poster} alt="" fill sizes={big ? "(min-width: 1024px) 26rem, 90vw" : "(min-width: 1024px) 19rem, 90vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <Page doc={item.doc} open={plan} className="absolute left-1/2 top-[12%] w-[44%] -translate-x-1/2" />
          )}
          {n ? <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-[0.82rem] font-bold text-[#0a0a0a] shadow">{n}</span> : null}
          <span className="absolute bottom-2 right-2 rounded-[0.35rem] bg-black/80 px-1.5 py-0.5 text-[0.75rem] font-semibold tabular-nums text-white">{length(item)}</span>
        </div>
        <p className="mt-3 flex items-center gap-2">
          <Tag kind={item.kind} />
          {active ? <span className="text-[0.8rem] font-semibold text-[#b93a26]">Open now</span> : null}
        </p>
        <p className={`mt-2 line-clamp-2 font-semibold leading-snug ${big ? "text-[1.12rem]" : "text-[0.98rem]"}`}>{title}</p>
        <p className={`mt-1 line-clamp-2 leading-[1.45] text-black/60 ${big ? "text-[0.92rem]" : "text-[0.85rem]"}`}>{line}</p>
      </button>
    </li>
  );
}
