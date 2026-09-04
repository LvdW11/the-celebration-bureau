import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SectionHeader, SectionTabBar } from "@/components/SectionNav";
import { useParty } from "@/lib/party-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Celebration Bureau" },
      { name: "description", content: "Unlock the complete princess party plan for Emma's seventh birthday." },
      { property: "og:title", content: "Checkout — The Celebration Bureau" },
      { property: "og:description", content: "One payment, the whole plan." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { details, unlock } = useParty();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 md:pb-0">
      <SectionHeader
        right={
          <Link to="/preview" className="hover:text-foreground">
            Back to preview
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-2xl px-5 py-10 pb-24 md:px-8">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Unlock the full plan</h1>

        <div className="surface mt-9 p-6 md:p-8">
          <div className="flex items-baseline justify-between border-b border-border/70 pb-5">
            <div>
              <p className="text-[0.95rem]">Complete party plan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {details.childName}, turning {details.age} · {details.theme}
              </p>
            </div>
            <span className="font-display text-2xl">$29</span>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li>Full timeline, shopping list, activities and food</li>
            <li>Printable crowns, place cards and clue cards</li>
            <li>Editable to-do schedule up to party day</li>
          </ul>
        </div>

        <div className="surface mt-6 p-6 md:p-8">
          <p className="eyebrow">Payment</p>
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-secondary/40 px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Payment is not connected yet. Continue to see the dashboard as it will appear after purchase.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              unlock();
              navigate({ to: "/dashboard" });
            }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue to my party
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Placeholder — no charge will be made.</p>
        </div>
      </main>
    </div>
  );
}
