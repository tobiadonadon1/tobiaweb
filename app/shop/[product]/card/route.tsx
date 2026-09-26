import { ImageResponse } from "next/og";
import { flatSpecimenSvg } from "@/components/superhuman/material/specimen-svg";
import { hostGrotesk } from "@/lib/og-font";
import { PRODUCTS, priceText, productById } from "@/lib/shop/products";
import { SITE_LABEL } from "@/lib/site";

/**
 * GET /shop/[product]/card — a product's share card, 1200 x 630.
 *
 * The product page is where posts point, so this card is the first thing most
 * people ever see of it: in a timeline, before anybody has clicked. It carries
 * the whole pitch at a glance: the mark, the name, one line, the proof and the
 * price. Same paper, ink and clay as the site's own card, so the two read as
 * the same house.
 *
 * A route rather than an `opengraph-image` file, because that convention
 * would apply to every piece under the entry segment. This card belongs to
 * products only, and the product page's metadata points at it by URL.
 * Generated once at build for every product.
 */

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((product) => ({ product }));
}

const PAPER = "#faf8f2";
const INK = "#0b1f3a";
const CLAY = "#ce4631";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ product: string }> },
) {
  const product = productById((await params).product);
  if (!product) return new Response("Not found", { status: 404 });

  const [regular, medium] = await Promise.all([hostGrotesk(400), hostGrotesk(500)]);
  const fonts = [
    regular && { name: "Host", data: regular, weight: 400 as const, style: "normal" as const },
    medium && { name: "Host", data: medium, weight: 500 as const, style: "normal" as const },
  ].filter((f) => f !== null && f !== undefined);

  const svg = flatSpecimenSvg(product.id);
  const mark = svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: "64px 72px",
          fontFamily: fonts.length ? "Host" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.14em",
              color: "rgba(11,31,58,0.55)",
            }}
          >
            {product.share.kicker.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                // Longer names step down so the name always stays on one line.
                fontSize: product.name.length > 13 ? 84 : 104,
                whiteSpace: "nowrap",
                fontWeight: 400,
                letterSpacing: "-0.045em",
                lineHeight: 0.95,
                color: INK,
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                maxWidth: 680,
                fontSize: 36,
                lineHeight: 1.3,
                color: "rgba(11,31,58,0.7)",
              }}
            >
              {product.share.line}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 64,
                padding: "0 30px",
                borderRadius: 999,
                background: "#b93a26",
                color: PAPER,
                fontSize: 28,
                fontWeight: 500,
              }}
            >
              {priceText(product)}
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 26,
                fontSize: 25,
                letterSpacing: "0.02em",
                color: "rgba(11,31,58,0.6)",
              }}
            >
              {product.share.proof}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: 320,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori only renders <img> */}
          {mark ? <img src={mark} width={320} height={264} alt="" style={{ marginTop: 10 }} /> : <div />}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", width: 90, height: 6, background: CLAY, marginRight: 20 }} />
            <div style={{ display: "flex", fontSize: 24, color: "rgba(11,31,58,0.5)" }}>
              {SITE_LABEL}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: fonts.length ? fonts : undefined },
  );
}
