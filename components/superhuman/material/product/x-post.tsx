"use client";

import { useEffect, useRef, useState } from "react";
import { ChartNoAxesColumn, Heart, MessageCircle, Play, Repeat2, Volume2, VolumeX } from "lucide-react";

/* eslint-disable @next/next/no-img-element -- avatars and the poster stay on X's CDN (pbs.twimg.com); next/image would copy them through our optimiser. */
/**
 * A POST FROM X, DRAWN AS X DRAWS IT: name, text, the quoted post with its
 * video, and the counts. No embed script: X's widget loads its own tracking
 * and lays itself out late, so this is a snapshot taken on the day it went in,
 * linked to the live post.
 *
 * Other people's pictures are not copied here: avatars and the video's first
 * frame load from X's own servers (pbs.twimg.com allows that). The video file
 * doesn't: video.twimg.com answers 403 to any page but x.com, and X's own
 * embed shows "Watch on X" for it too. So a video plays in place only from a
 * copy given as `src` (someone else's video: only with their OK). Without one,
 * the first frame, the length and a play button link to the post on X.
 *
 * With `src`, the video starts muted when it scrolls in, like on X, and stops
 * when it leaves. A tap turns the sound on. Reduced motion: it waits for a tap.
 */

export type XAuthor = { name: string; handle: string; avatar: string };

export type XVideo = {
  /** A copy we host. Absent: the poster links to the post on X. */
  src?: string;
  poster: string;
  /** Seconds, shown on the poster. */
  duration?: number;
  /** width / height */
  aspect: number;
  label: string;
};

export type XPostData = {
  url: string;
  author: XAuthor;
  date: string;
  text: string;
  /** Shown at the end of the quoted post's text, as X shows a quoted post's own quote: a link. */
  link?: { href: string; label: string };
  video?: XVideo;
  counts?: { replies: string; reposts: string; likes: string; views: string };
  quote?: XPostData;
};

