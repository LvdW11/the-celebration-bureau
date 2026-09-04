import { products, productById, type Product, type ProductCategory } from "./products";
import {
  eligibleActivities,
  menuFor,
  preferredTier,
  priceFor,
  timelineFor,
  type Activity,
  type ActivityTier,
  type PartyDetails,
  type PlannedRecipe,
  type PricedProduct,
  type TimelineMoment,
} from "./plan";

/* ------------------------------------------------------------------ */
/* Result shape — snapshot-ready for later plan variants               */
/* ------------------------------------------------------------------ */

export interface PlanItem extends PricedProduct {
  /** The catalogue slot this fills — differs from `id` after a substitution. */
  sourceId: string;
  /** Optional items are the first thing budget pressure removes. */
  optional: boolean;
  /** Which activity pulled this item in, if any. */
  activityId?: string | undefined;
}

export interface SelectedActivity {
  activity: Activity;
  tier: ActivityTier;
  requiredIds: string[];
  optionalIds: string[];
  cost: number;
  prepMinutes: number;
}

export type DecisionKind =
  | "drop-optional"
  | "diy-swap"
  | "drop-product"
  | "substitute"
  | "upgrade"
  | "simplify-activity"
  | "drop-activity";

export interface PlanDecision {
  kind: DecisionKind;
  label: string;
  reason: string;
  saving: number;
}

export interface PartyPlan {
  details: PartyDetails;
  activities: SelectedActivity[];
  items: PlanItem[];
  /** Everything the engine removed to stay inside the budget. */
  dropped: PlanItem[];
  menu: PlannedRecipe[];
  timeline: TimelineMoment[];
  total: number;
  remaining: number;
  budget: number;
  byCategory: { category: ProductCategory | string; total: number }[];
  activityTotal: number;
  foodTotal: number;
  decisions: PlanDecision[];
  /** Total minutes of preparation the plan asks of the parent. */
  prepMinutes: number;
  /** True when even the bare-essential party cannot fit the budget. */
  overBudget: boolean;
}

/* ------------------------------------------------------------------ */
/* Internal working state                                              */
/* ------------------------------------------------------------------ */

interface Chosen {
  activityId: string;
  tierId: ActivityTier["id"];
  droppedOptional: string[];
}

interface State {
  chosen: Chosen[];
  diy: string[];
  droppedCore: string[];
  droppedActivities: string[];
  /** productId -> cheaper stand-in the plan buys instead. */
  subs: Record<string, string>;
}

const emptyState = (chosen: Chosen[]): State => ({
  chosen,
  diy: [],
  droppedCore: [],
  droppedActivities: [],
  subs: {},
});

/** The product this plan actually buys for a catalogue id. */
const resolve = (state: State, id: string) => state.subs[id] ?? id;

const round = (n: number) => Math.round(n * 100) / 100;

const coreProducts = (details: PartyDetails): Product[] =>
  products
    .filter(
      (p) => p.themes.includes(details.theme) && p.activityIds.length === 0 && !p.alternativeOnly,
    )
    .sort((a, b) => a.id.localeCompare(b.id));

function tierOf(activity: Activity, tierId: ActivityTier["id"]): ActivityTier {
  return activity.tiers.find((t) => t.id === tierId) ?? activity.tiers[0]!;
}

function selected(details: PartyDetails, state: State): SelectedActivity[] {
  return state.chosen
    .map((c) => {
      const activity = eligibleActivities(details).find((a) => a.id === c.activityId)!;
      const tier = tierOf(activity, c.tierId);
      const optionalIds = tier.optionalProductIds.filter((id) => !c.droppedOptional.includes(id));
      const ids = [...tier.requiredProductIds, ...optionalIds];
      const cost = ids.reduce((s, id) => {
        const p = productById(resolve(state, id));
        return p ? s + priceFor(p, details.guests, state.diy.includes(id)).lineTotal : s;
      }, 0);
      const diyPrep = ids.reduce((s, id) => {
        const p = productById(resolve(state, id));
        return p && state.diy.includes(id) && p.diy ? s + p.diy.prepMinutes : s;
      }, 0);
      return {
        activity,
        tier,
        requiredIds: tier.requiredProductIds,
        optionalIds,
        cost: round(cost),
        prepMinutes: tier.prepMinutes + diyPrep,
      };
    })
    .sort((a, b) => b.activity.partyValue - a.activity.partyValue || a.activity.id.localeCompare(b.activity.id));
}

