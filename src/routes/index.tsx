import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-party.jpg";
import previewCover from "@/assets/preview-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Celebration Bureau — Princess Parties, Fully Planned" },
      {
        name: "description",
        content:
          "An AI party concierge for children's princess birthdays. You choose the theme, we plan the timeline, shopping list, activities and food.",
      },
      { property: "og:title", content: "The Celebration Bureau — Princess Parties, Fully Planned" },
      {
        property: "og:description",
        content: "You choose the theme. We take care of the rest.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { n: "01", title: "Tell us about the child", body: "Age, guest count, where you're hosting and what you'd like to spend." },
  { n: "02", title: "Choose the theme", body: "Elegant magical princess, styled for a home or backyard — never costume-shop bright." },
  { n: "03", title: "Receive the full plan", body: "Timeline, shopping list, activities, food and printables. Ready to follow." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <span className="font-display text-lg tracking-tight">The Celebration Bureau</span>
        <Link to="/builder" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Start planning
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-10 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow">Children's princess birthdays</p>
            <h1 className="mt-5 text-[2.75rem] leading-[1.05] md:text-6xl">
              You choose the occasion,
              <br />
              <em className="font-display italic">we take care of the rest.</em>
            </h1>
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
              A quiet, complete plan for a princess party at home — timeline, shopping list, activities
              and food, sized to your budget and your backyard.
            </p>
            <div className="mt-8">
              <Link
                to="/builder"
                className="inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
              >
                Build my party
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">Free preview. No account needed.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
            <img
              src={heroImage}
              alt="Backyard princess party table set with ivory linen, blush roses and gold candles"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
          <p className="eyebrow">How it works</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="surface p-7">
                <span className="font-display text-2xl text-gold">{s.n}</span>
                <h2 className="mt-3 text-xl">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="order-2 overflow-hidden rounded-3xl md:order-1">
            <img
              src={previewCover}
              alt="Flat lay of a gold crown, sage ribbon and an elegant printed invitation"
              width={1200}
              height={912}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow">What you receive</p>
            <h2 className="mt-4 text-3xl md:text-4xl">One plan, nothing left to decide</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li className="border-b border-border/70 pb-3">A minute-by-minute party timeline</li>
              <li className="border-b border-border/70 pb-3">A costed shopping list within your budget</li>
              <li className="border-b border-border/70 pb-3">Four age-right activities with prep times</li>
              <li className="border-b border-border/70 pb-3">A tea-table menu with make-ahead notes</li>
              <li>A to-do schedule that starts four weeks out</li>
            </ul>
            <Link
              to="/preview"
              className="mt-8 inline-flex items-center rounded-full border border-border px-6 py-3 text-sm transition-colors hover:bg-secondary"
            >
              See an example party
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 px-5 py-10 text-center text-xs text-muted-foreground md:px-10">
        The Celebration Bureau · Princess parties for ages 4–8
      </footer>
    </div>
  );
}
