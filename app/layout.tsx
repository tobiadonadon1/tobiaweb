import type { Metadata } from "next";
import { Caveat, Host_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SHARE_DESCRIPTION } from "@/lib/bio";
import { SITE } from "@/lib/site";

/**
 * ONE TYPEFACE, everywhere.
 *
 * The site used to run four families at once: Instrument Serif for display,
 * Geist for body, Geist Mono for the small uppercase labels, and a Helvetica
 * Neue system stack for the statement blocks. That is what Tobia meant by
 * "keep all of these fonts the same throughout all of the pages".
 *
 * Host Grotesk is the family. It was chosen by measuring, not by eye: the
 * shop sign he photographed has perfectly circular bowls, monoline strokes and
 * a SQUARE dot on the i, and a sweep of every Latin sans on Google Fonts by
 * contour fill ratio (1.000 = square dot, 0.785 = round) showed that almost no
 * geometric face pairs those two traits. Host Grotesk is a rework of Poppins
 * that swaps Poppins' round dots for square ones, so it inherits the circles
 * and adds the discriminating detail. Futura, Avenir, Montserrat and Poppins
 * itself were all ruled out on the dot.
 *
 * It is variable 300 to 800, and duplexed: the advance widths do not change
 * with weight, so a hover that thickens type causes zero layout shift.
 */
const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

/**
 * THE ONE EXCEPTION TO ONE TYPEFACE.
 *
 * Everything on this site is Host Grotesk, deliberately, and that rule is not
 * being relaxed. This face is not for typography: it is only ever used inside
 * the drawn annotations (components/ui/hand-note.tsx), which are scribbles in
 * the margin pointing at things. A scribble set in the same grotesk as the
 * headline reads as a caption, which is the opposite of the point. Nothing
 * that is part of the page's actual text is ever set in it.
 */
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Tobia Donadon, figuring it out in public";

/**
 * THE ROOT METADATA, WHICH EVERY OTHER PAGE INHERITS FROM.
 *
 * `metadataBase` is the WWW host, which is the one the site actually serves on:
 * the apex 308s to it. Every canonical, every Open Graph url and every sitemap
 * entry used to name the apex, so each one cost a redirect hop on every crawl.
 * See lib/site.ts.
 *
 * NO `images` HERE ON PURPOSE. app/opengraph-image.tsx generates the card, and
 * the file convention outranks anything set in this object. Listing a second
 * image here would only be a way for the two to disagree later.
 *
 * `robots.googleBot.max-image-preview: large` is the one directive on this
 * object that visibly changes anything: without it Google may show the page
 * with a thumbnail or with no image at all, rather than with the large preview
 * the card is drawn for.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s · Tobia Donadon" },
  description: SHARE_DESCRIPTION,
  applicationName: "Tobia Donadon",
  authors: [{ name: "Tobia Donadon", url: SITE }],
  creator: "Tobia Donadon",
  publisher: "Tobia Donadon",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: SHARE_DESCRIPTION,
    url: "/",
    siteName: "Tobia Donadon",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHARE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // globals.css sets `scroll-behavior: smooth` on <html>. Without this
      // attribute the router's scroll-to-top on a route change becomes a
      // SMOOTH scroll that is cancelled the moment the new page renders, so
      // every project page opened from a scrolled homepage landed near its
      // own bottom. The attribute tells Next to force `auto` for the duration
      // of a route transition, and hands smooth scrolling back afterwards.
      data-scroll-behavior="smooth"
      className={`${hostGrotesk.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteNav />
        {/* Opaque, above the footer, and reserving exactly the footer's height
            beneath itself. See `.site-content` in globals.css. */}
        <div className="site-content">{children}</div>
        <SiteFooter />
        <CustomCursor />
      </body>
    </html>
  );
}
