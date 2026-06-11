import type { Metadata } from "next";
import { ProjectPageShell } from "@/components/ui/project-page";

export const metadata: Metadata = {
  title: "Superhuman — Tobia Donadon",
  description:
    "A guided journey of small, deliberate practices that compound into superhuman abilities. Not a course — a journey you take.",
};

export default function SuperhumanPage() {
  return (
    <ProjectPageShell
      eyebrow="Project · 03"
      status="becoming"
      title="Superhuman"
      lede="A guided journey that compounds, practice by practice, into superhuman abilities."
      sections={[
        {
          kicker: "The premise",
          heading: "Abilities that compound",
          body: "Superhuman starts from a simple observation: with the tools we suddenly have, an ordinary person who practices deliberately can do things that looked impossible five years ago. The journey is built around that compounding — small daily practices that stack into abilities that feel, honestly, a little superhuman.",
        },
        {
          kicker: "Not a course",
          heading: "I don't sell courses",
          body: "A course is something you watch. This is a journey you take — with stages, with effort, with someone walking alongside you. You don't finish it with a certificate; you finish it different. That distinction matters to me more than almost anything on this site.",
        },
        {
          kicker: "The path",
          heading: "Still becoming",
          body: "The path is taking shape in stages: foundations first, then leverage, then the strange territory where the new abilities stop feeling borrowed. I'm walking it myself before I ask anyone else to. When the first stretch is ready, this page is where it opens.",
        },
      ]}
    />
  );
}
