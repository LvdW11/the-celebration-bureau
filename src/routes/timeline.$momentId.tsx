import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductGrid } from "@/components/ProductCard";
import { useParty, usePlan } from "@/lib/party-store";
import { timelineMomentById, productsByIds, allActivities } from "@/lib/plan";

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
  const { details } = useParty();
  const { todos } = usePlan();
  const moment = timelineMomentById(details, momentId);
  if (!moment) throw notFound();

  const products = productsByIds(details, moment.productIds);
  const activity = moment.activityId ? allActivities.find((a) => a.id === moment.activityId) : undefined;
  const relatedTodos = todos.filter((t) => moment.todoIds.includes(t.id));

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
            {moment.instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-lg text-gold">{i + 1}</span>
                <p className="text-[0.95rem] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>

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
            {moment.prepare.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" />
                <p className="text-[0.95rem] leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>

          {relatedTodos.length > 0 ? (
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

      {products.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl">What you'll need</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quantities are calculated for {details.guests} guests. Tap a product to shop it.
          </p>
          <ProductGrid products={products} className="mt-5" />
        </section>
      ) : null}
    </AppShell>
  );
}
