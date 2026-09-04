import { createFileRoute, notFound } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductGrid } from "@/components/ProductCard";
import { LockedContinuation } from "@/components/PartyBits";
import { useParty, usePlan } from "@/lib/party-store";
import { money, productsByIds } from "@/lib/plan";
import { activityCost } from "@/lib/engine";
import { notableEquipment } from "@/lib/equipment";
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
  const { activities, selected, timeline } = usePlan();
  const index = activities.findIndex((a) => a.id === activityId);
  const activity = activities[index];
  if (!activity) throw notFound();
  // Free preview covers the first activity as a complete worked example; the
  // others stay behind the same unlock as the rest of the plan.
  const previewOnly = gate.locked && index > 0;

  // The plan may have simplified this activity to fit the budget, so the
  // detail page shows the version that is actually planned.
  const chosen = selected.find((s) => s.activity.id === activityId);
  const planned = chosen ? [...chosen.requiredIds, ...chosen.optionalIds] : activity.productIds;
  const products = productsByIds(details, planned);
  const cost = chosen ? chosen.cost : activityCost(details, planned);
  const kit = notableEquipment(activity.equipment);
  const moment = timeline.find((m) => m.id === activity.timelineId);

  const materials = activity.materials(details.guests);


  if (previewOnly) {
    return (
      <AppShell
        eyebrow={`Activity · ${activity.duration} · ${activity.effort}`}
        title={activity.name}
        intro={activity.summary}
      >
        <section className="surface p-6 md:p-8">
          <p className="eyebrow">What the children make</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed">{activity.making}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            This one is part of your full plan. Your free preview covers the first two activities in
            detail.
          </p>
        </section>
        <LockedContinuation title="Open this activity" className="mt-8">
          Unlock the full plan for the preparation, how to run it with {details.guests} children,
          materials with quantities, cleanup and the products to buy.
        </LockedContinuation>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow={`Activity · ${activity.duration} · ${activity.effort}`}
      title={activity.name}
      intro={activity.summary}
    >
      <section className="surface p-6 md:p-8">
        <p className="eyebrow">What the children make</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed">{activity.making}</p>
        {chosen ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Planned as: {chosen.tier.label} — {chosen.tier.note} About {chosen.prepMinutes} minutes of
            preparation.
          </p>
        ) : null}
        {kit.length > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You'll need: {kit.map((e) => e.name).join(", ")}.
          </p>
        ) : null}
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
            {activity.preparation.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-lg text-gold">{i + 1}</span>
                <p className="text-[0.95rem] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl">During the party</h2>
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
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">Materials</h2>
        <p className="mt-2 text-sm text-muted-foreground">Exact quantities for {details.guests} guests.</p>
        <ul className="mt-4 space-y-3">
          {materials.map((m, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" />
              <p className="text-[0.95rem] leading-relaxed">{m}</p>
            </li>
          ))}
        </ul>
      </section>

      {products.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl">Shop this activity</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tap a product to open it at the retailer.</p>
          <ProductGrid products={products} className="mt-5" />
        </section>
      ) : null}

      {gate.locked && activities.length > 1 ? (
        <LockedContinuation title="More activity ideas" className="mt-12">
          This activity is yours in full. Unlock the plan to see the other {activities.length - 1}{" "}
          activities, with the same complete instructions, materials for {details.guests} children and
          shopping.
        </LockedContinuation>
      ) : null}
    </AppShell>
  );
}

