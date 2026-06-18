import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { InkCursor } from "@/components/ui/ink-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteNav />
        {children}
        <SiteFooter />
        <InkCursor />
      </body>
    </html>
  );
}
