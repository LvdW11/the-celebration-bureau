import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
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
  const shown = gate.limit(activities, 2);
  const hiddenCount = gate.hidden(activities, 2);

  return (
    <AppShell
      eyebrow="Activities"
      title={`${activities.length} moments, well paced`}
      intro={`Chosen for age ${details.age} and a ${details.diy.toLowerCase()}-DIY afternoon ${details.venue.toLowerCase() === "home" ? "at home" : `in the ${details.venue.toLowerCase()}`}. No competition, no crying at the end.`}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((a) => (
          <Link
            key={a.id}
            to="/activities/$activityId"
            params={{ activityId: a.id }}
            className="surface flex flex-col p-6 transition-shadow hover:shadow-[var(--shadow-lift)] md:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="eyebrow">{a.duration}</span>
              <span className="size-1 rounded-full bg-gold" />
              <span className="eyebrow">{a.effort}</span>
            </div>
            <h2 className="mt-3 text-2xl">{a.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {a.materials(details.guests).slice(0, 3).map((n) => (
                <li key={n} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                  {n}
                </li>
              ))}
            </ul>
            <span className="mt-5 text-sm text-gold">Instructions →</span>
          </Link>
        ))}
      </div>

      {hiddenCount > 0 ? (
        <LockedContinuation title={`${hiddenCount} more activities in the full plan`} className="mt-8">
          Each with step-by-step preparation, what to say during the party, exact materials for
          {" "}{details.guests} children, cleanup notes and the products to buy.
        </LockedContinuation>
      ) : null}
    </AppShell>
  );
}
