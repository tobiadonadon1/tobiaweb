import HeroSequence from "@/components/hero/HeroSequence";
import { StackedPhrases } from "@/components/sections/StackedPhrases";
import { RoadSoFar } from "@/components/sections/RoadSoFar";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ThoughtsSection } from "@/components/sections/ThoughtsSection";

/**
 * The funnel, top to bottom: the hero states the stance, the identity
 * cards say who, the Road maps the compounding story, the Projects open
 * the sellable doors, and Thoughts is the "watch me think" tail.
 * SiteFooter is global (in app/layout.tsx).
 */
export default function Home() {
  return (
    <main className="bg-background text-[#0a0a0a]">
      <div id="home">
        <HeroSequence />
      </div>

      <StackedPhrases />

      <RoadSoFar />

      <ProjectsSection />

      <ThoughtsSection />
    </main>
  );
}
