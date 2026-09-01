import type { Metadata } from "next";
import HeroSequence from "@/components/hero/HeroSequence";
import { HeroStatement } from "@/components/sections/HeroStatement";
import { IdentityScroll } from "@/components/sections/IdentityScroll";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { WhyMeSection } from "@/components/sections/WhyMeSection";
import { ThoughtsDesktop } from "@/components/sections/ThoughtsDesktop";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Structured data for the homepage. Person + WebSite only: both are things
 * that genuinely exist and can be stated without inventing anything. No
 * ratings, no counts, no dates that are not real.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://tobiadonadon.com/#tobia",
      name: "Tobia Donadon",
      url: "https://tobiadonadon.com",
      image: "https://tobiadonadon.com/trail/trail-07.jpg",
      jobTitle: "Builder and writer",
      description:
        "Builds tools, writes about consciousness, and helps people launch things.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": "https://tobiadonadon.com/#site",
      url: "https://tobiadonadon.com",
      name: "Tobia Donadon",
      publisher: { "@id": "https://tobiadonadon.com/#tobia" },
      inLanguage: "en",
    },
  ],
};

/**
 * The funnel, top to bottom: the hero lands the name over the photo
 * loader, the statement states the stance, the identity cards say who,
 * the Projects open the sellable doors, Why Me answers "but why you", and
 * Thoughts is the "watch me think" tail.
 * SiteFooter is global (in app/layout.tsx).
 */
export default function Home() {
  return (
    <main className="bg-background text-[#0a0a0a]">
      <script
        type="application/ld+json"
        // Static, author-controlled object. No user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div id="home">
        <HeroSequence />
      </div>

      <HeroStatement />

      <IdentityScroll />

      <ProjectsSection />

      <WhyMeSection />

      <ThoughtsDesktop />
    </main>
  );
}
