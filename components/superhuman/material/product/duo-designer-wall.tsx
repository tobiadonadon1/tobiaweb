import Image from "next/image";

/**
 * THE WALL: apps the skill can make, around the hero.
 *
 * Ten screens designed by GPT from Tobia's reference shots (the skill's
 * own targets.md step), five for the outer display and five open, each in a
 * thin titanium frame drawn in CSS. Two rows drift in opposite directions
 * under the film (CSS only; they keep drifting under the cursor; still and
 * scrollable under reduced motion). On wide screens two closed phones float
 * beside the name. They are designs, not shipping apps: the alt text says so.
 */

type Shot = { src: string; alt: string; kind: "outer" | "inner" };

const S = (name: string) => `/shop/duo-designer/${name}`;

const OUTER: Shot[] = [
  { src: S("wall-weather-v1.webp"), alt: "Weather app design on the closed iPhone Duo: Lake Como at dusk, 17 degrees", kind: "outer" },
  { src: S("wall-boarding-v1.webp"), alt: "Travel wallet design on the closed iPhone Duo: a boarding pass, Milan to Lisbon", kind: "outer" },
  { src: S("wall-cook-v1.webp"), alt: "Cooking app design on the closed iPhone Duo: a sauce timer at 11:24", kind: "outer" },
  { src: S("wall-inbox-v1.webp"), alt: "Mail app design on the closed iPhone Duo: an inbox with four messages", kind: "outer" },
  { src: S("wall-run-v1.webp"), alt: "Running app design on the closed iPhone Duo: a 4:52 pace at kilometre 6", kind: "outer" },
];
const INNER: Shot[] = [
  { src: S("wall-reader-v1.webp"), alt: "Book reader design on the open iPhone Duo: a botanical plate beside chapter four", kind: "inner" },
  { src: S("wall-journal-v1.webp"), alt: "Photo journal design on the open iPhone Duo: a harvest dinner beside September's photos", kind: "inner" },
  { src: S("wall-music-v1.webp"), alt: "Music app design on the open iPhone Duo: an album cover beside a cassette player", kind: "inner" },
  { src: S("wall-travel-v1.webp"), alt: "Travel guide design on the open iPhone Duo: Santorini at sunset with the day's plan", kind: "inner" },
  { src: S("wall-pasta-v1.webp"), alt: "Recipe app design on the open iPhone Duo: pasta alla Norma beside its ingredients", kind: "inner" },
];

function Device({ shot, decorative = false }: { shot: Shot; decorative?: boolean }) {
  return (
    <span className={`dd-dev dd-dev--${shot.kind}`}>
      <Image
        src={shot.src}
        alt={decorative ? "" : shot.alt}
        width={shot.kind === "outer" ? 700 : 1100}
        height={shot.kind === "outer" ? 1018 : 774}
        sizes={shot.kind === "outer" ? "220px" : "460px"}
        className="dd-dev__screen"
      />
    </span>
  );
}

/** Two closed phones floating beside the name (wide screens only). */
export function DuoFloats() {
  return (
    <div aria-hidden className="dd-floats">
      <span className="dd-float dd-float--l">
        <Device shot={OUTER[0]} decorative />
      </span>
      <span className="dd-float dd-float--r">
        <Device shot={OUTER[1]} decorative />
      </span>
    </div>
  );
}

/** The two drifting rows. Each row is its content twice, for a seamless loop. */
export function DuoWall() {
  const rowA: Shot[] = [INNER[0], OUTER[2], INNER[1], OUTER[3], INNER[2]];
  const rowB: Shot[] = [OUTER[4], INNER[3], OUTER[0], INNER[4], OUTER[1]];
  return (
    <div className="dd-wall" role="group" aria-label="App designs the skill can make">
      {[rowA, rowB].map((row, r) => (
        <div key={r} className={`dd-wall__track ${r ? "dd-wall__track--rev" : ""}`}>
          {[0, 1].map((copy) => (
            <div key={copy} className="dd-wall__set" aria-hidden={copy === 1 || undefined}>
              {row.map((shot) => (
                <Device key={shot.src} shot={shot} decorative={copy === 1} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
