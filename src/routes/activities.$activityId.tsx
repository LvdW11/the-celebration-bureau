import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductGrid } from "@/components/ProductCard";
import { LockedContinuation } from "@/components/PartyBits";
import { useParty, usePlan } from "@/lib/party-store";
import { activityCost, money, productsByIds } from "@/lib/plan";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/activities/$activityId")({
  head: () => ({
    meta: [
      { title: "Activity — The Celebration Bureau" },
      { name: "description", content: "Full instructions, materials and preparation for this party activity." },
      { property: "og:title", content: "Activity — The Celebration Bureau" },
      { property: "og:description", content: "Instructions, materials and preparation for this activity." },
    ],
  }),
  component: ActivityDetail,
  notFoundComponent: ActivityNotFound,
});

function ActivityNotFound() {
  return (
    <AppShell eyebrow="Activities" title="Activity not found">
      <p className="text-sm text-muted-foreground">
        This activity isn't part of your party plan. Head back to the activities page to see what's planned.
      </p>
    </AppShell>
  );
}

function ActivityDetail() {
  const { activityId } = Route.useParams();
  const gate = useGate();
  const { details } = useParty();
  const { activities, timeline } = usePlan();
  const activity = activities.find((a) => a.id === activityId);
  if (!activity) throw notFound();

  const products = productsByIds(details, activity.productIds);
  const cost = activityCost(details, activity.productIds);
  const moment = timeline.find((m) => m.id === activity.timelineId);

  const materials = activity.materials(details.guests);
  const shownPrep = gate.limit(activity.preparation, 1);
  const hiddenPrep = gate.hidden(activity.preparation, 1);
  const shownMaterials = gate.limit(materials, 2);
  const hiddenMaterials = gate.hidden(materials, 2);


  return (
    <AppShell
      eyebrow={`Activity · ${activity.duration} · ${activity.effort}`}
      title={activity.name}
      intro={activity.summary}
    >
      <section className="surface p-6 md:p-8">
        <p className="eyebrow">What the children make</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed">{activity.making}</p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <span>Ages {activity.ageMin}–{activity.ageMax}</span>
          {moment ? (
            <span>
              Scheduled {moment.time} – {moment.endTime}
            </span>
          ) : null}
          {products.length > 0 ? <span>Supplies ≈ {money(cost)}</span> : <span>No supplies needed</span>}
        </div>
      </section>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">Preparation</h2>
          <ol className="mt-4 space-y-3">
            {shownPrep.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-lg text-gold">{i + 1}</span>
                <p className="text-[0.95rem] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          {hiddenPrep > 0 ? (
            <LockedContinuation compact title={`${hiddenPrep} more preparation steps`} className="mt-5">
              everything to make ready before the children arrive
            </LockedContinuation>
          ) : null}
        </section>

        <section>
          <h2 className="text-2xl">During the party</h2>
          {gate.locked ? (
            <>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                {activity.during.length} steps guide you through running this with {details.guests} children,
                followed by cleanup notes.
              </p>
              <LockedContinuation compact title="How to run it, and clean up after" className="mt-5">
                the full sequence and cleanup
              </LockedContinuation>
            </>
          ) : (
            <>
              <ol className="mt-4 space-y-3">
                {activity.during.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-display text-lg text-gold">{i + 1}</span>
                    <p className="text-[0.95rem] leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-2xl bg-secondary/50 p-5">
                <p className="eyebrow">Cleanup</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activity.cleanup}</p>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">Materials</h2>
        <p className="mt-2 text-sm text-muted-foreground">Exact quantities for {details.guests} guests.</p>
        <ul className="mt-4 space-y-3">
          {shownMaterials.map((m, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" />
              <p className="text-[0.95rem] leading-relaxed">{m}</p>
            </li>
          ))}
        </ul>
        {hiddenMaterials > 0 ? (
          <LockedContinuation compact title={`${hiddenMaterials} more materials, with quantities`} className="mt-5">
            scaled for {details.guests} children
          </LockedContinuation>
        ) : null}
      </section>

      {products.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl">Shop this activity</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tap a product to open it at the retailer.</p>
          <ProductGrid products={products} className="mt-5" />
        </section>
      ) : null}
    </AppShell>
  );
}

