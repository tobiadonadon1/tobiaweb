import type { Metadata } from "next";
import { ProjectPageShell } from "@/components/ui/project-page";

export const metadata: Metadata = {
  title: "The Book — Tobia Donadon",
  description:
    "A long-form attempt to make sense of AI, consciousness, and what we become next — written slowly, and in public.",
};

export default function BookPage() {
  return (
    <ProjectPageShell
      eyebrow="Project · 01"
      status="in motion"
      title="The Book"
      lede="A long book about minds — the ones we are building, and the ones we already are."
      sections={[
        {
          kicker: "What it is",
          heading: "Long-form, on purpose",
          body: "A book about artificial intelligence, consciousness, and what we become when the two start to blur. Not a hot take, not a manifesto — a slow attempt to think clearly about the strangest decade any of us will live through. I'm writing it because I couldn't find the book I wanted to read.",
        },
        {
          kicker: "How it's written",
          heading: "Slowly, and in public",
          body: "Chapters and the notes behind them will appear here as they're written — first drafts included. Writing in public keeps me honest: you'll watch the ideas change as I do. Some of it will be wrong on arrival, and that's part of the method.",
        },
        {
          kicker: "Where it's going",
          heading: "Toward an honest ending",
          body: "I don't know how it ends yet, and I'd be suspicious of anyone who claims to. The plan is simple: keep reading, keep writing, follow the questions that won't leave me alone. When it's done, it will be done — not before.",
        },
      ]}
    />
  );
}
