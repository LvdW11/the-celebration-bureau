import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ProductStrip } from "@/components/ProductCard";
import { useParty } from "@/lib/party-store";
import { productsForColor } from "@/lib/plan";
import type { PaletteColor } from "@/lib/products";

const palette: { key: PaletteColor; name: string; cls: string }[] = [
  { key: "ivory", name: "Warm ivory", cls: "bg-ivory" },
  { key: "blush", name: "Soft blush", cls: "bg-blush" },
  { key: "sage", name: "Sage", cls: "bg-sage" },
  { key: "gold", name: "Muted gold", cls: "bg-gold" },
];

/**
 * The palette is a way into the product catalogue: choosing a colour shows the
 * real products from the same dataset the shopping list is built from.
 */
export function PaletteProducts({ limit = 3 }: { limit?: number }) {
  const { details } = useParty();
  const [active, setActive] = useState<PaletteColor>("ivory");
  const matches = productsForColor(details, active).slice(0, limit);
  const current = palette.find((p) => p.key === active);

  return (
    <section>
      <h2 className="text-2xl">The palette</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a colour to see pieces from your plan that match it.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {palette.map((c) => {
          const isActive = c.key === active;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              aria-pressed={isActive}
              className={`surface overflow-hidden text-left transition-shadow hover:shadow-[var(--shadow-lift)] ${
                isActive ? "ring-1 ring-gold" : ""
              }`}
            >
              <div className={`h-20 ${c.cls}`} />
              <p className={`px-4 py-3 text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {c.name}
              </p>
            </button>
          );
        })}
      </div>

      {matches.length > 0 ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {matches.length} pieces in {current?.name.toLowerCase()}, priced for {details.guests} children.
          </p>
          <ProductStrip products={matches} className="mt-4" />
          <p className="mt-4 text-sm text-muted-foreground">
            These come from the same catalogue as your{" "}
            <Link to="/shopping-list" className="text-gold underline-offset-4 hover:underline">
              shopping list
            </Link>
            .
          </p>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Nothing in {current?.name.toLowerCase()} for this theme yet.
        </p>
      )}
    </section>
  );
}
