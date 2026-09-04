# Phase 3 — Better free preview & conversion experience

## What exists today (verified)

- `usePlan()` derives `timeline`, `activities`, `budget` (via `buildShoppingList`) and `todos` from one `PartyDetails` object. `plan.ts` also exports `productsForColor`, `productsByIds`, `activityCost`, `recipes`, `allergyNotes`.
- `useGate()` gives `unlocked / locked / limit(list, n) / hidden(list, n)`, locked until hydrated.
- Gating today is mostly "first N items, then a `LockedContinuation`". Two places are still all-or-nothing:
  - `/timeline/$momentId` — when locked it shows **only** a continuation block, no instructions, no preparation at all.
  - `/activities/$activityId` — same pattern.
- `/preview` shows a hardcoded palette list with no product connection, and its "locked" grid is four generic marketing lines, not real plan content.
- `/dashboard` shows details, progress, budget, 3 timeline moments and 4 section links — no activity or product taste.
- `/food` shows all dish names but full detail for only 1 recipe. `/shopping-list` shows 3 items + totals. `/todo` shows 3 tasks + progress.

Phase 2 architecture is preserved throughout. No new data source, no new routes, no duplicated planning logic.

## The Phase 3 principle

Every locked surface changes from "hidden" to "a real, complete-looking sample". Nothing is blurred. The paid value becomes **completeness and depth** (all moments, all steps, all quantities, all tasks), not access.

## Section by section: visible free vs locked

### Party / Dashboard
Free: child name, age, guest count, theme, venue, budget, date and start time (already there); progress; budget total and remaining; **interactive palette strip** (new, see below); first 3 timeline moments, now clearly clickable; **1 activity teaser card**; **3 shopping products with image, price and retailer**; the four section links.
Locked: the rest of the complete plan is gathered into **one main unlock/continuation block at the bottom of the Dashboard**. The curated samples above it are shown naturally as part of the overview; any "more" cues inside sections are subtle text links or short lines rather than prominent paywalls. This keeps the Dashboard feeling like a single coherent summary rather than a sequence of separate locked sections.

### Timeline detail (`/timeline/$momentId`) — biggest change
Free (replacing the current all-or-nothing block): time, end time, duration, title, what happens, **the first instruction step**, **the first 1–2 preparation items**, the linked activity link, and up to 2 related products with real price/retailer.
Locked: remaining instruction steps, remaining preparation, the related to-do list, and the remaining products for the moment. `moment.productIds` relationships stay untouched.

### Activities
List (free): every activity's name, age suitability, duration, effort, summary, `making` line ("what children actually do"), first 3 materials, and one product thumbnail from `productIds`. Currently the list itself is cut to 2 — instead show **all activity cards at summary depth** and lock the depth, which reads far more like a real plan.
Detail (free): summary, age/effort/duration, indicative cost, `making`, first preparation step, first 2 materials, related products.
Locked: full `preparation`, all `during` steps, `cleanup`, complete scaled materials.

### Palette → products (new interaction)
The four palette swatches (Warm ivory / Soft blush / Sage / Muted gold) become selectable. Selecting one calls the existing `productsForColor(details, color)` and renders matching products with `ProductCard` (image, name, price, retailer, affiliate link). A line under the results states these items feed the shopping list, with a link to `/shopping-list`. Same `Product` objects, same `priceFor` pricing — one catalogue, one budget engine.
This palette block lives in a new shared component so `/preview` and `/dashboard` both use it.

### Shopping list
Free: totals and budget remaining (full plan figures, unchanged), **4 real products** spread across categories rather than 3 from the top, each with image, quantity/need label, price, retailer, link; category totals for the whole list so the scope is visible.
Locked: the remaining items and their exact quantities.

### Food
Free: full menu by course with yields, **one complete recipe** (ingredients, method, make-ahead) plus **ingredient lists only** for a second dish, allergy notes.
Locked: methods, make-ahead timings and scaled quantities for the remaining dishes.

### To-do
Free: progress bar driven by the existing central `done` state (unchanged), **4 real tasks across different weeks** rather than the first 3, each with timing, note and its activity/timeline links.
Locked: the rest of the four-week schedule.

### Preview page
Becomes the curated sample rather than a teaser: hero, party details, interactive palette block, first 3 timeline moments now **clickable** into the detail route, one activity card, three shopping products, one recipe name row, then the single strongest unlock block listing what the complete plan adds.

### Edit details
A single quiet reassurance line beside the existing "Edit party details" link on Dashboard and Preview: "You can change these details anytime. Your plan will adjust." No new flow.

## Connections made explicit

- Palette → products: `productsForColor` → `ProductCard` → link to `/shopping-list`, same `Product` ids the budget engine consumes.
- Timeline → activity → products: moment detail links to its `activityId`; both render `productsByIds(details, productIds)`; those same products appear in the shopping list.
- To-do → products/activities/timeline links already exist and stay.

## Files

New:
- `src/components/PaletteProducts.tsx` — selectable swatches + product results.
- `src/components/ActivityCard.tsx` — the activity summary card, reused by Dashboard, Preview and the activities list.
- Possibly a small `ProductStrip` variant inside `ProductCard.tsx` for compact dashboard/preview use.

Modified:
- `src/routes/preview.tsx`, `dashboard.tsx`, `timeline.$momentId.tsx`, `activities.index.tsx`, `activities.$activityId.tsx`, `shopping-list.tsx`, `food.tsx`, `todo.tsx`
- `src/components/PartyBits.tsx` — allow a compact/inline `LockedContinuation` variant for use inside a section rather than only at the end of a page.
- `src/lib/gating.ts` — optionally add a `pick(list, n)` helper that samples across categories/weeks instead of always taking the first n. No change to unlock semantics.

Not touched: `party-store.tsx` state shape, `plan.ts` planning/budget logic, `products.ts`, `recipes`, pricing, checkout, routes list.

## Risks

- Showing more free content weakens the unlock if the split is too generous — the counts above are the lever, and they are all single constants, easy to tune after visual review.
- The Dashboard must end with one strong continuation block; individual section pages may still use their own continuation blocks because the user is exploring that specific section in depth. The risk is the Dashboard feeling like several paywalls — mitigated by the single bottom block and subtle inline "more" cues only.
- Palette interaction adds client state on a page that must stay stable before hydration — selection defaults to the first colour and renders identically on server and client.
- `productsForColor` ignores the budget engine's drops, so a palette product may not appear in the shopping list. Mitigation: label palette results as "matches your palette" rather than implying they are all in the list.

## Resulting journey

Builder → Preview shows a real, specific plan (their child, their palette, real products with prices) → they branch into any section and find useful, complete-feeling samples → every section ends by naming exactly what the full plan adds → $29 unlock turns the same pages into full depth, no new URLs, no re-navigation.
