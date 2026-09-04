import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { usePlan } from "@/lib/party-store";

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

  return (
    <AppShell
      eyebrow="Activities"
      title={`${activities.length} moments, well paced`}
      intro={`Chosen for age ${details.age} and a ${details.diy.toLowerCase()}-DIY afternoon ${details.venue.toLowerCase() === "home" ? "at home" : `in the ${details.venue.toLowerCase()}`}. No competition, no crying at the end.`}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {activities.map((a) => (
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
    </AppShell>
  );
}
