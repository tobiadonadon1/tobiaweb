import { ImageResponse } from "next/og";
import { createElement, type CSSProperties, type ReactNode } from "react";
import { hostGrotesk } from "@/lib/og-font";
import { SITE_LABEL } from "@/lib/site";
import type { PaidTier } from "./tiers";

/**
 * THE MEMBER CARD AT THE TOP OF THE WELCOME EMAIL.
 *
 * A membership card with the new member's name on it, drawn as a PNG when the
 * email is sent and carried inside the email (an inline attachment), so it
 * shows without the mail app asking to load images from a server.
 *
 * Pro is the join page's lit ember (components/membership/pro-pitch.css),
 * with a light passing over it and three rings. Ultimate is a step up:
 * midnight blue with a gold rim, a gold plan badge with the crown, and an
 * engraved rosette, the guilloché of a banknote. Universal wears Ultimate's.
 *
 * Plain createElement rather than JSX, so scripts/welcome.mjs and the tests
 * can render it under Node without a bundler.
 */

/** Drawn at twice the size the email shows it (560 wide), for sharp screens. */
export const CARD_WIDTH = 1120;
export const CARD_HEIGHT = 720;

const PAPER = "#faf8f2";

type Look = {
  ground: string;
  glow: string;
  ink: string;
  soft: string;
  rim: string;
  sheen: string;
  shadow: string;
  /** The plan badge: its fill, its letters, its edge. */
  badge: { fill: string; ink: string; edge: string };
  /** The lines engraved into the card, as SVG drawn on its 960 x 600. */
  engraving: string;
};

