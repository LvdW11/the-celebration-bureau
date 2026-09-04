import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductGrid } from "@/components/ProductCard";
import { LockedContinuation } from "@/components/PartyBits";
import { useParty, usePlan } from "@/lib/party-store";
import { timelineMomentById, productsByIds, allActivities } from "@/lib/plan";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/timeline/$momentId")({
  head: () => ({
    meta: [
      { title: "Party Timeline — The Celebration Bureau" },
      { name: "description", content: "Step-by-step instructions, preparation and supplies for this moment of the party." },
      { property: "og:title", content: "Party Timeline — The Celebration Bureau" },
      { property: "og:description", content: "Instructions, preparation and supplies for this moment." },
    ],
  }),
  component: TimelineDetail,
  notFoundComponent: TimelineNotFound,
});

function TimelineNotFound() {
  return (
    <AppShell eyebrow="Timeline" title="Moment not found">
      <p className="text-sm text-muted-foreground">
        This moment isn't part of your party plan. Head back to the dashboard to see the full timeline.
      </p>
    </AppShell>
  );
}

function TimelineDetail() {
  const { momentId } = Route.useParams();
  const gate = useGate();
  const { details } = useParty();
  const { todos } = usePlan();
  const moment = timelineMomentById(details, momentId);
  if (!moment) throw notFound();

  const products = productsByIds(details, moment.productIds);
  const activity = moment.activityId ? allActivities.find((a) => a.id === moment.activityId) : undefined;
  const relatedTodos = todos.filter((t) => moment.todoIds.includes(t.id));

  // Locked: show the shape of the moment (first step, first prep items) but
  // not the complete workflow.
  const instructions = gate.limit(moment.instructions, 1);
  const hiddenSteps = gate.hidden(moment.instructions, 1);
  const prepare = gate.limit(moment.prepare, 2);
  const hiddenPrep = gate.hidden(moment.prepare, 2);
  const shownProducts = gate.limit(products, 2);
  const hiddenProducts = gate.hidden(products, 2);

  return (
    <AppShell
      eyebrow={`${moment.time} – ${moment.endTime} · ${moment.lengthMin} minutes`}
      title={moment.title}
      intro={moment.detail}
    >
      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">On the day</h2>
          <ol className="mt-4 space-y-3">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-lg text-gold">{i + 1}</span>
                <p className="text-[0.95rem] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          {hiddenSteps > 0 ? (
            <LockedContinuation
              compact
              title={`${hiddenSteps} more steps for this moment`}
              className="mt-5"
            >
              the minute-by-minute run of {moment.title.toLowerCase()}
            </LockedContinuation>
          ) : null}

          {activity ? (
            <p className="mt-6 text-sm text-muted-foreground">
              This moment uses{" "}
              <Link
                to="/activities/$activityId"
                params={{ activityId: activity.id }}
                className="text-gold underline-offset-4 hover:underline"
              >
                {activity.name}
              </Link>{" "}
              — full activity instructions are on its page.
            </p>
          ) : null}
        </section>

        <section>
          <h2 className="text-2xl">Preparation</h2>
          <ul className="mt-4 space-y-3">
            {prepare.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" />
                <p className="text-[0.95rem] leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
          {hiddenPrep > 0 ? (
            <LockedContinuation compact title={`${hiddenPrep} more preparation items`} className="mt-5">
              everything to set up beforehand
            </LockedContinuation>
          ) : null}

          {gate.unlocked && relatedTodos.length > 0 ? (
            <div className="mt-6">
              <p className="eyebrow">On your to-do list</p>
              <ul className="mt-3 space-y-2">
                {relatedTodos.map((t) => (
                  <li key={t.id} className="text-sm text-muted-foreground">
                    <Link to="/todo" className="text-gold underline-offset-4 hover:underline">
                      {t.task}
                    </Link>{" "}
                    · {t.due}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>

      {shownProducts.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl">What you'll need</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quantities are calculated for {details.guests} guests. Tap a product to shop it.
          </p>
          <ProductGrid products={shownProducts} className="mt-5" />
          {hiddenProducts > 0 ? (
            <LockedContinuation compact title={`${hiddenProducts} more items for this moment`} className="mt-5">
              with quantities and retailers
            </LockedContinuation>
          ) : null}
        </section>
      ) : null}
    </AppShell>
  );
}

