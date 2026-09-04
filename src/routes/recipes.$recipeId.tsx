import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LockedContinuation } from "@/components/PartyBits";
import { useParty, usePlan } from "@/lib/party-store";
import { notableEquipment } from "@/lib/equipment";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/recipes/$recipeId")({
  head: () => ({
    meta: [
      { title: "Recipe — The Celebration Bureau" },
      {
        name: "description",
        content: "Ingredients, quantities, method and make-ahead timings for one dish on your party menu.",
      },
      { property: "og:title", content: "Recipe — The Celebration Bureau" },
      { property: "og:description", content: "One dish from your party menu, written out in full." },
    ],
  }),
  component: RecipeDetail,
  notFoundComponent: RecipeNotFound,
});

function RecipeNotFound() {
  return (
    <AppShell eyebrow="Menu" title="Recipe not found">
      <p className="text-sm text-muted-foreground">
        This dish isn't on your party menu. Head back to the menu to see what's planned.
      </p>
    </AppShell>
  );
}

function RecipeDetail() {
  const { recipeId } = Route.useParams();
  const { details } = useParty();
  const { menu } = usePlan();
  const gate = useGate();

  const index = menu.findIndex((r) => r.id === recipeId);
  const recipe = menu[index];
  if (!recipe) throw notFound();

  // The free preview opens the first dish on the menu; the rest stay gated.
  const gated = gate.locked && index > 0;
  const kit = notableEquipment(recipe.equipment);

  if (gated) {
    return (
      <AppShell eyebrow={`Menu · ${recipe.course}`} title={recipe.name} intro={recipe.yield(details)}>
        <LockedContinuation title="Open this recipe">
          Unlock the full plan for the ingredients scaled to {details.guests} children, the method,
          make-ahead timings and the Bureau tip for every dish on your menu.
        </LockedContinuation>
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow={`Menu · ${recipe.course}`}
      title={recipe.name}
      intro={`${recipe.yield(details)} · about ${recipe.prepMinutes} minutes of work.`}
    >
      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">Ingredients</h2>
          <ul className="mt-4 space-y-3">
            {recipe.ingredients.map((i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" />
                <p className="text-[0.95rem] leading-relaxed">{i}</p>
              </li>
            ))}
          </ul>
          {recipe.substitutions.length > 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">
              Swapped for your party: {recipe.substitutions.join(" · ")}
            </p>
          ) : null}
          <p className="mt-5 text-sm text-muted-foreground">
            {kit.length > 0
              ? `You'll need: ${kit.map((e) => e.name).join(", ")}.`
              : "Everyday kitchen kit only."}
          </p>
        </section>

        <section>
          <h2 className="text-2xl">Method</h2>
          <ol className="mt-4 space-y-3">
            {recipe.method.map((m, i) => (
              <li key={m} className="flex gap-4">
                <span className="font-display text-lg text-gold">{i + 1}</span>
                <p className="text-[0.95rem] leading-relaxed">{m}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-secondary/50 p-5">
            <p className="eyebrow">Make ahead</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recipe.makeAhead}</p>
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-2xl bg-secondary px-6 py-5 text-secondary-foreground">
        <p className="eyebrow">The Celebration Bureau tip</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed">{recipe.tip}</p>
      </section>

      {gate.locked ? (
        <LockedContinuation title="The rest of your menu" className="mt-12">
          Unlock the full plan for {menu.length - 1} more recipes with ingredients scaled to{" "}
          {details.guests} children, methods, make-ahead timings and the shopping behind them.
        </LockedContinuation>
      ) : null}
    </AppShell>
  );
}