const circle = (cx: number, cy: number, r: number, stroke: string, width = 2) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`;

/** A guilloché rosette: one circle turned around a centre, many times. */
function rosette(cx: number, cy: number, r: number, turns: number, stroke: string) {
  return Array.from({ length: turns }, (_, i) => {
    const a = (i / turns) * Math.PI * 2;
    return circle(+(cx + Math.cos(a) * r * 0.55).toFixed(1), +(cy + Math.sin(a) * r * 0.55).toFixed(1), r, stroke, 1.1);
  }).join("");
}

const CROWN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 30 24"><path d="M2 6l6.5 6L15 2l6.5 10L28 6l-2.6 14H4.6z" fill="#13204f"/><rect x="4.6" y="21" width="20.8" height="2.4" rx="1.2" fill="#13204f"/></svg>';

const LOOKS: Record<"pro" | "ultimate", Look> = {
  pro: {
    ground: "linear-gradient(160deg, #f6936a 0%, #e05a34 45%, #b5341f 80%, #93281a 100%)",
    glow: "radial-gradient(120% 140% at 50% -40%, rgba(255,214,180,0.6), rgba(255,214,180,0) 55%)",
    ink: "#ffffff",
    soft: "rgba(255,246,238,0.78)",
    rim: "rgba(255,255,255,0.32)",
    sheen: "linear-gradient(105deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 65%)",
    shadow: "0 40px 70px -28px rgba(147,40,26,0.55)",
    badge: { fill: "rgba(255,255,255,0.14)", ink: "#ffffff", edge: "rgba(255,255,255,0.32)" },
    engraving: [260, 190, 120].map((r) => circle(850, 90, r, "rgba(255,236,220,0.16)")).join(""),
  },
  ultimate: {
    ground: "linear-gradient(155deg, #2a3f86 0%, #14235c 38%, #0a1236 72%, #111d4d 100%)",
    glow: "radial-gradient(110% 120% at 20% -30%, rgba(150,180,255,0.42), rgba(150,180,255,0) 55%)",
    ink: "#f5e3b3",
    soft: "rgba(226,232,255,0.72)",
    rim: "#d9b469",
    sheen: "linear-gradient(105deg, rgba(255,255,255,0) 38%, rgba(214,226,255,0.2) 50%, rgba(255,255,255,0) 62%)",
    shadow: "0 44px 80px -28px rgba(10,18,54,0.75)",
    badge: { fill: "linear-gradient(180deg, #fff3cf 0%, #e9c46f 55%, #c4923a 100%)", ink: "#13204f", edge: "#f3d792" },
    engraving:
      rosette(800, 150, 170, 40, "rgba(233,196,111,0.17)") +
      circle(800, 150, 268, "rgba(233,196,111,0.22)", 1.4) +
      circle(800, 150, 276, "rgba(233,196,111,0.12)", 1),
  },
};

const h = (tag: string, style: CSSProperties, ...children: ReactNode[]) =>
  createElement(tag, { style: { display: "flex", ...style } }, ...children);

/** The name sized to the card: long names step down, and a very long one gives way to the first name. */
function nameLine(full: string | null, first: string | null) {
  if (!full) return { text: null, size: 0 };
  if (full.length <= 16) return { text: full, size: 92 };
  if (full.length <= 24) return { text: full, size: 68 };
  return { text: first ?? full.slice(0, 24), size: 80 };
}

export async function memberCard({
  tier,
  name,
  first,
  since,
}: {
  tier: PaidTier;
  /** The full name as it should print, or null for a card without one. */
  name: string | null;
  first: string | null;
  /** "October 2026". */
  since: string;
}): Promise<Buffer> {
  const look = LOOKS[tier === "pro" ? "pro" : "ultimate"];
  const plan = tier === "pro" ? "PRO" : tier === "ultimate" ? "ULTIMATE" : "UNIVERSAL";
  const line = nameLine(name, first);

  const [regular, medium, bold] = await Promise.all([hostGrotesk(400), hostGrotesk(500), hostGrotesk(600)]);
  const fonts = [
    regular && { name: "Host", data: regular, weight: 400 as const, style: "normal" as const },
    medium && { name: "Host", data: medium, weight: 500 as const, style: "normal" as const },
    bold && { name: "Host", data: bold, weight: 600 as const, style: "normal" as const },
  ].filter((f) => f !== null && f !== undefined);

  // The engraving, drawn as one SVG: the renderer does not clip a card's
  // absolute children to its rounded corners, and an SVG clips itself.
  const engraving = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">${look.engraving}</svg>`;

  const card = h(
    "div",
    {
      position: "relative",
      width: 960,
      height: 600,
      borderRadius: 44,
      overflow: "hidden",
      backgroundImage: look.ground,
      border: `2px solid ${look.rim}`,
      boxShadow: look.shadow,
      color: look.ink,
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "56px 64px",
    },
    // light from above, the engraving, the light passing over it
    h("div", { position: "absolute", left: 0, top: 0, width: 960, height: 600, backgroundImage: look.glow }),
    createElement("img", {
      src: `data:image/svg+xml;utf8,${encodeURIComponent(engraving)}`,
      width: 960,
      height: 600,
      style: { position: "absolute", left: 0, top: 0 },
    }),
    h("div", { position: "absolute", left: -200, top: 0, width: 1360, height: 600, backgroundImage: look.sheen }),

    // top: the house, and the plan
    h(
      "div",
      { position: "relative", justifyContent: "space-between", alignItems: "center", width: "100%" },
      h("div", { fontSize: 30, fontWeight: 500, letterSpacing: "0.26em", color: look.soft }, "CONSTRUCT"),
      h(
        "div",
        {
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "0.22em",
          padding: "14px 24px 14px 28px",
          alignItems: "center",
          gap: 12,
          borderRadius: 999,
          border: `2px solid ${look.badge.edge}`,
          ...(look.badge.fill.startsWith("linear") ? { backgroundImage: look.badge.fill } : { backgroundColor: look.badge.fill }),
          color: look.badge.ink,
        },
        tier === "pro" ? null : createElement("img", { src: `data:image/svg+xml;utf8,${encodeURIComponent(CROWN)}`, width: 30, height: 24 }),
        plan,
      ),
    ),

    // bottom: the member
    h(
      "div",
      { position: "relative", flexDirection: "column", width: "100%" },
      line.text
        ? h("div", { fontSize: line.size, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }, line.text)
        : h("div", { fontSize: 92, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }, tier === "pro" ? "Pro" : plan[0] + plan.slice(1).toLowerCase()),
      h(
        "div",
        { justifyContent: "space-between", alignItems: "flex-end", width: "100%", marginTop: 30, fontSize: 30, color: look.soft },
        h("div", {}, `Member since ${since}`),
        h("div", { letterSpacing: "0.04em" }, SITE_LABEL),
      ),
    ),
  );

  const image = new ImageResponse(
    h(
      "div",
      {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PAPER,
        fontFamily: fonts.length ? "Host" : "sans-serif",
      },
      card,
    ),
    // An empty list would switch off the renderer's own face too.
    { width: CARD_WIDTH, height: CARD_HEIGHT, ...(fonts.length ? { fonts } : {}) },
  );
  return Buffer.from(await image.arrayBuffer());
}
