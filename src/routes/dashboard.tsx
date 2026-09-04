import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ActivityCard } from "@/components/ActivityCard";
import { PaletteProducts } from "@/components/PaletteProducts";
import { ProductStrip } from "@/components/ProductCard";
import { LockedContinuation, ProgressBar } from "@/components/PartyBits";
import { usePlan, useParty } from "@/lib/party-store";
import { money } from "@/lib/plan";
import { useGate } from "@/lib/gating";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Party Dashboard — The Celebration Bureau" },
      { name: "description", content: "Your princess party at a glance: timeline, progress and budget." },
      { property: "og:title", content: "Party Dashboard — The Celebration Bureau" },
      { property: "og:description", content: "Your whole party, in one calm view." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { details, timeline, activities, budget } = usePlan();
  const { progress } = useParty();
  const gate = useGate();
  const shownTimeline = gate.limit(timeline, 3);
  const hiddenMoments = gate.hidden(timeline, 3);
  // The dashboard is an overview: it always shows a taste, and only says what
  // is missing while the plan is locked.
  const shownActivities = activities.slice(0, 2);
  const shownProducts = gate.spread(budget.items, 3).slice(0, 3);
  const hiddenProducts = gate.hidden(budget.items, 3);



  const links = [
    { to: "/todo", label: "To do", detail: `${progress.total - progress.done} open tasks` },
    {
      to: "/shopping-list",
      label: "Shopping list",
      detail: `${budget.items.length} items · ${money(budget.total)}`,
    },
    { to: "/activities", label: "Activities", detail: `${activities.length} planned for age ${details.age}` },
    { to: "/food", label: "Food", detail: "Tea table menu & recipes" },
  ] as const;

  return (
    <AppShell
      eyebrow="Your party"
      title={`${details.childName} is turning ${details.age}`}
      intro={`${details.theme} · ${details.guests} children · ${details.venue.toLowerCase()} · $${details.budget} budget`}
      action={
        <Link to="/builder" className="text-sm text-gold underline-offset-4 hover:underline">
          Edit party details
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-6">
          <p className="eyebrow">When</p>
          <p className="mt-2 text-[0.95rem]">{details.date}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {timeline[0]?.time} · {details.durationHours} hours
          </p>
        </div>
        <div className="surface p-6">
          <ProgressBar />
          <p className="mt-3 text-sm text-muted-foreground">Updates as you tick tasks off.</p>
        </div>
        <div className="surface p-6">
          <p className="eyebrow">Budget</p>
          <p className="mt-2 font-display text-3xl">{money(budget.total)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {money(budget.remaining)} left of ${details.budget}
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">The afternoon</h2>
        <p className="mt-2 text-sm text-muted-foreground">Tap a moment for instructions, prep and what to buy.</p>
        <ol className="mt-5">
          {shownTimeline.map((t) => (
            <li key={t.id}>
              <Link
                to="/timeline/$momentId"
                params={{ momentId: t.id }}
                className="flex gap-5 border-b border-border/70 py-5 transition-colors hover:bg-secondary/40"
              >
                <span className="w-20 shrink-0 font-display text-lg text-gold">{t.time}</span>
                <span className="flex-1">
                  <span className="block text-[0.95rem]">{t.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t.detail}</span>
                </span>
                <span className="self-center text-gold">→</span>
              </Link>
            </li>
          ))}
        </ol>
        {hiddenMoments > 0 ? (
          <LockedContinuation
            compact
            title={`${hiddenMoments} more moments, through cake and farewell favors`}
            className="mt-6"
          >
            the complete running order with instructions and prep
          </LockedContinuation>
        ) : null}
      </section>

      <section className="mt-12">
        <PaletteProducts />
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl">Activities</h2>
          <Link to="/activities" className="text-sm text-gold underline-offset-4 hover:underline">
            See all {activities.length}
          </Link>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {shownActivities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl">From your shopping list</h2>
          <Link to="/shopping-list" className="text-sm text-gold underline-offset-4 hover:underline">
            {budget.items.length} items · {money(budget.total)}
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Researched, quantified for {details.guests} children and kept inside your ${details.budget} budget.
        </p>
        <ProductStrip products={shownProducts} className="mt-5" />
        {hiddenProducts > 0 ? (
          <LockedContinuation compact title={`${hiddenProducts} more items costed for you`} className="mt-5">
            with exact quantities, retailers and links
          </LockedContinuation>
        ) : null}
      </section>


      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="surface flex items-center justify-between p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
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
