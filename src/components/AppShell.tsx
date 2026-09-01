import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CalendarHeart, CheckCircle2, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Party", icon: CalendarHeart },
  { to: "/todo", label: "To do", icon: CheckCircle2 },
  { to: "/shopping-list", label: "Shopping", icon: ShoppingBag },
  { to: "/activities", label: "Activities", icon: Sparkles },
  { to: "/food", label: "Food", icon: UtensilsCrossed },
] as const;

export function AppShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="border-b border-border/70 bg-ivory/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link to="/" className="font-display text-lg tracking-tight">
            The Celebration Bureau
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
        {intro ? (
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
        <div className="mt-10">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-ivory/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 py-3 text-[0.65rem] tracking-wide text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <item.icon className="size-[1.15rem]" strokeWidth={1.4} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
