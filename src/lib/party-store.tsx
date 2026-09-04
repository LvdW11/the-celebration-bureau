import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  allTodos,
  buildShoppingList,
  defaultParty,
  timelineFor,
  activitiesFor,
  type PartyDetails,
} from "./plan";

const KEY = "cb.party.v1";

interface Stored {
  details: PartyDetails;
  done: string[];
  unlocked: boolean;
}

interface Ctx {
  details: PartyDetails;
  setDetails: (d: Partial<PartyDetails>) => void;
  done: string[];
  toggleTodo: (id: string) => void;
  unlocked: boolean;
  unlock: () => void;
  /** False until localStorage has been read, so we never flash paid content. */
  hydrated: boolean;
  progress: { done: number; total: number; percent: number };
}

const PartyContext = createContext<Ctx | null>(null);

export function PartyProvider({ children }: { children: ReactNode }) {
  const [details, setDetailsState] = useState<PartyDetails>(defaultParty);
  const [done, setDone] = useState<string[]>(["invites", "cake"]);
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount to avoid SSR mismatches.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Stored>;
        if (parsed.details) setDetailsState({ ...defaultParty, ...parsed.details });
        if (Array.isArray(parsed.done)) setDone(parsed.done);
        if (typeof parsed.unlocked === "boolean") setUnlocked(parsed.unlocked);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Only persist once the stored state has been read, so we never overwrite it.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ details, done, unlocked }));
    } catch {
      /* ignore */
    }
  }, [hydrated, details, done, unlocked]);

  const value = useMemo<Ctx>(() => {
    const total = allTodos.length;
    const completed = allTodos.filter((t) => done.includes(t.id)).length;
    return {
      details,
      setDetails: (d) => setDetailsState((prev) => ({ ...prev, ...d })),
      done,
      toggleTodo: (id) =>
        setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      unlocked,
      unlock: () => {
        setUnlocked(true);
        // Persist immediately so a subsequent navigation never outruns the effect.
        try {
          const raw = localStorage.getItem(KEY);
          const parsed = raw ? (JSON.parse(raw) as Partial<Stored>) : {};
          localStorage.setItem(
            KEY,
            JSON.stringify({ details, done, ...parsed, unlocked: true }),
          );
        } catch {
          /* ignore */
        }
      },
      hydrated,
      progress: { done: completed, total, percent: Math.round((completed / total) * 100) },
    };
  }, [details, done, unlocked, hydrated]);

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}

export function useParty() {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error("useParty must be used inside PartyProvider");
  return ctx;
}

/** Convenience hooks derived from the single source of truth. */
export function usePlan() {
  const { details } = useParty();
  return useMemo(
    () => ({
      details,
      timeline: timelineFor(details),
      activities: activitiesFor(details.age),
      budget: buildShoppingList(details),
      todos: allTodos,
    }),
    [details],
  );
}
