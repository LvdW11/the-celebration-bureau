import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LockedContinuation } from "@/components/PartyBits";
import { useParty, usePlan } from "@/lib/party-store";
import { allergyNotesFor, dietaryOptions, timelineFor, type Allergen } from "@/lib/plan";
import { notableEquipment } from "@/lib/equipment";
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
  const { details, setDetails } = useParty();
  const { menu } = usePlan();
  const teaTime = timelineFor(details).find((m) => m.id === "tea")?.time;
  const gate = useGate();
  // One dish is fully written out; a second shows its ingredient list so the
  // scaling is visible. The rest keep names and yields.
  const full = gate.limit(menu, 1).map((r) => r.id);
  const ingredientsOnly = gate.limit(menu, 2).map((r) => r.id);
  const hiddenCount = gate.hidden(menu, 1);

  const courses = Array.from(new Set(menu.map((r) => r.course))).map((course) => ({
    course,
    items: menu.filter((r) => r.course === course),
  }));

  const toggleDietary = (key: Allergen) =>
    setDetails({
      dietary: details.dietary.includes(key)
        ? details.dietary.filter((d) => d !== key)
        : [...details.dietary, key],
    });

  return (
    <AppShell
      eyebrow="Food"
      title="The tea table"
      intro={`Served seated${teaTime ? ` at ${teaTime}` : ""}, for ${details.guests} children. Almost everything can be made the day before.`}
    >
      <div className="space-y-8">
        <section className="surface p-6 md:p-7">
          <p className="eyebrow">Any allergies or dietary requirements?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us once and the whole menu re-plans around it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDetails({ dietary: [] })}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                details.dietary.length === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              None
            </button>
            {dietaryOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => toggleDietary(o.key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  details.dietary.includes(o.key)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

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

                  {notableEquipment(r.equipment).length > 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Needs: {notableEquipment(r.equipment).map((e) => e.name).join(", ")} ·{" "}
                      {r.prepMinutes} min
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Everyday kitchen kit only · {r.prepMinutes} min
                    </p>
                  )}

                  {ingredientsOnly.includes(r.id) ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {r.ingredients.map((i) => (
                        <li key={i} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                          {i}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {r.substitutions.length > 0 && ingredientsOnly.includes(r.id) ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Swapped for your party: {r.substitutions.join(" · ")}
                    </p>
                  ) : null}

                  {full.includes(r.id) ? (
                    <>
                      <ol className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {r.method.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ol>
                      <p className="mt-2 text-sm text-muted-foreground">{r.makeAhead}</p>
                      <p className="mt-3 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                        <span className="eyebrow">Bureau tip</span>
                        <span className="mt-1 block">{r.tip}</span>
                      </p>
                    </>
                  ) : ingredientsOnly.includes(r.id) ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Method, the Bureau tip and make-ahead timings are in the full plan.
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
            {allergyNotesFor(details).map((n) => (
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