/** Every product the current state buys, deduplicated and priced. */
function itemsFor(details: PartyDetails, state: State): PlanItem[] {
  const acts = selected(details, state);
  const map = new Map<string, { optional: boolean; activityId?: string }>();

  for (const p of coreProducts(details)) {
    if (state.droppedCore.includes(p.id)) continue;
    map.set(p.id, { optional: p.priority === "optional" });
  }
  for (const a of acts) {
    for (const id of a.requiredIds) {
      const existing = map.get(id);
      map.set(id, { optional: false, activityId: existing?.activityId ?? a.activity.id });
    }
    for (const id of a.optionalIds) {
      if (map.has(id)) continue;
      map.set(id, { optional: true, activityId: a.activity.id });
    }
  }

  return Array.from(map.entries())
    .map(([id, meta]) => {
      const product = productById(resolve(state, id))!;
      const priced = priceFor(product, details.guests, state.diy.includes(id));
      return { ...priced, sourceId: id, optional: meta.optional, activityId: meta.activityId };
    })
    .filter((i) => Boolean(i.id))
    .sort((a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id));
}

const totalOf = (items: PlanItem[]) => round(items.reduce((s, i) => s + i.lineTotal, 0));

/* ------------------------------------------------------------------ */
/* Moves — how the engine trims a party that does not fit              */
/* ------------------------------------------------------------------ */

interface Move {
  id: string;
  saving: number;
  valueCost: number;
  apply: (s: State) => State;
  decision: PlanDecision;
}

/** How willing this parent is to trade time for money. */
function diyAppetite(diy: string) {
  if (diy === "High") return 0.5;
  if (diy === "Medium") return 1.2;
  return 2.6;
}

