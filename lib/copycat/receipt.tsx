import fs from "node:fs";
import { ImageResponse } from "next/og";
import { who } from "./run.mjs";
import { day, clock, short } from "./util.mjs";
import type { Decision, Kase } from "./judge";

/* eslint-disable @next/next/no-img-element -- Satori draws plain <img> into a PNG; next/image has no meaning here. */
/**
 * THE RECEIPT, drawn on the server: the skill's receipt (scripts/receipt.mjs)
 * redrawn for Satori, which renders the site's share cards. 2400 x 1350, 16:9
 * so X shows it uncropped, with the gap, the stamp and the names sized to
 * read on a phone. Satori can't measure text, so long names and gaps are
 * sized from their length instead.
 */


const PAPER = "#F3F0E8", INK = "#121212", SOFT = "#6A665C", LINE = "#D9D4C8", WELL = "#E4E0D5", RED = "#D2321F", GREEN = "#13824A";

const fontCache = new Map<string, Promise<ArrayBuffer | null>>();
/** Geist and Geist Mono as TrueType (Satori can't read woff2): Google serves ttf to an old user agent. */
function font(family: string, weight: number) {
  const k = `${family}:${weight}`;
  if (!fontCache.has(k)) {
    fontCache.set(k, (async () => {
      try {
        const css = await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" }, signal: AbortSignal.timeout(8000) }).then((r) => r.text());
        const url = /src:\s*url\((https:[^)]+)\)/.exec(css)?.[1];
        return url ? await fetch(url, { signal: AbortSignal.timeout(8000) }).then((r) => r.arrayBuffer()) : null;
      } catch {
        return null;
      }
    })());
  }
  return fontCache.get(k)!;
}

const dataUrl = (file?: string | null) => {
  try { return file ? `data:image/jpeg;base64,${fs.readFileSync(/*turbopackIgnore: true*/ file).toString("base64")}` : null; } catch { return null; }
};

/** Fit a one-line string into `width` px: the size that keeps it on one line. */
const fit = (text: string, width: number, max: number, min: number, em = 0.56) => Math.max(min, Math.min(max, Math.floor(width / (Math.max(1, [...text].length) * em))));

