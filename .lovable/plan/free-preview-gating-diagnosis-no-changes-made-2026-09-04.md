# Free Preview gating — diagnosis (no changes made)

I inspected the running app as a locked (not-unlocked) visitor and opened every route directly, including the ones no link points to. Summary up front: the deep content of extra activities and extra recipes is **not** reachable — those detail pages already stop at an unlock block. What *is* leaking is the surrounding breadth: the Food page lists every dish with its shopping/prep details, some later timeline moments still hand out preparation steps and products, and a locked activity can still be reached by a link from a timeline moment.

## 1. Where the gating lives

- `src/lib/party-store.tsx` — holds `unlocked` plus `hydrated`, saved in the browser.
- `src/lib/gating.ts` (`useGate()`) — the single free/paid helper: `locked`, `unlocked`, `limit(list, n)`, `spread`, `hidden`. Treats the plan as locked until the saved state has loaded, so paid content never flashes.
- Every page uses it: Party overview, Preview, Activities, Activity detail, Food, Recipe detail, Timeline detail, Shopping list, To-do.

## 2. Activities — what I actually observed

Locked visitor:

- `/activities` shows exactly one activity card (Royal crown decorating), in full, plus one "More activity ideas" block. Correct.
- `/activities/garden-hunt` and `/activities/portrait-corner` opened directly show only the title, one-line summary and an unlock block. No steps, materials, products. Correct.
- Party overview and Preview each link to only the one free activity. Correct.

The one real hole: **`/timeline/hunt` renders a link to `/activities/garden-hunt`** ("This moment uses The Enchanted Garden hunt"). It doesn't expose the content, but it's a clickable route into a paid activity, which reads as a dead end.

## 3. Recipes / Food — what I actually observed

- `/recipes/crown-cookies`, `/recipes/lemonade` opened directly: name, course, yield and an unlock block only. Correct.
- Party overview and Preview show four menu lines, first one clickable, rest blurred and locked. Correct.
- **`/food` is the leak.** It lists *every* dish across all courses with name, yield, equipment and prep time, prints the full first recipe, and gives no cap at four items. It also never links to `/recipes/...`, so the one free recipe is only fully readable inline there — inconsistent with the overview.

## 4. Timeline (same class of leak, worth naming)

`/timeline/farewell` and `/timeline/tea`, opened directly, still show one instruction, **two preparation steps and up to two products with prices** for moments that aren't part of the free three. That's paid breadth handed out through a direct route.

## 5. Why it looks like "everything is exposed"

The per-item detail pages were gated, but the *list* surfaces were not brought to the same rule. Free means "one complete activity + one complete recipe + the existence of the rest"; the Food page is still built on the older "show all, trim the detail" idea, and timeline detail gates by trimming rather than by which moments are free.

## 6. Smallest correction (one build, no architecture change)

1. **Food page** (`src/routes/food.tsx`): while locked, show only the first four dishes; make the first one a link to its recipe page and render the remaining three as blurred/locked lines exactly like the overview does; drop the inline full recipe body and per-dish equipment/prep for the locked ones; keep the allergies control, the intro and one continuation block.
2. **Timeline detail** (`src/routes/timeline.$momentId.tsx`): while locked, treat moments outside the free first three like locked activities — title, time, one-line description, unlock block; no preparation, no products. Keep the current behaviour for the free moments.
3. **Timeline → activity link**: render the "This moment uses …" link only when that activity is the free one or the plan is unlocked; otherwise plain text.
4. **Locked activity/recipe detail pages**: no change needed — they already behave correctly.

Nothing else needs touching: the planning engine, product data, Builder, unlock flow and visual design stay as they are.
