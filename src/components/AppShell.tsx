import type { ReactNode } from "react";
import { BackToParty } from "@/components/PartyBits";
import { SectionHeader, SectionTabBar } from "@/components/SectionNav";

export function AppShell({
  eyebrow,
  title,
  intro,
  action,
  hideBack,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  /** The party overview itself has nowhere to go back to. */
  hideBack?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SectionHeader />

      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        {hideBack ? null : <BackToParty className="mb-6" />}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
        {intro ? (
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
        {action ? <div className="mt-6">{action}</div> : null}
        <div className="mt-10">{children}</div>
      </main>

      <SectionTabBar />
    </div>
  );
}
