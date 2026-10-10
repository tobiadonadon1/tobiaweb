import type { Metadata } from "next";
import { Suspense } from "react";
import { BackLink } from "@/components/ui/back-link";
import { AccountForms } from "@/components/account/account-forms";

export const metadata: Metadata = {
  title: "Your account · Construct",
  description: "Sign in to Construct and take any free skill or guide in one click.",
  alternates: { canonical: "/projects/construct/account" },
  robots: { index: false },
};

/**
 * THE CONSTRUCT ACCOUNT: sign in, create one, or reset the password. One
 * column on paper, like the shelves it serves. The forms are a client
 * component (components/account/account-forms.tsx) because every step
 * answers in place.
 */
export default function AccountPage() {
  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[var(--ink)]">
      <BackLink href="/projects/construct" label="Construct" />
      <div className="mx-auto w-full max-w-[30rem] px-6 pb-28 pt-28 md:pt-36">
        <Suspense>
          <AccountForms />
        </Suspense>
      </div>
    </main>
  );
}
