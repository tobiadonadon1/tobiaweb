import type { Metadata } from "next";
import { BackLink } from "@/components/ui/back-link";
import { MasterclassPage } from "@/components/masterclass/masterclass-page";

export const metadata: Metadata = {
  title: "Masterclass · Construct",
  description: "In-depth lessons, 10 to 20 minutes each, on building, designing, launching and selling your first product. Never on YouTube. For Construct Pro and Ultimate.",
  alternates: { canonical: "/projects/construct/masterclass" },
};

/**
 * THE MASTERCLASS (the shelf's Masterclass family), laid out like a YouTube
 * channel on Construct's paper. Members only: proxy.ts sends anyone without
 * an account to sign in first. The page is a client component
 * (components/masterclass/masterclass-page.tsx) because a member's lessons
 * come from the plan check.
 */
export default function Masterclass() {
  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[#0a0a0a]">
      <BackLink href="/projects/construct" label="Construct" />
      <MasterclassPage />
    </main>
  );
}
