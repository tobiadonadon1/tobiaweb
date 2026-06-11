import HeroSequence from "@/components/hero/HeroSequence";
import { StackedPhrases } from "@/components/sections/StackedPhrases";
import { RoadSoFar } from "@/components/sections/RoadSoFar";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ThoughtsSection } from "@/components/sections/ThoughtsSection";
import { AboutSection } from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <main className="bg-background text-[#0a0a0a]">
      <div id="home">
        <HeroSequence />
      </div>

      <StackedPhrases />

      <RoadSoFar />

      <ProjectsSection />

      <AboutSection />
      <ThoughtsSection />
    </main>
  );
}