function buildMoves(details: PartyDetails, state: State, items: PlanItem[]): Move[] {
  const moves: Move[] = [];
  const acts = selected(details, state);
  const byId = new Map(items.map((i) => [i.sourceId, i]));

  // 1. Drop an optional component of an activity — simplify, never delete.
  for (const a of acts) {
    for (const id of a.optionalIds) {
      const item = byId.get(id);
      const product = productById(id);
      if (!item || !product || item.optional === false) continue;
      moves.push({
        id: `drop-optional:${a.activity.id}:${id}`,
        saving: item.lineTotal,
        valueCost: product.partyValue * 0.6,
        apply: (s) => ({
          ...s,
          chosen: s.chosen.map((c) =>
            c.activityId === a.activity.id
              ? { ...c, droppedOptional: [...c.droppedOptional, id] }
              : c,
          ),
        }),
        decision: {
          kind: "drop-optional",
          label: `Simplified ${a.activity.name}`,
          reason: `${product.name} adds the least to this moment, so it comes out first.`,
          saving: item.lineTotal,
        },
      });
    }
  }

  // 2. Make it yourself instead of buying it.
  for (const item of items) {
    const product = productById(item.id);
    if (!product?.diy || state.diy.includes(item.sourceId)) continue;
    const homemade = priceFor(product, details.guests, true).lineTotal;
    const saving = round(item.lineTotal - homemade);
    if (saving <= 0) continue;
    moves.push({
      id: `diy:${item.sourceId}`,
      saving,
      valueCost: diyAppetite(details.diy) + product.diy.prepMinutes / 90,
      apply: (s) => ({ ...s, diy: [...s.diy, item.sourceId] }),
      decision: {
        kind: "diy-swap",
        label: `${product.diy.name}`,
        reason: `${product.diy.note} About ${product.diy.prepMinutes} minutes of your time instead of ${round(saving)} dollars.`,
        saving,
      },
    });
  }

  // 3. Drop a low-value core product that is not essential.
  for (const item of items) {
    const product = productById(item.id);
    if (!product || product.priority === "essential" || item.activityId) continue;
    moves.push({
      id: `drop-core:${item.sourceId}`,
      saving: item.lineTotal,
      valueCost: product.partyValue * (product.priority === "recommended" ? 1.6 : 1),
      apply: (s) => ({ ...s, droppedCore: [...s.droppedCore, item.sourceId] }),
      decision: {
        kind: "drop-product",
        label: `Left out ${product.name}`,
        reason: "Styling detail with the lowest contribution to the day.",
        saving: item.lineTotal,
      },
    });
  }

  // 3b. Buy the plainer version of something the party genuinely needs.
  for (const item of items) {
    const slot = productById(item.sourceId);
    if (!slot?.alternativeId || state.subs[item.sourceId]) continue;
    const alt = productById(slot.alternativeId);
    if (!alt) continue;
    const cheaper = priceFor(alt, details.guests, state.diy.includes(item.sourceId) && Boolean(alt.diy)).lineTotal;
    const saving = round(item.lineTotal - cheaper);
    if (saving <= 0) continue;
    moves.push({
      id: `swap:${item.sourceId}`,
      saving,
      // Downgrading a high-value element (the cake) costs far more party value
      // than downgrading a plate, even for the same drop in score.
      valueCost: Math.max(0.4, (slot.partyValue - alt.partyValue) * (slot.partyValue / 4)),
      apply: (s) => ({ ...s, subs: { ...s.subs, [item.sourceId]: alt.id } }),
      decision: {
        kind: "substitute",
        label: `${alt.name} instead of ${slot.name}`,
        reason: "A plainer version of something the party needs either way.",
        saving,
      },
    });
  }

  // 4. Step an activity down a tier — the same moment, more of your own work.
  for (const a of acts) {
    if (a.tier.id !== "ready") continue;
    const simple = a.activity.tiers.find((t) => t.id === "simple");
    if (!simple) continue;
    const cost = (ids: string[]) =>
      ids.reduce((s, id) => {
        const p = productById(resolve(state, id));
        return p ? s + priceFor(p, details.guests, state.diy.includes(id)).lineTotal : s;
      }, 0);
    const saving = round(cost(a.tier.requiredProductIds) - cost(simple.requiredProductIds));
    if (saving <= 0) continue;
    moves.push({
      id: `tier:${a.activity.id}`,
      saving,
      valueCost: 1.8 + diyAppetite(details.diy) * 0.5,
      apply: (s) => ({
        ...s,
        chosen: s.chosen.map((c) => (c.activityId === a.activity.id ? { ...c, tierId: "simple" } : c)),
      }),
      decision: {
        kind: "simplify-activity",
        label: `${a.activity.name} — ${simple.label}`,
        reason: simple.note,
        saving,
      },
    });
  }

  // 5. Last resort: drop the least valuable activity outright.
  for (const a of acts) {
    if (a.activity.priority === "essential") continue;
    const exclusive = items.filter((i) => i.activityId === a.activity.id);
    const saving = round(exclusive.reduce((s, i) => s + i.lineTotal, 0));
    if (saving <= 0) continue;
    moves.push({
      id: `drop-activity:${a.activity.id}`,
      saving,
      valueCost: a.activity.partyValue * 3,
      apply: (s) => ({
        ...s,
        chosen: s.chosen.filter((c) => c.activityId !== a.activity.id),
        droppedActivities: [...s.droppedActivities, a.activity.id],
      }),
      decision: {
        kind: "drop-activity",
        label: `Left out ${a.activity.name}`,
        reason: "The budget could not carry every moment — the strongest ones stay.",
        saving,
      },
    });
  }

  return moves.sort((a, b) => a.id.localeCompare(b.id));
}

/* ------------------------------------------------------------------ */
/* The planner                                                         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Upgrades — how the engine spends headroom, if it is worth spending   */
/* ------------------------------------------------------------------ */

interface Upgrade {
  id: string;
  cost: number;
  /** Party value (or prep relief) bought by that cost. */
  gain: number;
  apply: (s: State) => State;
  decision: PlanDecision;
}

/** Value points a dollar has to buy before the engine will spend it. */
const MIN_VALUE_PER_DOLLAR = 0.12;

