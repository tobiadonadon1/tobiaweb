/**
 * HOST GROTESK FOR THE SHARE CARDS.
 *
 * next/font serves woff2, which Satori (what renders ImageResponse) cannot
 * parse, and there is no ttf on disk. So the face is pulled from Google Fonts
 * at build time with an old User-Agent, which is what makes them serve
 * truetype, and a short timeout. If any of that fails this returns null and
 * the card renders in Satori's default face: a slightly off-brand share image
 * beats a failed build.
 *
 * Shared by the site's card (app/opengraph-image.tsx) and the shop's product
 * cards (app/shop/[product]/card), so both fail the same way.
 */
export async function hostGrotesk(weight: number): Promise<ArrayBuffer | null> {
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
