"use client";

import { useRef, useState } from "react";

/**
 * TRY A MORNING. The skill's own two demo reports (`ads demo` and
 * `ads demo --leads`, example accounts with made-up numbers), word for word
 * where it counts: the verdicts, the numbers, the options and the line the
 * engine writes to approvals.md when the person says yes.
 *
 * The visitor picks options and says yes; the switched-off ad's bar drains,
 * the money line says where it goes ("to the ads still running", as the
 * engine says: Meta decides the split, so the page doesn't invent one), and
 * the approval is written down with the visitor's own words.
 */

type Verdict = "BEST" | "KEEP" | "NEW" | "OFF" | "WAIT";
type Ad = { id: string; name: string; spend: number; res: string; each: string; v: Verdict; why: string };
type Option = { id: string; kind: "off" | "new"; ad: string; title: string; gain: string };
type Account = {
  key: string;
  tab: string;
  name: string;
  head: [string, string][];
  alert: string;
  ads: Ad[];
  options: Option[];
  moved: string;
};

const ACCOUNTS: Account[] = [
  {
    key: "shop",
    tab: "Online shop",
    name: "Example candle shop",
    head: [
      ["$583", "spent this week"],
      ["21", "sales"],
      ["$27.76", "a sale · target $25"],
      ["2.17×", "return on ads"],
    ],
    alert: "No spending limit on the ad account yet. Set it first: it’s the brake Meta itself enforces.",
    ads: [
      { id: "A1", name: "customer video", spend: 214, res: "12 sales", each: "$17.83", v: "BEST", why: "$18.36 a sale over two weeks, under your $25. Returning 3.35×." },
      { id: "A4", name: "founder story", spend: 138, res: "5 sales", each: "$27.60", v: "NEW", why: "The same people saw it 3.4 times and each sale got dearer: it’s wearing out." },
      { id: "A2", name: "gift box carousel", spend: 96, res: "0 sales", each: "", v: "OFF", why: "$166 a sale over two weeks: 6.6× your target." },
      { id: "A6", name: "5-star reviews", spend: 80, res: "3 sales", each: "$26.67", v: "KEEP", why: "$25.83 a sale over two weeks, 2.14× return." },
      { id: "A3", name: "burn-time demo", spend: 44, res: "1 sale", each: "$44.00", v: "KEEP", why: "Not enough spent to judge yet (needs $50)." },
      { id: "A5", name: "autumn scents", spend: 11, res: "0 sales", each: "", v: "WAIT", why: "2 days live: Meta is still testing it." },
    ],
    options: [
      { id: "off", kind: "off", ad: "A2", title: "Switch off A2 · gift box carousel", gain: "Moves about $96 a week to the ads still running." },
      { id: "new", kind: "new", ad: "A4", title: "Make a new version of A4 · founder story", gain: "Same idea, a new opening. The old one keeps running till the numbers decide." },
    ],
    moved: "$96",
  },
  {
    key: "leads",
    tab: "Lead business",
    name: "Example kitchen company",
    head: [
      ["$280", "spent this week"],
      ["15", "leads"],
      ["$18.67", "a lead · target $45"],
      ["18%", "cheaper than last week"],
    ],
    alert: "1 lead has waited over an hour for a reply (longest 3 h). It shows you who, with their phone and answers.",
    ads: [
      { id: "K1", name: "before and after", spend: 118, res: "9 leads", each: "$13.11", v: "BEST", why: "$14.29 a lead over two weeks, 17 leads." },
      { id: "K2", name: "owner’s video", spend: 92, res: "6 leads", each: "$15.33", v: "KEEP", why: "Cheap leads, but 1 of 11 is a real prospect: quality decides, not price." },
      { id: "K3", name: "price guide", spend: 61, res: "0 leads", each: "", v: "OFF", why: "$145 in two weeks and 0 leads: 3.2× what one is worth to you." },
      { id: "K4", name: "showroom tour", spend: 9, res: "0 leads", each: "", v: "WAIT", why: "3 days live: Meta is still testing it." },
    ],
    options: [
      { id: "off", kind: "off", ad: "K3", title: "Switch off K3 · price guide", gain: "Moves about $61 a week to the ads still running." },
    ],
    moved: "$61",
  },
];

const YES = "yes, do it";

function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

