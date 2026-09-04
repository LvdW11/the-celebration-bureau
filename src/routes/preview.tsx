import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import previewCover from "@/assets/preview-cover.jpg";
import { SectionHeader, SectionTabBar } from "@/components/SectionNav";
import { PaletteProducts } from "@/components/PaletteProducts";
import { ActivityCard } from "@/components/ActivityCard";
import { LockedContinuation } from "@/components/PartyBits";
import { ProductStrip } from "@/components/ProductCard";
import { usePlan } from "@/lib/party-store";
import { money } from "@/lib/plan";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Your Free Party Preview — The Celebration Bureau" },
      {
        name: "description",
        content: "A first look at your elegant magical princess party: theme, timeline and budget.",
      },
      { property: "og:title", content: "Your Free Party Preview — The Celebration Bureau" },
      { property: "og:description", content: "A first look at the plan, free before you unlock it." },
    ],
  }),
  component: Preview,
});

function Preview() {
  const { details, timeline, activities, budget, todos, menu } = usePlan();
  const gate = useGate();

  const shownTimeline = timeline.slice(0, 3);
  const hiddenMoments = gate.hidden(timeline, 3);
  const shownProducts = gate.spread(budget.items, 3).slice(0, 3);
  const previewActivities = gate.unlocked ? activities : activities.slice(0, 1);
  const previewMenu = menu.slice(0, 4);

  const locked = [
    {
      title: `The complete ${timeline.length}-moment timeline`,
      body: `Every moment from ${timeline[0]?.time} to the last farewell, with instructions and preparation.`,
    },
    {
      title: `All ${budget.items.length} shopping items`,
      body: `Exact quantities for ${details.guests} children, ${money(budget.total)} inside your $${details.budget} budget.`,
    },
    {
      title: `${activities.length} activities, run step by step`,
      body: "Preparation, what to say during each activity, materials and cleanup.",
    },
    {
      title: `${menu.length} recipes and the ${todos.length}-task schedule`,
      body: "Scaled ingredients, make-ahead timings and week-by-week preparation.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SectionHeader
        right={
          <Link to="/builder" className="hover:text-foreground">
            Edit details
          </Link>
        }
      />

      <main className="mx-auto max-w-4xl px-5 py-10 pb-24 md:px-8 md:py-14">
        <p className="eyebrow">Free preview</p>
        <h1 className="mt-3 text-4xl md:text-5xl">
          {details.childName}'s {details.theme.toLowerCase()} party
        </h1>
        <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
          Turning {details.age} · {details.guests} children · {details.venue.toLowerCase()} · ${details.budget} budget ·{" "}
          {details.diy.toLowerCase()} DIY
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          You can change these details anytime — your plan will adjust.{" "}
          <Link to="/builder" className="text-gold underline-offset-4 hover:underline">
            Edit details
          </Link>
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl">
          <img
            src={previewCover}
            alt="Gold crown, sage ribbon and printed invitation styled on warm linen"
            width={1200}
            height={912}
            className="h-56 w-full object-cover md:h-80"
          />
        </div>

        <div className="mt-12">
          <PaletteProducts />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl">The afternoon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {details.date} · tap a moment to see how it runs.
          </p>
          <ol className="mt-6 space-y-0">
            {shownTimeline.map((t) => (
              <li key={t.id}>
                <Link
                  to="/timeline/$momentId"
                  params={{ momentId: t.id }}
                  className="flex gap-5 border-b border-border/70 py-5 transition-colors hover:bg-secondary/40"
                >
                  <span className="w-14 shrink-0 font-display text-lg text-gold">{t.time}</span>
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
            <p className="mt-4 text-sm text-muted-foreground">
              {hiddenMoments} more moments follow, through cake and farewell favors. Unlock the full
              plan to see the complete afternoon schedule.
            </p>
          ) : null}
        </section>

        {previewActivities.length > 0 ? (
          <section className="mt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl">{gate.locked ? "One of your activities, in full" : "Your activities"}</h2>
              <Link to="/activities" className="text-sm text-gold underline-offset-4 hover:underline">
                {gate.locked ? "More activity ideas" : `See all ${activities.length}`}
              </Link>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {previewActivities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
            {gate.locked && activities.length > 1 ? (
              <LockedContinuation title="More activity ideas" className="mt-6" compact>
                unlock the remaining {activities.length - 1} activities, with complete instructions,
                materials and shopping
              </LockedContinuation>
            ) : null}
          </section>
        ) : null}

        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl">We did the shopping research for you</h2>
            <Link to="/shopping-list" className="text-sm text-gold underline-offset-4 hover:underline">
              {budget.items.length} items · {money(budget.total)}
            </Link>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We've already compared the party supplies and calculated exactly what you need for{" "}
            {details.guests} children, so you don't have to spend hours searching through different
            websites. {money(budget.remaining)} remains in your budget.
          </p>
          <ProductStrip products={shownProducts} className="mt-5" />
        </section>

        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl">Your Party Menu</h2>
            <Link to="/food" className="text-sm text-gold underline-offset-4 hover:underline">
              {gate.locked ? "Menu preview" : "See the menu"}
            </Link>
          </div>
          <ul className="surface mt-5 divide-y divide-border/70 overflow-hidden">
            {previewMenu.map((r, i) => {
              const open = gate.unlocked || i === 0;
              if (open) {
                return (
                  <li key={r.id}>
                    <Link
                      to="/recipes/$recipeId"
                      params={{ recipeId: r.id }}
                      className="flex items-baseline justify-between gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 md:px-7"
                    >
                      <span className="text-[0.95rem]">{r.name}</span>
                      <span className="eyebrow shrink-0">{r.yield(details)}</span>
                      <span className="text-gold">→</span>
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={r.id}
                  className="flex items-baseline justify-between gap-4 px-5 py-4 md:px-7"
                  aria-hidden
                >
                  <span className="select-none text-[0.95rem] blur-[3px]">{r.name}</span>
                  <Lock className="size-3.5 shrink-0 self-center text-gold" strokeWidth={1.5} />
                </li>
              );
            })}
          </ul>
          {gate.locked ? (
            <LockedContinuation title="The rest of your menu" className="mt-6" compact>
              {menu.length - 1} more recipes with scaled ingredients, method and make-ahead timings
            </LockedContinuation>
          ) : null}
        </section>

        <section className="mt-14 rounded-3xl border border-border bg-secondary/50 p-6 md:p-10">
          <p className="eyebrow">Unlock the full plan</p>
          <h2 className="mt-3 text-3xl">Everything else, ready to follow</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {locked.map((l) => (
              <div key={l.title} className="flex gap-3 rounded-2xl bg-card/70 p-5">
                <Lock className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <p className="text-[0.95rem]">{l.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/checkout"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Unlock the full party — $29
          </Link>
        </section>
      </main>

      <SectionTabBar />
    </div>
  );
}
