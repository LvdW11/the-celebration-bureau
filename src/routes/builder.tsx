import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { party } from "@/lib/party";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Party Builder — The Celebration Bureau" },
      { name: "description", content: "Tell us about the child, the guests, the space and the budget." },
      { property: "og:title", content: "Party Builder — The Celebration Bureau" },
      { property: "og:description", content: "Five quiet questions and your party plan is ready." },
    ],
  }),
  component: Builder,
});

const venues = ["Home", "Backyard", "Park"];
const themes = ["Elegant Magical Princess"];
const diyLevels = ["Low", "Medium", "High"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-[0.95rem] outline-none transition-shadow focus:ring-2 focus:ring-ring/50";

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Builder() {
  const [name, setName] = useState(party.childName);
  const [age, setAge] = useState(String(party.age));
  const [guests, setGuests] = useState(party.guests);
  const [venue, setVenue] = useState(party.venue);
  const [theme, setTheme] = useState(party.theme);
  const [budget, setBudget] = useState(party.budget);
  const [diy, setDiy] = useState(party.diy);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 md:px-8">
        <Link to="/" className="font-display text-lg tracking-tight">
          The Celebration Bureau
        </Link>
        <span className="text-xs text-muted-foreground">Step 1 of 2</span>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 md:px-8">
        <p className="eyebrow">Party builder</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Tell us about the birthday</h1>
        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          Seven quick answers. Everything else — timeline, shopping, food — we handle.
        </p>

        <form className="mt-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="surface space-y-7 p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Child's name">
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Age turning">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Field>
            </div>

            <Field label={`Children attending — ${guests}`}>
              <input
                type="range"
                min={8}
                max={15}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </Field>

            <Field label="Where">
              <Chips options={venues} value={venue} onChange={setVenue} />
            </Field>
          </div>

          <div className="surface space-y-7 p-6 md:p-8">
            <Field label="Theme">
              <Chips options={themes} value={theme} onChange={setTheme} />
              <p className="mt-3 text-xs text-muted-foreground">
                More themes arrive after our first season.
              </p>
            </Field>

            <Field label={`Budget — $${budget}`}>
              <input
                type="range"
                min={150}
                max={300}
                step={10}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </Field>

            <Field label="How much do you want to make yourself?">
              <Chips options={diyLevels} value={diy} onChange={setDiy} />
            </Field>
          </div>

          <Link
            to="/preview"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Create my free preview
          </Link>
        </form>
      </main>
    </div>
  );
}
