import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ActivityCard } from "@/components/ActivityCard";
import { LockedContinuation } from "@/components/PartyBits";
import { usePlan } from "@/lib/party-store";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "Activities — The Celebration Bureau" },
      { name: "description", content: "Low-prep princess party activities chosen for your child's age and party length." },
      { property: "og:title", content: "Activities — The Celebration Bureau" },
      { property: "og:description", content: "Activities paced for the whole afternoon." },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const { details, activities } = usePlan();
  const gate = useGate();

  return (
    <AppShell
      eyebrow="Activities"
      title={`${activities.length} moments, well paced`}
      intro={`Chosen for age ${details.age} and a ${details.diy.toLowerCase()}-DIY afternoon ${details.venue.toLowerCase() === "home" ? "at home" : `in the ${details.venue.toLowerCase()}`}. No competition, no crying at the end.`}
    >
      {/* Every activity is visible at summary depth — the paid depth is the
          step-by-step instructions on each detail page. */}
      <div className="grid gap-5 md:grid-cols-2">
        {activities.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>

      {gate.locked ? (
        <LockedContinuation title="Step-by-step instructions for all of them" className="mt-8">
          Each activity opens into full preparation, what to say while you run it, exact materials for{" "}
          {details.guests} children, cleanup notes and the products to buy.
        </LockedContinuation>
      ) : null}
    </AppShell>
  );
}
