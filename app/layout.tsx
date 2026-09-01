import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { InkCursor } from "@/components/ui/ink-cursor";

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

const DESCRIPTION =
  "I'm Tobia: 20, building tools, writing a book about AI and consciousness, and helping people launch things. This is where I share what I'm working on, and figure it out in public.";

export const metadata: Metadata = {
  metadataBase: new URL("https://tobiadonadon.com"),
  title: {
    default: "Tobia Donadon, figuring it out in public",
    template: "%s · Tobia Donadon",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Tobia Donadon, figuring it out in public",
    description: DESCRIPTION,
    url: "/",
    siteName: "Tobia Donadon",
    type: "website",
    locale: "en_US",
    images: [{ url: "/trail/trail-07.jpg", width: 1000, height: 562, alt: "Tobia Donadon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tobia Donadon, figuring it out in public",
    description: DESCRIPTION,
    images: ["/trail/trail-07.jpg"],
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
      className={`${hostGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteNav />
        {/* Opaque, above the footer, and reserving exactly the footer's height
            beneath itself. See `.site-content` in globals.css. */}
        <div className="site-content">{children}</div>
        <SiteFooter />
        <InkCursor />
      </body>
    </html>
  );
}