function buildUpgrades(details: PartyDetails, state: State, items: PlanItem[]): Upgrade[] {
  const ups: Upgrade[] = [];
  const wantsConvenience = details.diy !== "High";
  const relief = diyAppetite(details.diy);

  // 1. Buy the better version of something the plan downgraded.
  for (const item of items) {
    const slotId = item.sourceId;
    if (!state.subs[slotId]) continue;
    const slot = productById(slotId);
    if (!slot) continue;
    const cost = round(priceFor(slot, details.guests).lineTotal - item.lineTotal);
    if (cost <= 0) continue;
    ups.push({
      id: `un-swap:${slotId}`,
      cost,
      gain: Math.max(0.4, slot.partyValue - (productById(state.subs[slotId]!)?.partyValue ?? 0)),
      apply: (s) => {
        const subs = { ...s.subs };
        delete subs[slotId];
        return { ...s, subs };
      },
      decision: {
        kind: "upgrade",
        label: `${slot.name}`,
        reason: "There was room for the better version of something on the table.",
        saving: -cost,
      },
    });
  }

  // 2. Buy back some of the parent's evening.
  if (wantsConvenience) {
    for (const id of state.diy) {
      const product = productById(resolve(state, id));
      if (!product?.diy) continue;
      const cost = round(
        priceFor(product, details.guests).lineTotal -
          priceFor(product, details.guests, true).lineTotal,
      );
      if (cost <= 0) continue;
      ups.push({
        id: `un-diy:${id}`,
        cost,
        gain: (product.diy.prepMinutes / 60) * relief,
        apply: (s) => ({ ...s, diy: s.diy.filter((d) => d !== id) }),
        decision: {
          kind: "upgrade",
          label: `${product.name} — bought, not made`,
          reason: `The budget carried it, so that is ${product.diy.prepMinutes} minutes back in your evening.`,
          saving: -cost,
        },
      });
    }
  }

  // 3. Restore a component the plan had simplified away.
  for (const c of state.chosen) {
    for (const droppedId of c.droppedOptional) {
      const product = productById(resolve(state, droppedId));
      if (!product) continue;
      const cost = priceFor(product, details.guests, state.diy.includes(droppedId)).lineTotal;
      if (cost <= 0) continue;
      ups.push({
        id: `restore-optional:${c.activityId}:${droppedId}`,
        cost,
        gain: product.partyValue * 0.6,
        apply: (s) => ({
          ...s,
          chosen: s.chosen.map((x) =>
            x.activityId === c.activityId
              ? { ...x, droppedOptional: x.droppedOptional.filter((d) => d !== droppedId) }
              : x,
          ),
        }),
        decision: {
          kind: "upgrade",
          label: `${product.name} back in`,
          reason: "The budget had room for the finishing touch after all.",
          saving: -cost,
        },
      });
    }
  }

  // 4. Restore a styling piece the plan had left out.
  for (const droppedId of state.droppedCore) {
    const product = productById(resolve(state, droppedId));
    if (!product) continue;
    const cost = priceFor(product, details.guests, state.diy.includes(droppedId)).lineTotal;
    if (cost <= 0) continue;
    ups.push({
      id: `restore-core:${droppedId}`,
      cost,
      gain: product.partyValue * (product.priority === "recommended" ? 0.8 : 0.5),
      apply: (s) => ({ ...s, droppedCore: s.droppedCore.filter((d) => d !== droppedId) }),
      decision: {
        kind: "upgrade",
        label: `${product.name} back in`,
        reason: "A styling piece worth its place once the essentials were covered.",
        saving: -cost,
      },
    });
  }

  // 5. Step an activity back up to the ready-made version.
  if (wantsConvenience) {
    for (const a of selected(details, state)) {
      if (a.tier.id !== "simple") continue;
      const ready = a.activity.tiers.find((t) => t.id === "ready");
      if (!ready) continue;
      const costOf = (ids: string[]) =>
        ids.reduce((sum, id) => {
          const p = productById(resolve(state, id));
          return p ? sum + priceFor(p, details.guests, state.diy.includes(id)).lineTotal : sum;
        }, 0);
      const cost = round(costOf(ready.requiredProductIds) - costOf(a.tier.requiredProductIds));
      if (cost <= 0) continue;
      ups.push({
        id: `tier-up:${a.activity.id}`,
        cost,
        gain: ((a.tier.prepMinutes - ready.prepMinutes) / 60) * relief + 1,
        apply: (s) => ({
          ...s,
          chosen: s.chosen.map((c) =>
            c.activityId === a.activity.id ? { ...c, tierId: "ready" } : c,
          ),
        }),
        decision: {
          kind: "upgrade",
          label: `${a.activity.name} — ${ready.label}`,
          reason: ready.note,
          saving: -cost,
        },
      });
    }
  }

  return ups.sort((a, b) => a.id.localeCompare(b.id));
}

const MAX_STEPS = 60;

