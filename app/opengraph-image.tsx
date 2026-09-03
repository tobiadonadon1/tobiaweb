import { ImageResponse } from "next/og";
import { CLAIM } from "@/lib/bio";
import { SITE_LABEL } from "@/lib/site";
import {
  INNER_STAR_D,
  OUTER_STAR_D,
  STAR_BLUE,
  STAR_RED,
} from "@/components/superhuman/construct-star";

/**
 * THE SHARE CARD.
 *
 * What this replaces: a 1000x562 photograph from the trail set, pointed at by
 * hand in the root metadata. Two things were wrong with it. It was the wrong
 * SIZE — every platform composes for 1200x630, so a 1000x562 image is upscaled
 * and soft — and it was the wrong PICTURE, because a landscape photo in a
 * message says nothing about whose link it is.
 *
 * This is drawn instead, in the site's own language: paper ground, the name in
 * ink at display size, the claim under it, the crayon star signing it, and a
 * clay rule. Somebody who has seen the site recognises the card; somebody who
 * has not can read the whole proposition without opening it.
 *
 * IT READS FROM lib/bio.ts, so the picture of the site and the words about the
 * site cannot drift apart. That drift is exactly what went wrong before: the
 * share text still said 20 when the page had said 21 for a while.
 *
 * THE STAR IS A DATA URI, NOT AN INLINE <svg>. Satori (which is what renders
 * this) supports a subset of SVG and no filters at all, so the real mark's
 * turbulence displacement cannot come along. Handing it a flat two-path SVG
 * through <img> is the shape of it that survives, and it never rotates.
 *
 * THE FONT IS FETCHED, AND FAILING IS ALLOWED. next/font serves woff2, which
 * Satori cannot parse, and there is no ttf on disk. So the face is pulled from
 * Google Fonts at build time with an old User-Agent (which is what makes them
 * serve truetype) and a short timeout. If any of that fails the card still
 * renders in Satori's default face: a slightly off-brand share image beats a
 * failed build.
 */

export const alt =
  "Tobia Donadon. I build tools, write about consciousness, and help people launch things.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#faf8f2";
const INK = "#0b1f3a";
const CLAY = "#ce4631";

/** The mark, flattened to two paths and handed over as an image. */
const STAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">` +
    `<path d="${OUTER_STAR_D}" fill="none" stroke="${STAR_BLUE}" stroke-width="3.4" stroke-linejoin="round"/>` +
    `<path d="${INNER_STAR_D}" fill="${STAR_RED}" transform="translate(-1.6 -1.1)"/>` +
    `</svg>`,
)}`;

async function face(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@${weight}`,
      {
        // An old UA is what makes Google serve truetype rather than woff2.
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
        signal: AbortSignal.timeout(6000),
      },
    ).then((r) => r.text());
    const url = /src:\s*url\((https:[^)]+)\)/.exec(css)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(6000) }).then((r) =>
      r.arrayBuffer(),
    );
  } catch {
    return null;
  }
}

export default async function Image() {
  const [regular, bold] = await Promise.all([face(400), face(700)]);
  const fonts = [
    regular && { name: "Host", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Host", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter((f) => f !== null && f !== undefined);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "70px 80px",
          fontFamily: fonts.length ? "Host" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori only renders <img> */}
          <img src={STAR} width={66} height={66} alt="" />
          <div
            style={{
              display: "flex",
              marginLeft: 24,
              fontSize: 25,
              letterSpacing: "0.15em",
              color: "rgba(11,31,58,0.5)",
            }}
          >
            FIGURING IT OUT IN PUBLIC
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 124,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: INK,
            }}
          >
            Tobia Donadon
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 940,
              fontSize: 38,
              lineHeight: 1.32,
              color: "rgba(11,31,58,0.66)",
            }}
          >
            {CLAIM}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", width: 260, height: 7, background: CLAY }} />
          <div style={{ display: "flex", fontSize: 26, color: "rgba(11,31,58,0.45)" }}>
            {SITE_LABEL}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