export async function receiptPng(k: Kase, d: Decision): Promise<Buffer> {
  const [g5, g6, g7, m5, m6, m7, m8] = await Promise.all([font("Geist", 500), font("Geist", 600), font("Geist", 700), font("Geist Mono", 500), font("Geist Mono", 600), font("Geist Mono", 700), font("Geist Mono", 800)]);
  const fonts = ([
    ["G", g5, 500], ["G", g6, 600], ["G", g7, 700], ["M", m5, 500], ["M", m6, 600], ["M", m7, 700], ["M", m8, 800],
  ] as const).filter(([, data]) => data).map(([name, data, weight]) => ({ name, data: data as ArrayBuffer, weight: weight as 500 | 600 | 700 | 800, style: "normal" as const }));

  const E = k.earlier, L = k.later, ord = k.order;
  const fe = d.show!.earlier, fl = d.show!.later;
  const wideE = fe.size && fe.size.width / fe.size.height > 1.15, wideL = fl.size && fl.size.width / fl.size.height > 1.15;
  const stack = wideE && wideL;

  const W = 2400, H = 1350, PAD = 66, ASIDE = 700, GAP = 68;
  const pairW = W - PAD * 2 - ASIDE - GAP;
  const when = (it: Kase) => (it.when.precision === "by" ? `by ${day(it.when.iso)} · archive` : it.when.precision === "day" ? day(it.when.iso) : `${day(it.when.iso)} · ${clock(it.when.iso)}`);
  const red = d.verdict !== "credited";
  const stamp = d.verdict === "credited" ? "Credited" : d.verdict === "reupload" ? `Same ${fe.from.startsWith("video") && fl.from.startsWith("video") ? "video" : "image"}` : "No credit";
  const credit = d.verdict === "credited"
    ? String((k.credit.signals || []).find((x: Kase) => x.kind !== "words" && x.kind !== "generic")?.text || "").replace(/^./, (c) => c.toUpperCase())
    : `None in ${L.kind === "x" ? (k.creditRead?.replies === false ? "the post" : "the post or its replies") : ["appstore", "play"].includes(L.kind) ? "the listing" : L.kind === "github" ? "the repo or README" : "the page"}`;
  const gapWords = String(ord.label).replace(/ later$/, "");
  const gapSize = fit(gapWords, ASIDE, 132, 76, 0.55);
  const matchSize = d.matches.join("").length > 110 ? 44 : 50;

  const panel = (tag: string, f: Kase, it: Kase, first: boolean) => {
    const name = who(it);
    const img = dataUrl(f.file);
    const av = dataUrl(it.avatarFile);
    const boxW = stack ? pairW : (pairW - 40) / 2;
    const boxH = stack ? (H - PAD * 2 - 2 * 60 - 2 * 92 - 32) / 2 : H - PAD * 2 - 60 - 150;
    return (
      <div style={{ display: "flex", flexDirection: "column", width: boxW }}>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", fontFamily: "M", fontWeight: 700, fontSize: 30, letterSpacing: 4, padding: "14px 22px 12px", borderRadius: 16, background: first ? INK : "#fff", color: first ? "#fff" : INK, border: `4px solid ${INK}` }}>{tag}</div>
        </div>
        <div style={{ display: "flex", marginTop: 20, width: boxW, height: boxH, background: WELL, borderRadius: 36, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {img ? <img alt="" src={img} width={boxW} height={boxH} style={{ objectFit: "contain" }} /> : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
          {av ? <img alt="" src={av} width={80} height={80} style={{ borderRadius: 40, marginRight: 24 }} /> : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "G", fontWeight: 600, fontSize: fit(name, boxW - (av ? 104 : 0), 56, 34, 0.56), letterSpacing: -0.5, color: INK }}>{name}</div>
            <div style={{ display: "flex", fontFamily: "M", fontWeight: 500, fontSize: 34, color: SOFT, marginTop: 4 }}>{when(it)}</div>
          </div>
        </div>
      </div>
    );
  };

  const res = new ImageResponse(
    (
      <div style={{ display: "flex", width: W, height: H, background: PAPER, padding: PAD, fontFamily: "G", color: INK }}>
        <div style={{ display: "flex", flexDirection: stack ? "column" : "row", width: pairW, justifyContent: "space-between" }}>
          {panel("FIRST", fe, E, true)}
          {panel("LATER", fl, L, false)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: ASIDE, marginLeft: GAP, height: H - PAD * 2 }}>
          <div style={{ display: "flex", fontFamily: "M", fontWeight: 600, fontSize: 28, letterSpacing: 4, color: SOFT }}>{d.verdict === "credited" ? "REMADE" : "POSTED"}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontWeight: 700, fontSize: gapSize, lineHeight: 0.94, letterSpacing: -gapSize * 0.035 }}>
            <div style={{ display: "flex" }}>{gapWords}</div>
            <div style={{ display: "flex" }}>later</div>
          </div>
          <div style={{ display: "flex", marginTop: 52 }}>
            <div style={{ display: "flex", fontFamily: "M", fontWeight: 800, fontSize: 66, letterSpacing: 4, padding: "22px 34px 20px", border: `8px solid ${red ? RED : GREEN}`, borderRadius: 20, color: red ? RED : GREEN, transform: "rotate(-4deg)", textTransform: "uppercase" }}>{stamp}</div>
          </div>
          <div style={{ display: "flex", marginTop: 30, fontFamily: "M", fontWeight: 500, fontSize: 32, color: SOFT }}>{credit}</div>
          <div style={{ display: "flex", marginTop: 52, fontFamily: "M", fontWeight: 600, fontSize: 28, letterSpacing: 4, color: SOFT }}>WHAT MATCHES</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
            {d.matches.map((m) => (
              <div key={m} style={{ display: "flex", marginBottom: 18 }}>
                <div style={{ display: "flex", width: 20, height: 20, background: INK, borderRadius: 4, marginTop: matchSize * 0.38, marginRight: 26 }} />
                <div style={{ display: "flex", flex: 1, fontWeight: 600, fontSize: matchSize, lineHeight: 1.16, letterSpacing: -0.5 }}>{m.replace(/(^|[\s(])"/g, "$1“").replace(/"/g, "”")}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", paddingTop: 30, borderTop: `4px dashed ${LINE}`, fontFamily: "M", fontWeight: 500, color: SOFT }}>
            {[["first", E], ["later", L]].map(([lab, it]) => {
              const s = short((it as Kase).url);
              return (
                <div key={lab as string} style={{ display: "flex", fontSize: fit(`${lab} ${s}`, ASIDE, 26, 17, 0.6), whiteSpace: "nowrap" }}>
                  <span style={{ color: INK, fontWeight: 600, marginRight: 14 }}>{lab as string}</span>
                  {s}
                </div>
              );
            })}
            <div style={{ display: "flex", marginTop: 14, fontSize: 25, fontWeight: 700, letterSpacing: 3, color: INK }}>{`CHECKED ${day(k.checkedAt).toUpperCase()}`}</div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts },
  );
  return Buffer.from(await res.arrayBuffer());
}
