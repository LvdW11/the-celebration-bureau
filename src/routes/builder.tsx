import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParty } from "@/lib/party-store";
import { dietaryOptions, type Allergen } from "@/lib/plan";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Party Builder — The Celebration Bureau" },
      { name: "description", content: "Tell us about the child, the guests, the space and the budget." },
      { property: "og:title", content: "Party Builder — The Celebration Bureau" },
      { property: "og:description", content: "A few quiet questions and your party plan is ready." },
    ],
  }),
  component: Builder,
});

const venues = ["Home", "Backyard", "Park"];
const themes = ["Elegant Magical Princess"];
const diyLevels = ["Low", "Medium", "High"];
const DATE_FORMAT = "EEEE, MMMM d, yyyy";

/** Every quarter hour from 8:00 AM to 10:00 PM, stored as 24h for the engine. */
const startTimes = Array.from({ length: (22 - 8) * 4 + 1 }, (_, i) => {
  const minutes = 8 * 60 + i * 15;
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    value: `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    label: `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`,
  };
});

function timeLabel(value: string) {
  return startTimes.find((t) => t.value === value)?.label ?? value;
}

function parseDate(value: string): Date | undefined {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

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
  const { details, setDetails } = useParty();
  const navigate = useNavigate();

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
          Every answer reshapes the plan — quantities, shopping list, activities and timeline all
          follow from what you set here.
        </p>

        <form className="mt-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="surface space-y-7 p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Child's name">
                <input
                  className={inputClass}
                  value={details.childName}
                  onChange={(e) => setDetails({ childName: e.target.value })}
                />
              </Field>
              <Field label={`Age turning — ${details.age}`}>
                <input
                  type="range"
                  min={4}
                  max={8}
                  value={details.age}
                  onChange={(e) => setDetails({ age: Number(e.target.value) })}
                  className="w-full accent-[var(--primary)]"
                />
              </Field>
            </div>

            <Field label={`Children attending — ${details.guests}`}>
              <input
                type="range"
                min={8}
                max={15}
                value={details.guests}
                onChange={(e) => setDetails({ guests: Number(e.target.value) })}
                className="w-full accent-[var(--primary)]"
              />
            </Field>

            <Field label="Where">
              <Chips options={venues} value={details.venue} onChange={(v) => setDetails({ venue: v })} />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Party date">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        inputClass,
                        "flex items-center gap-3 text-left",
                        !details.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="size-4 text-gold" strokeWidth={1.5} />
                      {details.date || "Select a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={parseDate(details.date)}
                      {...(parseDate(details.date) ? { defaultMonth: parseDate(details.date)! } : {})}
                      onSelect={(d) => d && setDetails({ date: format(d, DATE_FORMAT) })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field label="Start time">
                <Select
                  value={details.startTime}
                  onValueChange={(v) => setDetails({ startTime: v })}
                >
                  <SelectTrigger className={cn(inputClass, "h-auto")}>
                    <SelectValue placeholder="Select a time">{timeLabel(details.startTime)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {startTimes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label={`Length — ${details.durationHours} hours`}>
              <input
                type="range"
                min={2}
                max={4}
                step={0.5}
                value={details.durationHours}
                onChange={(e) => setDetails({ durationHours: Number(e.target.value) })}
                className="w-full accent-[var(--primary)]"
              />
            </Field>
          </div>

          <div className="surface space-y-7 p-6 md:p-8">
            <Field label="Theme">
              <Chips options={themes} value={details.theme} onChange={(v) => setDetails({ theme: v })} />
              <p className="mt-3 text-xs text-muted-foreground">
                More themes arrive after our first season.
              </p>
            </Field>

            <Field label={`Budget — $${details.budget}`}>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={details.budget}
                onChange={(e) => setDetails({ budget: Number(e.target.value) })}
                className="w-full accent-[var(--primary)]"
              />
              <p className="mt-3 text-xs text-muted-foreground">
                A hard limit — we never recommend a list that goes over it.
              </p>
            </Field>

            <Field label="How much do you want to make yourself?">
              <Chips options={diyLevels} value={details.diy} onChange={(v) => setDetails({ diy: v })} />
              <p className="mt-3 text-xs text-muted-foreground">
                A real trade-off: more making means less spending, and the plan changes accordingly.
              </p>
            </Field>

            <Field label="Any allergies or dietary requirements?">
              <div className="flex flex-wrap gap-2">
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
                    onClick={() =>
                      setDetails({
                        dietary: details.dietary.includes(o.key)
                          ? details.dietary.filter((d: Allergen) => d !== o.key)
                          : [...details.dietary, o.key],
                      })
                    }
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
              <p className="mt-3 text-xs text-muted-foreground">
                Tell us once — every recipe on the tea table respects it.
              </p>
            </Field>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: "/preview" })}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Create my free preview
          </button>
        </form>
      </main>
    </div>
  );
}
