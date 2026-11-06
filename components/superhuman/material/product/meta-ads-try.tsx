"use client";

import { useRef, useState } from "react";

/**
 * TRY A MORNING. The skill's own two demo reports (`ads demo` and
 * `ads demo --leads`, example accounts with made-up numbers): the verdicts,
 * the numbers, the options and the line the engine writes to approvals.md
 * when the person says yes. Kept short on purpose (round 3: fewer words).
 *
 * The visitor picks options and says yes; the switched-off ad's bar drains,
 * and the money line says where it goes ("to the ads that sell": Meta decides
 * the split, so the page doesn't invent one).
 */

type Verdict = "BEST" | "KEEP" | "NEW" | "OFF" | "WAIT";
type Ad = { name: string; spend: number; res: string; v: Verdict };
type Option = { id: string; kind: "off" | "new"; ad: string; title: string; gain: string };
type Account = { key: string; tab: string; head: [string, string][]; ads: Ad[]; options: Option[]; moved: string };

const ACCOUNTS: Account[] = [
  {
    key: "shop",
    tab: "Online shop",
    head: [
      ["$583", "spent this week"],
      ["21", "sales"],
      ["$27.76", "a sale · target $25"],
    ],
    ads: [
      { name: "Customer video", spend: 214, res: "12 sales", v: "BEST" },
      { name: "Founder story", spend: 138, res: "5 sales", v: "NEW" },
      { name: "Gift box carousel", spend: 96, res: "0 sales", v: "OFF" },
      { name: "5-star reviews", spend: 80, res: "3 sales", v: "KEEP" },
      { name: "Autumn scents", spend: 11, res: "2 days live", v: "WAIT" },
    ],
    options: [
      { id: "off", kind: "off", ad: "Gift box carousel", title: "Switch off Gift box carousel", gain: "Frees about $96 a week." },
      { id: "new", kind: "new", ad: "Founder story", title: "Refresh Founder story", gain: "Same idea, a new opening." },
    ],
    moved: "$96",
  },
  {
    key: "leads",
    tab: "Lead business",
    head: [
      ["$280", "spent this week"],
      ["15", "leads"],
      ["$18.67", "a lead · target $45"],
    ],
    ads: [
      { name: "Before and after", spend: 118, res: "9 leads", v: "BEST" },
      { name: "Owner’s video", spend: 92, res: "6 leads", v: "KEEP" },
      { name: "Price guide", spend: 61, res: "0 leads", v: "OFF" },
      { name: "Showroom tour", spend: 9, res: "3 days live", v: "WAIT" },
    ],
    options: [{ id: "off", kind: "off", ad: "Price guide", title: "Switch off Price guide", gain: "Frees about $61 a week." }],
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

  const toggle = (id: string) => {
    if (done) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const sayYes = () => {
    setDone(true);
    // On a phone the result lands under the list: bring it into view.
    window.setTimeout(() => {
      const el = logRef.current;
      if (!el || window.innerWidth >= 1024) return;
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }, 60);
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="ma-switch ma-glass" role="group" aria-label="Pick an example business">
          {ACCOUNTS.map((a, i) => (
            <button key={a.key} type="button" aria-pressed={i === which} onClick={() => pick(i)}>
              {a.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="ma-try mt-8">
        <div className="ma-panel ma-glass" key={acc.key}>
          <div className="ma-head">
            {acc.head.map(([n, l]) => (
              <div key={l}>
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <ul className="ma-ads">
            {acc.ads.map((a, i) => {
              const off = offAds.includes(a.name);
              const fresh = newAds.includes(a.name);
              return (
                <li key={a.name} className="ma-ad" data-v={a.v} data-done={off ? "off" : undefined} style={{ "--i": i } as React.CSSProperties}>
                  <span className="ma-chip" data-v={a.v}>
                    {a.v}
                  </span>
                  <div className="min-w-0">
                    <div className="ma-ad__line">
                      <b>{a.name}</b>
                      <span>
                        ${a.spend} · {a.res}
                      </span>
                    </div>
                    <div className="ma-bar" aria-hidden>
                      <i style={{ "--w": `${Math.max(4, (a.spend / max) * 100)}%` } as React.CSSProperties} />
                    </div>
                    {(off || fresh) && (
                      <span className="ma-ad__tag">
                        <Tick /> {off ? "Switched off" : "New version briefed"}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="ma-panel__note">Example account, made-up numbers.</p>
        </div>

        <div className="ma-side">
          {acc.options.map((o) => {
            const on = picked.includes(o.id);
            return (
              <label key={o.id} className="ma-opt ma-glass" data-on={on || undefined} data-locked={done || undefined}>
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
                {chosen.length ? "Yes, do it" : "Pick one first"}
              </button>
              <p className="text-center text-[0.9rem] text-white/75">Nothing changes until you say yes.</p>
            </>
          ) : (
            <div ref={logRef} className="ma-log ma-glass" role="status">
              <p className="ma-log__done">
                {chosen.some((o) => o.kind === "off") ? (
                  <>
                    Done. <span className="ma-red">{acc.moved} a week</span> now goes to ads that sell.
                  </>
                ) : (
                  <>Done. The brief is ready.</>
                )}
              </p>
              {chosen
                .filter((o) => o.kind === "off")
                .map((o) => (
                  <code key={o.id}>
                    approvals.md · paused &ldquo;{o.ad}&rdquo; · ok: &ldquo;{YES}&rdquo;
                  </code>
                ))}
              <button type="button" className="ma-again" onClick={() => setDone(false)}>
                Start again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
