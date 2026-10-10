import { AccountChip } from "@/components/account/account-chip";

/** Every Construct page carries the way into the account (top right). */
export default function ConstructLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AccountChip />
    </>
  );
}
