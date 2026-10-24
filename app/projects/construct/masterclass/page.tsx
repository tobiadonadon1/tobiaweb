import type { Metadata } from "next";
import { BackLink } from "@/components/ui/back-link";
import { MasterclassPage } from "@/components/masterclass/masterclass-page";

export const metadata: Metadata = {
  title: "Masterclass · Construct",
  description: "In-depth lessons, 10 to 20 minutes each, on building, designing, launching and selling your first product. Never on YouTube. For Construct Pro and Ultimate.",
  alternates: { canonical: "/projects/construct/masterclass" },
};

/**
 * THE MASTERCLASS (the shelf's Masterclass family), a room of its own like
 * Design: dark, because these are films. The page is a client component
 * (components/masterclass/masterclass-page.tsx) because what it shows a
 * member, their lessons, comes from the plan check.
 */
export default function Masterclass() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#07111f] text-white">
      <BackLink href="/projects/construct" label="Construct" tone="ink" />
      <MasterclassPage />
    </main>
  );
}
