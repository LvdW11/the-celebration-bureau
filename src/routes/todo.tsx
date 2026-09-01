import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { todos as initialTodos } from "@/lib/party";

export const Route = createFileRoute("/todo")({
  head: () => ({
    meta: [
      { title: "To Do — The Celebration Bureau" },
      { name: "description", content: "The week-by-week checklist leading up to Emma's princess party." },
      { property: "og:title", content: "To Do — The Celebration Bureau" },
      { property: "og:description", content: "Everything to do, in the order to do it." },
    ],
  }),
  component: TodoPage,
});

function TodoPage() {
  const [done, setDone] = useState<number[]>(initialTodos.filter((t) => t.done).map((t) => t.id));

  const toggle = (id: number) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <AppShell
      eyebrow="To do"
      title="Four weeks, calmly"
      intro="Tick things off as you go. Nothing here takes more than an afternoon."
    >
      <ul className="surface divide-y divide-border/70 overflow-hidden">
        {initialTodos.map((t) => {
          const isDone = done.includes(t.id);
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-secondary/50 md:px-7"
              >
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isDone ? "border-sage bg-sage" : "border-border"
                  }`}
                >
                  {isDone ? <Check className="size-3 text-sage-foreground" strokeWidth={2.5} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[0.95rem] ${isDone ? "text-muted-foreground line-through" : ""}`}>
                    {t.task}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t.note}</span>
                </span>
                <span className="eyebrow mt-1 shrink-0 text-right">{t.due}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
