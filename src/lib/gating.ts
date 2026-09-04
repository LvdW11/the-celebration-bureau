import { useParty } from "./party-store";

/**
 * Free preview vs unlocked is a visibility level over the *same* plan data —
 * never a separate dataset or route. `limit` truncates a list while locked.
 */
export function useGate() {
  const { unlocked } = useParty();
  return {
    unlocked,
    locked: !unlocked,
    limit<T>(list: T[], n: number): T[] {
      return unlocked ? list : list.slice(0, n);
    },
    hidden<T>(list: T[], n: number): number {
      return unlocked ? 0 : Math.max(0, list.length - n);
    },
  };
}
