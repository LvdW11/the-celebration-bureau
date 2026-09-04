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
  // Depth is free, breadth is paid: one activity is shown as a complete worked
  // example, the rest continue in the full plan.
  const shown = gate.limit(activities, 1);
  const hidden = gate.hidden(activities, 1);

  return (
    <AppShell
      eyebrow="Activities"
      title={gate.locked ? "One of your activities, in full" : `${activities.length} moments, well paced`}
      intro={`Chosen for age ${details.age} and a ${details.diy.toLowerCase()}-DIY afternoon ${details.venue.toLowerCase() === "home" ? "at home" : `in the ${details.venue.toLowerCase()}`}. No competition, no crying at the end.`}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>

      {gate.locked ? (
        <LockedContinuation title="More activity ideas" className="mt-8">
          Unlock the full plan to see {hidden} more {hidden === 1 ? "activity" : "activities"}, with
          complete instructions, exact materials for {details.guests} children and the shopping behind
          them.
        </LockedContinuation>
      ) : null}
    </AppShell>
  );
}
