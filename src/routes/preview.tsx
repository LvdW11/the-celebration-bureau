import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import previewCover from "@/assets/preview-cover.jpg";
import { usePlan } from "@/lib/party-store";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Your Free Party Preview — The Celebration Bureau" },
      {
        name: "description",
        content: "A first look at your elegant magical princess party: theme, timeline and budget.",
      },
      { property: "og:title", content: "Your Free Party Preview — The Celebration Bureau" },
      { property: "og:description", content: "A first look at the plan, free before you unlock it." },
    ],
  }),
  component: Preview,
});

const locked = [
  { title: "Full shopping list", body: "Every item, quantity and cost, kept inside your budget." },
  { title: "Activity instructions", body: "Prep times, materials and how to run each moment." },
  { title: "Food & drink plan", body: "Tea-table menu with make-ahead timings." },
  { title: "To-do schedule", body: "What to do each week, starting four weeks out." },
];

function Preview() {
  const { details, timeline } = usePlan();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6 md:px-8">
        <Link to="/" className="font-display text-lg tracking-tight">
          The Celebration Bureau
        </Link>
        <Link to="/builder" className="text-sm text-muted-foreground hover:text-foreground">
          Edit details
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 pb-24 md:px-8 md:py-14">
        <p className="eyebrow">Free preview</p>
        <h1 className="mt-3 text-4xl md:text-5xl">
          {details.childName}'s {details.theme.toLowerCase()} party
        </h1>
        <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
          Turning {details.age} · {details.guests} children · {details.venue.toLowerCase()} · ${details.budget} budget ·{" "}
          {details.diy.toLowerCase()} DIY
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl">
          <img
            src={previewCover}
            alt="Gold crown, sage ribbon and printed invitation styled on warm linen"
            width={1200}
            height={912}
            className="h-56 w-full object-cover md:h-80"
          />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl">The palette</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { name: "Warm ivory", cls: "bg-ivory" },
              { name: "Soft blush", cls: "bg-blush" },
              { name: "Sage", cls: "bg-sage" },
              { name: "Muted gold", cls: "bg-gold" },
            ].map((c) => (
              <div key={c.name} className="surface overflow-hidden">
                <div className={`h-20 ${c.cls}`} />
                <p className="px-4 py-3 text-xs text-muted-foreground">{c.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl">The afternoon</h2>
          <p className="mt-2 text-sm text-muted-foreground">{details.date}</p>
          <ol className="mt-6 space-y-0">
            {timeline.slice(0, 3).map((t) => (
              <li key={t.id} className="flex gap-5 border-b border-border/70 py-5">
                <span className="w-14 shrink-0 font-display text-lg text-gold">{t.time}</span>
                <div>
                  <p className="text-[0.95rem]">{t.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            More moments follow, through cake and farewell favors.
          </p>
        </section>

        <section className="mt-14 rounded-3xl border border-border bg-secondary/50 p-6 md:p-10">
          <p className="eyebrow">Unlock the full plan</p>
          <h2 className="mt-3 text-3xl">Everything else, ready to follow</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {locked.map((l) => (
              <div key={l.title} className="flex gap-3 rounded-2xl bg-card/70 p-5">
                <Lock className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <p className="text-[0.95rem]">{l.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/checkout"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Unlock the full party — $29
          </Link>
        </section>
      </main>
    </div>
  );
}