/** X's blue badge: a scalloped seal with a tick. */
function Badge({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size} aria-label="Verified account" role="img" className="shrink-0">
      <path fill="#1d9bf0" d={SEAL} />
      <path d="M6.6 11.3l3 3 5.9-6.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Twelve soft scallops round a circle.
const SEAL = (() => {
  const n = 12, pts: string[] = [];
  for (let i = 0; i <= n * 8; i++) {
    const a = (i / (n * 8)) * Math.PI * 2;
    const r = 9.6 + 1.2 * Math.cos(a * n);
    pts.push(`${(11 + r * Math.cos(a)).toFixed(2)} ${(11 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

function XMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className="fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Avatar({ author, size }: { author: XAuthor; size: number }) {
  const [broken, setBroken] = useState(false);
  return broken ? (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-[#cfd9de] font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {author.name[0]}
    </span>
  ) : (
    <img src={author.avatar} alt="" width={size} height={size} onError={() => setBroken(true)} className="shrink-0 rounded-full bg-[#cfd9de] object-cover" style={{ width: size, height: size }} />
  );
}

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Video({ video, fallbackHref }: { video: XVideo; fallbackHref: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [left, setLeft] = useState<number | null>(null);
  const [still, setStill] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Read once, on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(reduce);
    const v = ref.current;
    if (!v || reduce) return;
    // Set here, not only as the attribute: browsers only autoplay a muted video,
    // and React doesn't put \`muted\` in the server's HTML.
    v.muted = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const tap = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      setMuted(false);
      v.play().catch(() => {});
      return;
    }
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  if (!video.src || failed) {
    return (
      <a href={fallbackHref} target="_blank" rel="noopener noreferrer" aria-label={`${video.label} Watch it on X.`} className="group relative block bg-black" style={{ aspectRatio: video.aspect }}>
        <img src={video.poster} alt="" className="block h-full w-full object-contain" />
        <span aria-hidden className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1d9bf0] text-white shadow-lg ring-4 ring-white/90 transition-transform duration-200 group-hover:scale-110">
          <Play className="ml-0.5 h-6 w-6 fill-current" />
        </span>
        {video.duration ? (
          <span aria-hidden className="absolute bottom-2.5 left-2.5 rounded-[4px] bg-black/70 px-1.5 py-0.5 text-[0.8rem] font-medium tabular-nums text-white">{time(Math.round(video.duration))}</span>
        ) : null}
        <span aria-hidden className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-3 py-0.5 text-[0.8rem] font-bold text-white transition-colors group-hover:bg-black/85">
          Watch on X
        </span>
      </a>
    );
  }

  return (
    <div className="relative bg-black" style={{ aspectRatio: video.aspect }}>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        muted={muted}
        loop
        playsInline
        preload={still ? "none" : "metadata"}
        aria-label={video.label}
        onClick={tap}
        onPlay={() => setStarted(true)}
        onTimeUpdate={(e) => setLeft(e.currentTarget.duration - e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setLeft(e.currentTarget.duration)}
        onError={() => setFailed(true)}
        className="block h-full w-full cursor-pointer object-contain"
      />
      {!started ? (
        <button type="button" onClick={tap} aria-label="Play the video" className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1d9bf0] text-white shadow-lg ring-4 ring-white/90 transition-transform hover:scale-105">
          <Play aria-hidden className="ml-0.5 h-6 w-6 fill-current" />
        </button>
      ) : null}
      {left !== null && Number.isFinite(left) ? (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-[4px] bg-black/70 px-1.5 py-0.5 text-[0.8rem] font-medium tabular-nums text-white">{time(left)}</span>
      ) : null}
      <button type="button" onClick={tap} aria-label={muted ? "Turn the sound on" : "Turn the sound off"} className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/85">
        {muted ? <VolumeX aria-hidden className="h-4 w-4" /> : <Volume2 aria-hidden className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Name({ post, size }: { post: XPostData; size: "big" | "small" }) {
  const big = size === "big";
  return (
    <div className={`flex min-w-0 items-center gap-1 ${big ? "text-[0.97rem]" : "text-[0.9rem]"} leading-5`}>
      <span className="min-w-0 truncate font-bold text-[#0f1419]">{post.author.name}</span>
      <Badge size={big ? 18 : 17} />
      {/* The handle gives way before the name does; in a quoted post on a phone it goes. */}
      <span className={`min-w-0 shrink-[8] truncate text-[#536471] ${big ? "" : "hidden sm:block"}`}>@{post.author.handle}</span>
      <span aria-hidden className="text-[#536471]">·</span>
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[#536471] hover:underline">
        {post.date}
      </a>
    </div>
  );
}

// X's own face is Chirp, which isn't ours to load; the system face is what X falls back to.
const X_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function XPost({ post }: { post: XPostData }) {
  const q = post.quote;
  const stat = (Icon: typeof Heart, n: string) => (
    <span className="inline-flex items-center gap-1.5">
      <Icon aria-hidden className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.8} />
      <span className="text-[0.82rem] tabular-nums">{n}</span>
    </span>
  );
  return (
    <article
      style={{ fontFamily: X_FONT }}
      className="w-full min-w-0 rounded-[18px] border border-[#e1e8ed] bg-white p-4 text-left text-[#0f1419] shadow-[0_30px_60px_-36px_rgba(40,30,10,0.45),0_8px_20px_-14px_rgba(40,30,10,0.2)] sm:p-5">
      <div className="flex gap-3">
        <Avatar author={post.author} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Name post={post} size="big" />
            <a href={post.url} target="_blank" rel="noopener noreferrer" aria-label="Open the post on X" className="-mr-1 -mt-0.5 rounded-full p-1 text-[#0f1419] transition-colors hover:bg-[#0f1419]/5">
              <XMark />
            </a>
          </div>
          <p className="mt-1 whitespace-pre-line text-[0.97rem] leading-[1.35]">{post.text}</p>

          {q ? (
            <div className="mt-3 overflow-hidden rounded-[16px] border border-[#cfd9de]">
              <div className="px-3 pt-3">
                <div className="flex items-center gap-1.5">
                  <Avatar author={q.author} size={22} />
                  <Name post={q} size="small" />
                </div>
                <p className="mt-1 whitespace-pre-line pb-3 text-[0.94rem] leading-[1.35]">
                  {q.text}
                  {q.link ? (
                    <>
                      {" "}
                      <a href={q.link.href} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">
                        {q.link.label}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              {q.video ? <Video video={q.video} fallbackHref={q.url} /> : null}
            </div>
          ) : null}

          {post.counts ? (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${post.counts.replies} replies, ${post.counts.reposts} reposts, ${post.counts.likes} likes, ${post.counts.views} views. Open the post on X`}
              className="mt-3 flex max-w-[26rem] items-center justify-between text-[#536471] hover:text-[#0f1419]">
              {stat(MessageCircle, post.counts.replies)}
              {stat(Repeat2, post.counts.reposts)}
              {stat(Heart, post.counts.likes)}
              {stat(ChartNoAxesColumn, post.counts.views)}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
