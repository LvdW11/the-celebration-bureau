import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LockedContinuation } from "@/components/PartyBits";
import { useParty } from "@/lib/party-store";
import { recipes, allergyNotes, timelineFor } from "@/lib/plan";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Food — The Celebration Bureau" },
      { name: "description", content: "A nut-free tea-table menu with quantities and make-ahead notes for a princess party at home." },
      { property: "og:title", content: "Food — The Celebration Bureau" },
      { property: "og:description", content: "A tea table children actually eat from." },
    ],
  }),
  component: FoodPage,
});

function FoodPage() {
  const { details } = useParty();
  const teaTime = timelineFor(details).find((m) => m.id === "tea")?.time;
  const gate = useGate();
  // One dish is fully written out; a second shows its ingredient list so the
  // scaling is visible. The rest keep names and yields.
  const full = gate.limit(recipes, 1).map((r) => r.id);
  const ingredientsOnly = gate.limit(recipes, 2).map((r) => r.id);
  const hiddenCount = gate.hidden(recipes, 1);

  const courses = Array.from(new Set(recipes.map((r) => r.course))).map((course) => ({
    course,
    items: recipes.filter((r) => r.course === course),
  }));

  return (
    <AppShell
      eyebrow="Food"
      title="The tea table"
      intro={`Served seated${teaTime ? ` at ${teaTime}` : ""}, for ${details.guests} children. Almost everything can be made the day before.`}
    >
      <div className="space-y-8">
        {courses.map((course) => (
          <section key={course.course}>
            <h2 className="text-xl">{course.course}</h2>
            <ul className="surface mt-4 divide-y divide-border/70 overflow-hidden">
              {course.items.map((r) => (
                <li key={r.id} className="px-5 py-5 md:px-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[0.95rem]">{r.name}</p>
                    <span className="eyebrow shrink-0">{r.yield(details)}</span>
                  </div>

                  {ingredientsOnly.includes(r.id) ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {r.ingredients(details).map((i) => (
                        <li key={i} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                          {i}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {full.includes(r.id) ? (
                    <>
                      <ol className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {r.method.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ol>
                      <p className="mt-2 text-sm text-muted-foreground">{r.makeAhead}</p>
                    </>
                  ) : ingredientsOnly.includes(r.id) ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Method and make-ahead timings are in the full plan.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Ingredients, quantities and make-ahead timings are in the full plan.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {hiddenCount > 0 ? (
          <LockedContinuation title={`Full recipes for ${hiddenCount} more dishes`}>
            Scaled ingredient quantities for {details.guests} children, method steps and a make-ahead
            schedule for every dish on the tea table.
          </LockedContinuation>
        ) : null}


        <section>
          <h2 className="text-xl">Allergy notes</h2>
          <ul className="surface mt-4 divide-y divide-border/70 overflow-hidden">
            {allergyNotes.map((n) => (
              <li key={n} className="px-5 py-4 text-sm text-muted-foreground md:px-7">
                {n}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
