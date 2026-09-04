# Phase 4A — Smart Planning Engine

The parent gives the constraints; the Bureau makes the decisions. Today the app personalises numbers (quantities, totals, ages) but the party itself barely changes when budget or DIY changes. Phase 4A replaces that with a real planning engine, while leaving the look, routes, navigation and free/paid gating untouched.

## What I found in the current code

- `src/lib/plan.ts` holds everything: party details, activities, timeline, to-dos, recipes and the budget logic.
- Budget handling is a single loop in `buildShoppingList()` that repeatedly deletes the most expensive non-essential product until the total fits. That is exactly the "delete the priciest thing" behaviour we want to replace. It can also stop early (leaving the plan over budget) when only essentials remain.
- DIY level is currently decorative only — it appears in a sentence on the Activities page and nowhere in the maths.
- Activities are filtered by age alone. Theme, venue, duration, budget and DIY are ignored.
- Recipes scale by guest count but have no equipment, no allergen data and no party tip.
- There is no dietary/allergy field in the party at all.
- Quantities always round up from "covers N children" — no buffer logic, no distinction between reusable and consumable, and cake/groceries are priced as if they were products.
- Costs are computed in several places (`buildShoppingList`, `activityCost`, page-level sums), so the number shown can differ by page.

## The plan

### 1. Richer, but small, data model

**Products** gain: `packSize`, `consumable | reusable | fixed` nature, `partyValue` (0–10), `diyAlternative` (a cheaper homemade stand-in with a prep-time cost), `convenience` flag (ready-made), and keep the existing `alternativeId`. No product data is duplicated — these are extra fields on the existing catalogue.

**Activities** gain: `partyValue`, `themeFit`, `venues`, `setupMinutes`, `equipment`, and — the key addition — **tiers**. Each activity has up to three versions (ready-made / simple DIY / involved DIY) with their own required and optional product ids, cost, prep time and effort. "Simplify this activity" then means "step down a tier or drop an optional component", not "delete it".

**Recipes** gain: `equipment`, `allergens`, `dietaryTags`, structured `ingredients` (quantity + unit + scaling rule + allergens), `prepMinutes`, make-ahead, ordered method, and a Bureau party tip.

**Equipment** becomes a tiny shared list with three levels: assumed household basic, specific, unusual. Both activities and recipes reference it.

**PartyDetails** gains `dietary: string[]` (None / Dairy / Egg / Gluten / Nuts / Peanuts / Sesame / Other).

### 2. Party-value model

Every element carries a value score and a category weight, with activities/entertainment weighted highest, then food, then cake/core, then practical supplies, then decoration. These are weights the optimiser reasons with, not fixed budget quotas — a particular party can spend more on decor if that is genuinely the best plan.

### 3. The optimiser (new `src/lib/engine.ts`)

1. **Candidate plan** — pick activities that fit age, theme, venue and duration, at the tier that matches the DIY setting; attach required products; add core tableware, cake and food.
2. **Cost** — one authoritative pass producing item, activity, category and party totals.
3. **If over budget** — generate concrete *moves*, each with a saving and a value cost:
   - drop an optional component of an activity (eucalyptus from the portrait corner)
   - step an activity down a tier (ready-made → simple DIY)
   - swap a product for its cheaper alternative or DIY version
   - drop a low-value optional decorative product
   - replace an expensive low-value activity with a cheaper high-value one
   - as a last resort, drop the lowest-value activity entirely
   Moves are ranked by saving ÷ value-cost, applied one at a time, re-costed after each, capped at a fixed iteration count so it always terminates.
4. **If under budget** — the reverse: spend the headroom on the highest value-per-dollar upgrades (reduce prep by stepping up a tier, restore a strong styling element, improve food) rather than adding random products.
5. **Result** — a single `PartyPlan` object containing inputs, chosen activities and tiers, products with quantities, food selection, timeline, all costs, and a list of the decisions made with reasons. That object is snapshot-shaped so Phase 4B can save and compare versions.

Everything is deterministic: fixed sort keys with explicit tie-breakers on id, no randomness, no reliance on array order.

### 4. Royal Portrait Corner — worked example

**$200 / Medium DIY:** kept at the ready-made tier — chiffon backdrop, balloon garland, eucalyptus. Strong finish, little prep.

**$150 / High DIY:** the engine costs the corner at $61.97 against a party value that does not justify it at this budget. It does not delete the activity — the photo keepsake is high value. It drops eucalyptus first (lowest incremental value), then steps the backdrop to its DIY version (fabric/streamer drape from the printables). The corner survives at roughly a third of the cost, the crown decorating and garden hunt are untouched, and the freed money keeps the food and cake intact. The result reads as a deliberately simpler party, not a stripped one.

**$150 / Low DIY:** DIY tiers are not available, so the engine must find its savings elsewhere — cheaper alternatives, fewer optional decorative purchases, possibly one fewer activity. It never silently pretends the parent chose High DIY.

### 5. Guest count, packs and buffers

Scaling becomes rule-based per product: fixed items stay at one, pack-size items round up to whole packs, per-child consumables scale with a sensible buffer, reusables stay at one. 10 → 15 children changes crowns from one pack to two, leaves the backdrop at one, and scales the food.

### 6. Allergies

`dietary` lives on the party, not on the Food page. The engine filters recipes and ingredients before the menu is built and substitutes where a safe swap exists, so no incompatible ingredient can appear anywhere in the plan. The Food page gets a simple chip row matching the existing Builder styling.

### 7. Everything reads one number

`buildShoppingList` is re-expressed on top of the engine so Dashboard, Shopping List, Preview, Activity details and Food all display the same authoritative totals, and the hard budget constraint is enforced against exactly that number.

## Files likely to change

`src/lib/products.ts`, `src/lib/plan.ts`, new `src/lib/engine.ts`, new `src/lib/equipment.ts`, `src/lib/party-store.tsx` (dietary field + plan memo), `src/routes/builder.tsx` (dietary input), `src/routes/food.tsx` (allergy chips, equipment, tips), and light read-only updates to `dashboard.tsx`, `shopping-list.tsx`, `activities.$activityId.tsx`, `timeline.$momentId.tsx`, `preview.tsx`. No visual redesign; no route changes.

## Verification

- **A** — Princess, 10 children, $200, Medium DIY: total ≤ $200, coherent activities, shopping list matches the plan.
- **B** — same at $150 High DIY: total ≤ $150, plan meaningfully different, DIY tiers used, high-value activities protected, decorative extras simplified first.
- **C** — $150 Low DIY: total ≤ $150, no fake DIY, party simplifies further instead.
- **D** — 10 → 15 children: packs round up, fixed items stay at one, totals recalculate.
- **E** — $150 → $200: headroom spent on reduced prep and stronger high-value elements, not filler.
- **F** — nut allergy: every recipe and ingredient across the whole food plan respects it.
- **G** — an oven-requiring recipe/activity surfaces its equipment requirement.
- **H** — Royal Portrait Corner simplifies component-by-component under pressure rather than disappearing.
- Plus: repeated runs of identical inputs produce byte-identical plans; existing to-do persistence, gating and checkout unlock still behave; typecheck clean; no console errors.

## Deferred

Plan variants and comparison, saved snapshots, the recommendation banner UI, sticky header/paywall polish, Buy/Borrow/Already-have inventory, quantity preferences ("keep a little extra"), PDFs and printables, payments, accounts.
