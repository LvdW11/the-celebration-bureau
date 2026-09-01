import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { party, shopping } from "@/lib/party";

export const Route = createFileRoute("/shopping-list")({
  head: () => ({
    meta: [
      { title: "Shopping List — The Celebration Bureau" },
      { name: "description", content: "Every item costed for a $200 backyard princess party for ten children." },
      { property: "og:title", content: "Shopping List — The Celebration Bureau" },
      { property: "og:description", content: "Costed, categorised and within budget." },
    ],
  }),
  component: ShoppingPage,
});

function ShoppingPage() {
  const total = shopping.reduce((s, c) => s + c.items.reduce((a, i) => a + i.price, 0), 0);

  return (
    <AppShell
      eyebrow="Shopping list"
      title="Everything you'll need"
      intro="Grouped by where you'll buy it. Prices are US averages and include the cake."
    >
      <div className="surface mb-8 flex items-baseline justify-between p-6">
        <span className="eyebrow">Estimated total</span>
        <span className="font-display text-3xl">
          ${total}
          <span className="ml-2 text-sm text-muted-foreground">of ${party.budget} target</span>
        </span>
      </div>

      <div className="space-y-8">
        {shopping.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-xl">{cat.category}</h2>
            <ul className="surface mt-4 divide-y divide-border/70 overflow-hidden">
              {cat.items.map((i) => (
                <li key={i.name} className="flex items-center justify-between gap-4 px-5 py-4 md:px-7">
                  <span className="min-w-0">
                    <span className="block text-[0.95rem]">{i.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{i.qty}</span>
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground">${i.price}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
