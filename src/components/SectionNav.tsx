import { Link } from "@tanstack/react-router";
import { CalendarHeart, CheckCircle2, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";

export const sections = [
  { to: "/dashboard", label: "Party", icon: CalendarHeart },
  { to: "/todo", label: "To do", icon: CheckCircle2 },
  { to: "/shopping-list", label: "Shopping", icon: ShoppingBag },
  { to: "/activities", label: "Activities", icon: Sparkles },
  { to: "/food", label: "Food", icon: UtensilsCrossed },
] as const;

/** Desktop header: wordmark + the five party sections. Used on every party page. */
export function SectionHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="border-b border-border/70 bg-ivory/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link to="/" className="font-display text-lg tracking-tight">
          The Celebration Bureau
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {sections.map((item) => (
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
        {right ? <div className="text-sm text-muted-foreground">{right}</div> : null}
      </div>
    </header>
  );
}

/** Mobile bottom tab bar. */
export function SectionTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-ivory/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {sections.map((item) => (
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
  );
}
