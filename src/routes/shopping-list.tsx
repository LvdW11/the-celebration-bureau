import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LockedContinuation } from "@/components/PartyBits";
import { usePlan } from "@/lib/party-store";
import { money } from "@/lib/plan";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/shopping-list")({
  head: () => ({
    meta: [
      { title: "Shopping List — The Celebration Bureau" },
      { name: "description", content: "Every item costed and quantified for your princess party, kept inside your budget." },
      { property: "og:title", content: "Shopping List — The Celebration Bureau" },
      { property: "og:description", content: "Costed, categorised and within budget." },
    ],
  }),
  component: ShoppingPage,
});

function ShoppingPage() {
  const { details, budget } = usePlan();
  const gate = useGate();

  // Totals always reflect the full plan; only the visible rows are limited,
  // and they are sampled across categories so the scope is obvious.
  const visibleItems = gate.spread(budget.items, 4);
  const hiddenCount = gate.hidden(budget.items, 4);

  const categories = budget.byCategory
    .map((c) => ({
      category: c.category,
      total: c.total,
      items: visibleItems.filter((i) => i.category === c.category),
    }))
    .filter((c) => c.items.length > 0);


  return (
    <AppShell
      eyebrow="Shopping list"
      title="Everything you'll need"
      intro={`Quantities calculated for ${details.guests} children. Prices are US averages and include the cake.`}
      action={
        <Link to="/builder" className="text-sm text-gold underline-offset-4 hover:underline">
          Edit details & budget
        </Link>
      }
    >
      <div className="surface mb-8 flex items-baseline justify-between p-6">
        <span className="eyebrow">Estimated total</span>
        <span className="font-display text-3xl">
          {money(budget.total)}
          <span className="ml-2 text-sm text-muted-foreground">of ${details.budget} budget</span>
        </span>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.category}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl">{cat.category}</h2>
              <span className="text-sm text-muted-foreground">{money(cat.total)} in this category</span>
            </div>
            {gate.locked ? (
              // Locked view leads with real product cards: image, need, price, retailer.
              <ProductGrid products={cat.items} className="mt-4" />
            ) : (
              <ul className="surface mt-4 divide-y divide-border/70 overflow-hidden">
                {cat.items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-4 px-5 py-4 md:px-7">
                    <span className="min-w-0">
                      <span className="block text-[0.95rem]">{i.name}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {i.needLabel}
                        {i.affiliateUrl ? (
                          <>
                            {" · "}
                            <a
                              href={i.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="text-gold underline-offset-4 hover:underline"
                            >
                              Shop
                            </a>
                          </>
                        ) : null}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">{money(i.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>


      {hiddenCount > 0 ? (
        <LockedContinuation title={`${hiddenCount} more items in the full shopping list`} className="mt-10">
          Every remaining item with its calculated quantity, price, retailer and direct shopping link — all
          fitted inside your ${details.budget} budget.
        </LockedContinuation>
      ) : null}

      {gate.unlocked && budget.skipped.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl">Left out to stay in budget</h2>
          <ul className="surface mt-4 divide-y divide-border/70 overflow-hidden">
            {budget.skipped.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 px-5 py-4 md:px-7">
                <span className="text-[0.95rem] text-muted-foreground">{i.name}</span>
                <span className="shrink-0 text-sm text-muted-foreground">{money(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AppShell>
  );
}
