import HeroSequence from "@/components/hero/HeroSequence";
import { StackedPhrases } from "@/components/sections/StackedPhrases";

function PlaceholderSection({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      className="flex min-h-screen flex-col items-center justify-center gap-3 border-t border-black/5 bg-white px-6 text-center"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/30">
        {label}
      </span>
      <p className="max-w-md font-serif text-2xl italic text-black/35 md:text-3xl">
        Coming next.
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <div id="home">
        <HeroSequence />
      </div>

      <StackedPhrases />

      <PlaceholderSection id="products" label="Info Products" />
      <PlaceholderSection id="book" label="The Book" />
      <PlaceholderSection id="agency" label="The Agency" />
      <PlaceholderSection id="about" label="About Tobi" />
      <PlaceholderSection id="journal" label="Journal" />
    </main>
  );
}
