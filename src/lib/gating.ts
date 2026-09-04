import { useParty } from "./party-store";

/**
 * Free preview vs unlocked is a visibility level over the *same* plan data —
 * never a separate dataset or route. `limit` truncates a list while locked.
 * Before hydration we treat the plan as locked so paid content never flashes.
 */
export function useGate() {
  const { unlocked, hydrated } = useParty();
  const open = hydrated && unlocked;
  return {
    unlocked: open,
    locked: !open,
    limit<T>(list: T[], n: number): T[] {
      return open ? list : list.slice(0, n);
    },
    hidden<T>(list: T[], n: number): number {
      return open ? 0 : Math.max(0, list.length - n);
    },
  };
}
