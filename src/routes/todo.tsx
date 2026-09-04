import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LockedContinuation, ProgressBar } from "@/components/PartyBits";
import { useParty, usePlan } from "@/lib/party-store";
import { useGate } from "@/lib/gating";

export const Route = createFileRoute("/todo")({
  head: () => ({
    meta: [
      { title: "To Do — The Celebration Bureau" },
      { name: "description", content: "The week-by-week checklist leading up to your princess party." },
      { property: "og:title", content: "To Do — The Celebration Bureau" },
      { property: "og:description", content: "Everything to do, in the order to do it." },
    ],
  }),
  component: TodoPage,
});

function TodoPage() {
  const { details, todos } = usePlan();
  const { done, toggleTodo } = useParty();
  const gate = useGate();
  const shown = gate.limit(todos, 3);
  const hiddenCount = gate.hidden(todos, 3);

  return (
    <AppShell
      eyebrow="To do"
      title="Four weeks, calmly"
      intro={`Tick things off as you go. Everything is sized for ${details.guests} children.`}
    >
      <div className="surface mb-8 p-6">
        <ProgressBar />
      </div>

      <ul className="surface divide-y divide-border/70 overflow-hidden">
        {shown.map((t) => {
          const isDone = done.includes(t.id);
          return (
            <li key={t.id}>
              <div className="flex items-start gap-4 px-5 py-5 md:px-7">
                <button
                  type="button"
                  onClick={() => toggleTodo(t.id)}
                  aria-label={isDone ? `Mark ${t.task} as not done` : `Mark ${t.task} as done`}
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isDone ? "border-sage bg-sage" : "border-border"
                  }`}
                >
                  {isDone ? <Check className="size-3 text-sage-foreground" strokeWidth={2.5} /> : null}
                </button>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[0.95rem] ${isDone ? "text-muted-foreground line-through" : ""}`}>
                    {t.task}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t.note(details)}</span>
                  <span className="mt-2 flex flex-wrap gap-3 text-sm">
                    {t.productIds.length > 0 ? (
                      <Link to="/shopping-list" className="text-gold underline-offset-4 hover:underline">
                        Shop {t.productIds.length} items
                      </Link>
                    ) : null}
                    {t.activityIds.map((id) => (
                      <Link
                        key={id}
                        to="/activities/$activityId"
                        params={{ activityId: id }}
                        className="text-gold underline-offset-4 hover:underline"
                      >
                        Activity
                      </Link>
                    ))}
                    {t.timelineIds.map((id) => (
                      <Link
                        key={id}
                        to="/timeline/$momentId"
                        params={{ momentId: id }}
                        className="text-gold underline-offset-4 hover:underline"
                      >
                        Timeline
                      </Link>
                    ))}
                  </span>
                </span>
                <span className="eyebrow mt-1 shrink-0 text-right">{t.due}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 ? (
        <LockedContinuation title={`${hiddenCount} more tasks in the full plan`} className="mt-8">
          The complete four-week schedule — when to send invitations, order the cake, prep activities and
          set the table — with every task linked to the products and moments it belongs to.
        </LockedContinuation>
      ) : null}
    </AppShell>
  );
}
