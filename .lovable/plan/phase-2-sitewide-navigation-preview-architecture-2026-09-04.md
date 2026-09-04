# Phase 2 — Sitewide navigation & preview architecture

## What exists today

- `AppShell` (src/components/AppShell.tsx) already holds the only navigation: desktop header + mobile bottom bar with Party / To do / Shopping / Activities / Food. It is used by `/dashboard`, `/todo`, `/shopping-list`, `/activities/`, `/food`, and the two detail routes.
- `/preview` and `/checkout` each render their own bespoke header and no section navigation — this is the inconsistency to fix.
- The party store already tracks `unlocked` (persisted in localStorage, flipped at checkout), but **no route reads it**. Today every "paid" page is fully visible to everyone.
- `usePlan()` already derives timeline, todos, activities, budget/shopping and food from one party state. There is no second dataset to reconcile.

## Recommended architecture

### 1. One navigation component, two link sets

Extract the nav into `src/components/SectionNav.tsx` (header row + mobile bar), driven by the same `nav` array. `AppShell` keeps its current markup and renders it; `/preview` and `/checkout` get it too. No visual change.

Before unlock the nav points at the same five paths — not at separate `/preview/*` routes. That keeps one URL per section, so unlocking never moves the user to a "different app"; the same page simply gains its full content.

### 2. Preview vs unlocked = visibility level, not separate routes

Add a tiny helper (e.g. `useUnlockGate()` in `src/lib/party-store.tsx` or a new `src/lib/gating.ts`) returning `{ unlocked, limit(list, n) }`. Each section page renders the same `usePlan()` data and, when locked, shows the first N items plus a shared continuation block.

- `/dashboard` — overview, palette, first 3 timeline moments, party details; rest gated.
- `/todo` — first 2–3 tasks with their timing labels.
- `/shopping-list` — 3 products with image, price, retailer, link; totals summarised, remainder gated.
- `/activities` — 1–2 activity cards; detail route shows summary only, instructions gated.
- `/food` — menu list visible, one recipe's ingredients/prep visible, the rest gated.

Exact counts are Phase 3; the architecture only needs the gate + a slot.

### 3. Continuation block instead of a wall

Reuse and slightly extend `LockedNote` (src/components/PartyBits.tsx) into a `LockedContinuation` that states what remains ("+9 more items, complete quantities and retailers") above the existing $29 CTA. It renders *after* real content, never instead of it.

### 4. `/preview` stays as the curated landing for the free state

Keep it as the single "here is your plan" summary page reached from the builder, now with the section nav so users can branch into each section preview. Checkout keeps its own minimal chrome plus the nav.

## Files expected to change

- New: `src/components/SectionNav.tsx`, `LockedContinuation` in `src/components/PartyBits.tsx`, small gating helper.
- Modified: `AppShell.tsx`, `preview.tsx`, `checkout.tsx`, `dashboard.tsx`, `todo.tsx`, `shopping-list.tsx`, `activities.index.tsx`, `activities.$activityId.tsx`, `timeline.$momentId.tsx`, `food.tsx`, `party-store.tsx`.
- No router/route-tree changes, no new routes, no data changes.

## Risks

- `unlocked` lives only in localStorage, so gating is cosmetic — fine for a prototype, but worth flagging before real payments.
- Hydration: `unlocked` is read from localStorage after mount, so a locked/unlocked flash is possible. Handle by treating the first render as locked-until-hydrated.
- Progress bar and budget totals must keep counting the *full* plan even when the list is truncated, or the locked view will show misleading numbers.
- Detail routes (`/activities/$id`, `/timeline/$id`) are the easiest place to leak paid content — they need the gate too.

## Complexity

Moderate: roughly one focused implementation pass. The nav extraction and gate helper are small; most of the work is applying the gate consistently across nine route files without touching layout.