export function buildPlan(details: PartyDetails): PartyPlan {
  // Step 1 — a candidate party for these constraints.
  const capacity = details.durationHours * 60 * 0.75;
  let spent = 0;
  const candidates: Activity[] = [];
  for (const a of eligibleActivities(details)) {
    if (spent + a.durationMin > capacity && candidates.length > 0) continue;
    candidates.push(a);
    spent += a.durationMin;
  }

  const baseChosen = (): Chosen[] =>
    candidates.map((a) => ({
      activityId: a.id,
      tierId: preferredTier(a, details.diy).id,
      droppedOptional: [],
    }));

  let state: State = emptyState(baseChosen());

  // Step 2–5 — cost, trim, recost, until it fits.
  const decisions: PlanDecision[] = [];
  let items = itemsFor(details, state);
  let steps = 0;

  while (totalOf(items) > details.budget && steps < MAX_STEPS) {
    steps += 1;
    const moves = buildMoves(details, state, items).filter((m) => m.saving > 0);
    if (moves.length === 0) break;

    // Rank by saving per unit of party value given up. Ties break on move id,
    // so the same party always produces the same plan.
    const ratio = (m: Move) => m.saving / (m.valueCost + 0.5);
    const byRatio = [...moves].sort(
      (a, b) => ratio(b) - ratio(a) || a.id.localeCompare(b.id),
    );
    const leader = byRatio[0]!;

    // If a single move already closes the gap without giving up more party
    // value than the leader would, take it — never cut deeper than necessary.
    const gap = round(totalOf(items) - details.budget);
    const sufficient = moves
      .filter((m) => m.saving >= gap && m.valueCost <= leader.valueCost)
      .sort((a, b) => a.valueCost - b.valueCost || a.id.localeCompare(b.id));

    const best = sufficient[0] ?? leader;

    state = best.apply(state);
    decisions.push(best.decision);
    items = itemsFor(details, state);
  }

  // Step 6 — headroom. Only spend it where it genuinely improves the party.
  let ups = 0;
  while (ups < MAX_STEPS) {
    ups += 1;
    const headroom = round(details.budget - totalOf(items));
    const upgrades = buildUpgrades(details, state, items).filter(
      (u) => u.cost > 0 && u.cost <= headroom && u.gain / u.cost >= MIN_VALUE_PER_DOLLAR,
    );
    if (upgrades.length === 0) break;
    const best = [...upgrades].sort(
      (a, b) => b.gain / b.cost - a.gain / a.cost || a.id.localeCompare(b.id),
    )[0]!;
    state = best.apply(state);
    decisions.push(best.decision);
    items = itemsFor(details, state);
  }

  const before = itemsFor(details, emptyState(baseChosen()));
  const keptIds = new Set(items.map((i) => i.id));
  const dropped = before.filter((i) => !keptIds.has(i.id));

  const acts = selected(details, state);
  const total = totalOf(items);
  const categories = Array.from(new Set(items.map((i) => i.category))).sort();

  return {
    details,
    activities: acts,
    items,
    dropped,
    menu: menuFor(details),
    timeline: timelineFor(details),
    total,
    remaining: round(details.budget - total),
    budget: details.budget,
    byCategory: categories.map((category) => ({
      category,
      total: round(items.filter((i) => i.category === category).reduce((s, i) => s + i.lineTotal, 0)),
    })),
    activityTotal: round(acts.reduce((s, a) => s + a.cost, 0)),
    foodTotal: round(
      items.filter((i) => i.category === "Food & drink").reduce((s, i) => s + i.lineTotal, 0),
    ),
    decisions,
    prepMinutes:
      acts.reduce((s, a) => s + a.tier.prepMinutes, 0) +
      state.diy.reduce((s, id) => s + (productById(id)?.diy?.prepMinutes ?? 0), 0),
    overBudget: total > details.budget,
  };
}

/* ------------------------------------------------------------------ */
/* Compatibility view used by the shopping list and dashboard          */
/* ------------------------------------------------------------------ */

export interface BudgetResult {
  items: PlanItem[];
  skipped: PlanItem[];
  total: number;
  remaining: number;
  byCategory: { category: string; total: number }[];
  budget: number;
}

export function buildShoppingList(details: PartyDetails): BudgetResult {
  const plan = buildPlan(details);
  return {
    items: plan.items,
    skipped: plan.dropped,
    total: plan.total,
    remaining: plan.remaining,
    byCategory: plan.byCategory,
    budget: plan.budget,
  };
}

/** One authoritative cost for the products an activity needs. */
export function activityCost(details: PartyDetails, ids: string[]) {
  const plan = buildPlan(details);
  return round(
    ids.reduce((s, id) => {
      const item = plan.items.find((i) => i.id === id);
      if (item) return s + item.lineTotal;
      const product = productById(id);
      return product ? s + priceFor(product, details.guests).lineTotal : s;
    }, 0),
  );
}