export function MetaAdsTry() {
  const [which, setWhich] = useState(0);
  const acc = ACCOUNTS[which];
  const [picked, setPicked] = useState<string[]>(acc.options.map((o) => o.id));
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const max = Math.max(...acc.ads.map((a) => a.spend));

  const pick = (i: number) => {
    setWhich(i);
    setPicked(ACCOUNTS[i].options.map((o) => o.id));
    setDone(false);
  };

  const chosen = acc.options.filter((o) => picked.includes(o.id));
  const offAds = done ? chosen.filter((o) => o.kind === "off").map((o) => o.ad) : [];
  const newAds = done ? chosen.filter((o) => o.kind === "new").map((o) => o.ad) : [];
  const offAd = acc.ads.find((a) => a.v === "OFF");

  const toggle = (id: string) => {
    if (done) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const sayYes = () => {
    setDone(true);
    // On a phone the log lands under the list: bring it into view.
    window.setTimeout(() => {
      const el = logRef.current;
      if (!el || window.innerWidth >= 1024) return;
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }, 60);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="ma-switch" role="group" aria-label="Pick an example business">
          {ACCOUNTS.map((a, i) => (
            <button key={a.key} type="button" aria-pressed={i === which} onClick={() => pick(i)}>
              {a.tab}
            </button>
          ))}
        </div>
        <p className="text-[0.88rem] text-white/80">{acc.name} · example account, made-up numbers</p>
      </div>

      <div className="ma-try mt-5">
        <div className="ma-panel" key={acc.key}>
          <div className="ma-head">
            {acc.head.map(([n, l]) => (
              <div key={l}>
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <p className="ma-alert">
            <b aria-hidden>!</b>
            <span>{acc.alert}</span>
          </p>
          <ul className="ma-ads">
            {acc.ads.map((a, i) => {
              const off = offAds.includes(a.id);
              const fresh = newAds.includes(a.id);
              return (
                <li key={a.id} className="ma-ad" data-v={a.v} data-done={off ? "off" : undefined} style={{ "--i": i } as React.CSSProperties}>
                  <span className="ma-chip" data-v={a.v}>
                    {a.v}
                  </span>
                  <div className="min-w-0">
                    <div className="ma-ad__line">
                      <b>
                        {a.id} · {a.name}
                      </b>
                      <span>
                        ${a.spend} · {a.res}
                        {a.each ? ` · ${a.each}` : ""}
                      </span>
                    </div>
                    <div className="ma-ad__bar" aria-hidden>
                      <i style={{ "--w": `${Math.max(4, (a.spend / max) * 100)}%` } as React.CSSProperties} />
                    </div>
                    <p className="ma-ad__why">{a.why}</p>
                  </div>
                  {off && (
                    <span className="ma-ad__tag">
                      <Tick /> Switched off
                    </span>
                  )}
                  {fresh && (
                    <span className="ma-ad__tag">
                      <Tick /> New version briefed
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ma-side">
          <p className="ma-label text-white">Options · pick any</p>
          {acc.options.map((o) => {
            const on = picked.includes(o.id);
            return (
              <label key={o.id} className="ma-opt relative" data-on={on || undefined} data-locked={done || undefined}>
                <input type="checkbox" checked={on} disabled={done} onChange={() => toggle(o.id)} />
                <span className="ma-opt__box" aria-hidden>
                  <Tick />
                </span>
                <span className="block">
                  <b>{o.title}</b>
                  <span>{o.gain}</span>
                </span>
              </label>
            );
          })}

          {!done ? (
            <>
              <button type="button" className="ma-yes" disabled={!chosen.length} onClick={sayYes}>
                {chosen.length ? `Say yes to ${chosen.length === acc.options.length && chosen.length > 1 ? "both" : chosen.length === 1 ? "this" : chosen.length}` : "Pick one to say yes"}
              </button>
              <p className="text-center text-[0.85rem] text-white/80">Nothing changes until you do.</p>
            </>
          ) : (
            <div ref={logRef} className="ma-log" role="status">
              <p>Written down, in your words</p>
              {chosen
                .filter((o) => o.kind === "off")
                .map((o) => (
                  <code key={o.id}>
                    approvals.md · 2026-11-06 09:14 · pause &ldquo;{o.ad} · {offAd?.name}&rdquo; ACTIVE → PAUSED · ok: <q>{YES}</q>
                  </code>
                ))}
              {chosen
                .filter((o) => o.kind === "new")
                .map((o) => (
                  <code key={o.id}>creative/ · a brief for a new {o.ad} opening, built from what works</code>
                ))}
              <p className="ma-log__done">
                {chosen.some((o) => o.kind === "off") ? (
                  <>
                    Done. About <span className="ma-red">{acc.moved} a week</span> now goes to the ads that work.
                  </>
                ) : (
                  <>Done. The brief is ready for whoever makes your ads.</>
                )}
              </p>
            </div>
          )}
          {done && (
            <button type="button" className="ma-again" onClick={() => setDone(false)}>
              Start the morning again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
