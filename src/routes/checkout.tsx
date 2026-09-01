import { createFileRoute, Link } from "@tanstack/react-router";
import { party } from "@/lib/party";

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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-6 md:px-8">
        <Link to="/" className="font-display text-lg tracking-tight">
          The Celebration Bureau
        </Link>
        <Link to="/preview" className="text-sm text-muted-foreground hover:text-foreground">
          Back to preview
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-24 md:px-8">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Unlock the full plan</h1>

        <div className="surface mt-9 p-6 md:p-8">
          <div className="flex items-baseline justify-between border-b border-border/70 pb-5">
            <div>
              <p className="text-[0.95rem]">Complete party plan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {party.childName}, turning {party.age} · {party.theme}
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
          <Link
            to="/dashboard"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue to my party
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Placeholder — no charge will be made.</p>
        </div>
      </main>
    </div>
  );
}
