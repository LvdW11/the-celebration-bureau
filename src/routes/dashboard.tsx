import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { party, timeline, todos } from "@/lib/party";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Party Dashboard — The Celebration Bureau" },
      { name: "description", content: "Emma's princess party at a glance: timeline, progress and budget." },
      { property: "og:title", content: "Party Dashboard — The Celebration Bureau" },
      { property: "og:description", content: "Your whole party, in one calm view." },
    ],
  }),
  component: Dashboard,
});

const links = [
  { to: "/todo", label: "To do", detail: "5 open tasks" },
  { to: "/shopping-list", label: "Shopping list", detail: "18 items · $265" },
  { to: "/activities", label: "Activities", detail: "4 planned" },
  { to: "/food", label: "Food", detail: "Tea table menu" },
] as const;

function Dashboard() {
  const done = todos.filter((t) => t.done).length;

  return (
    <AppShell
      eyebrow="Your party"
      title={`${party.childName} is turning ${party.age}`}
      intro={`${party.theme} · ${party.guests} children · ${party.venue.toLowerCase()} · $${party.budget} budget`}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-6">
          <p className="eyebrow">When</p>
          <p className="mt-2 text-[0.95rem]">{party.date}</p>
          <p className="mt-1 text-sm text-muted-foreground">{party.duration}</p>
        </div>
        <div className="surface p-6">
          <p className="eyebrow">Progress</p>
          <p className="mt-2 font-display text-3xl">
            {done}
            <span className="text-muted-foreground">/{todos.length}</span>
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-full rounded-full bg-sage" style={{ width: `${(done / todos.length) * 100}%` }} />
          </div>
        </div>
        <div className="surface p-6">
          <p className="eyebrow">Budget</p>
          <p className="mt-2 font-display text-3xl">$265</p>
          <p className="mt-1 text-sm text-muted-foreground">Planned of ${party.budget} + cake</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">The afternoon</h2>
        <ol className="mt-5">
          {timeline.map((t) => (
            <li key={t.time} className="flex gap-5 border-b border-border/70 py-5">
              <span className="w-14 shrink-0 font-display text-lg text-gold">{t.time}</span>
              <div>
                <p className="text-[0.95rem]">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="surface flex items-center justify-between p-6 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <span>
              <span className="block text-[0.95rem]">{l.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{l.detail}</span>
            </span>
            <span className="text-gold">→</span>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
