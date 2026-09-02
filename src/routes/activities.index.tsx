import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { activities } from "@/lib/party";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "Activities — The Celebration Bureau" },
      { name: "description", content: "Four low-prep princess party activities for ten children aged four to eight." },
      { property: "og:title", content: "Activities — The Celebration Bureau" },
      { property: "og:description", content: "Four activities, paced for a two-and-a-half hour afternoon." },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  return (
    <AppShell
      eyebrow="Activities"
      title="Four moments, well paced"
      intro="Chosen for a low-DIY afternoon in the backyard. No competition, no crying at the end."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {activities.map((a) => (
          <article key={a.name} className="surface flex flex-col p-6 md:p-7">
            <div className="flex items-center gap-3">
              <span className="eyebrow">{a.duration}</span>
              <span className="size-1 rounded-full bg-gold" />
              <span className="eyebrow">{a.effort}</span>
            </div>
            <h2 className="mt-3 text-2xl">{a.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {a.needs.map((n) => (
                <li key={n} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                  {n}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
