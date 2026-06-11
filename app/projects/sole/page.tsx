import type { Metadata } from "next";
import { ProjectPageShell } from "@/components/ui/project-page";

export const metadata: Metadata = {
  title: "Sole — Tobia Donadon",
  description:
    "Hands-on help for people shipping their first things — positioning, product, and the push to press publish.",
};

export default function SolePage() {
  return (
    <ProjectPageShell
      eyebrow="Project · 02"
      status="open"
      title="Sole"
      lede="Hands-on help for people shipping their first real thing."
      sections={[
        {
          kicker: "The practice",
          heading: "Hands on, from idea to shipped",
          body: "Sole is the consulting side of my work: I help people launch their first things. Positioning, product decisions, the messy middle, and the final push to press publish — I'm in it with you, not advising from the sidelines.",
        },
        {
          kicker: "Working together",
          heading: "Small, close, and honest",
          body: "We start with a conversation about what you're making and where it's stuck. Then we work in short, focused stretches — real sessions, real decisions, things actually shipping in between. No decks, no retainers that outlive their usefulness.",
        },
        {
          kicker: "Who it's for",
          heading: "People with something almost real",
          body: "Founders and makers sitting on a first product, a first launch, a first anything — close enough to taste it, stuck enough to stall. If that sounds like you, the door is open. Write me and tell me what you're building.",
        },
      ]}
    />
  );
}
