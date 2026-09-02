import { products, productById, type Product, type Priority } from "./products";

export interface PartyDetails {
  childName: string;
  age: number;
  guests: number;
  venue: string;
  theme: string;
  budget: number;
  diy: string;
  date: string;
  startTime: string;
  durationHours: number;
}

export const defaultParty: PartyDetails = {
  childName: "Emma",
  age: 7,
  guests: 10,
  venue: "Backyard",
  theme: "Elegant Magical Princess",
  budget: 200,
  diy: "Low",
  date: "Saturday, October 11",
  startTime: "14:00",
  durationHours: 2.5,
};

/* ------------------------------------------------------------------ */
/* Quantities                                                          */
/* ------------------------------------------------------------------ */

export interface PricedProduct extends Product {
  /** Units to buy for this party. */
  units: number;
  lineTotal: number;
  /** Human-readable need, e.g. "10 crowns · 1 pack". */
  needLabel: string;
}

export function priceFor(product: Product, guests: number): PricedProduct {
  const units = product.coversChildren ? Math.max(1, Math.ceil(guests / product.coversChildren)) : 1;
  const lineTotal = Math.round(product.price * units * 100) / 100;
  const needLabel = product.coversChildren
    ? `${units} × ${product.unit}`
    : product.unit;
  return { ...product, units, lineTotal, needLabel };
}

/* ------------------------------------------------------------------ */
/* Activities — age aware                                              */
/* ------------------------------------------------------------------ */

export interface Activity {
  id: string;
  name: string;
  duration: string;
  effort: string;
  ageMin: number;
  ageMax: number;
  summary: string;
  making: string;
  /** Material quantities are calculated from the guest count. */
  materials: (guests: number) => string[];
  preparation: string[];
  during: string[];
  cleanup: string;
  productIds: string[];
  timelineId: string;
  todoIds: string[];
}

export const allActivities: Activity[] = [
  {
    id: "crown-decorating",
    name: "Royal crown decorating",
    duration: "20 min",
    effort: "Low prep",
    ageMin: 4,
    ageMax: 8,
    summary:
      "Guests personalise a plain gold crown with satin ribbon and adhesive gems as they arrive. It doubles as the welcome activity and the favor.",
    making: "A gold paper crown each, decorated with ribbon, gems and gold stars — worn for the rest of the party.",
    materials: (g) => [
      `${g} gold paper crowns`,
      `${g} small dishes of adhesive gems`,
      `${Math.ceil(g / 5)} packs of gold star stickers`,
      `${g} lengths of satin ribbon (24 in each)`,
      `${g} glue dots`,
      `${Math.ceil(g / 2)} fine markers, shared`,
    ],
    preparation: [
      "Cut ribbon into 24-inch lengths the night before, one per guest.",
      "Divide gems and stars into small dishes — one dish per two children.",
      "Set the welcome table with a crown, a dish and a marker at each place.",
      "Print the crown templates if you are making crowns yourself.",
    ],
    during: [
      "Greet each guest at the table and let them choose a ribbon colour.",
      "Show one finished crown as an example, then step back.",
      "Help with glue dots only — let them place the gems themselves.",
      "Write names inside each crown so nothing is lost later.",
    ],
    cleanup: "5 minutes — sweep gems into one tub, keep ribbon offcuts for the favor pouches.",
    productIds: ["gold-crowns", "craft-gems", "satin-ribbon"],
    timelineId: "arrival",
    todoIds: ["decor-kit", "printables"],
  },
  {
    id: "garden-hunt",
    name: "The Enchanted Garden hunt",
    duration: "25 min",
    effort: "Low prep",
    ageMin: 4,
    ageMax: 8,
    summary:
      "Hidden gems through the garden beds, one per guest, with a printed clue card read aloud between finds. No winners, no losers.",
    making: "A gentle, non-competitive hunt where every child finds exactly one treasure.",
    materials: (g) => [
      `${g} acrylic 'jewels' (one per child)`,
      `${g} clue cards, printed`,
      "1 collecting basket",
      "1 small tray for the reveal",
    ],
    preparation: [
      "Hide one jewel per child at eye height for the youngest guest.",
      "Print and cut the clue cards; number them in order.",
      "Walk the route once so you know where every jewel is.",
    ],
    during: [
      "Read clue one aloud to the whole group.",
      "Let children search in pairs; direct quietly so each child finds one.",
      "Pause between clues to count what has been found.",
      "Finish at the tea table so everyone sits down together.",
    ],
    cleanup: "10 minutes — check the beds for stray jewels before dark.",
    productIds: ["craft-gems"],
    timelineId: "hunt",
    todoIds: ["decor-kit", "printables"],
  },
  {
    id: "portrait-corner",
    name: "Royal portrait corner",
    duration: "Open",
    effort: "15 min setup",
    ageMin: 4,
    ageMax: 8,
    summary:
      "A simple blush and eucalyptus backdrop against the fence. Guests pose in their crowns; parents get one keepsake photo each.",
    making: "A photo corner that gives every parent one good picture to take home.",
    materials: (g) => [
      "1 chiffon backdrop drape or blush fabric",
      "2 bunches eucalyptus stems",
      "1 balloon garland kit",
      "6 command hooks",
      `${g} printed name tags (optional)`,
    ],
    preparation: [
      "Hang the drape the morning of, out of direct sun.",
      "Inflate the balloon garland the evening before and store indoors.",
      "Tuck eucalyptus along the garland at uneven intervals.",
    ],
    during: [
      "Take each child's portrait as they finish their crown.",
      "Do one group photo before cake, while everyone is still tidy.",
    ],
    cleanup: "10 minutes — the garland keeps for a week if you want it indoors after.",
    productIds: ["chiffon-backdrop", "eucalyptus-stems", "balloon-garland"],
    timelineId: "portrait",
    todoIds: ["decor-kit"],
  },
  {
    id: "quiet-corner",
    name: "Quiet corner",
    duration: "Open",
    effort: "No prep",
    ageMin: 4,
    ageMax: 6,
    summary:
      "A shaded blanket with storybooks for children who need a pause. Small detail, saves the middle of the party.",
    making: "A soft landing for the youngest guests halfway through the afternoon.",
    materials: () => ["1 picnic blanket", "2–3 storybooks", "Colouring sheets and crayons"],
    preparation: ["Lay the blanket in shade before guests arrive.", "Print the colouring sheets."],
    during: ["Point it out once at the start so children know it exists.", "Never send a child there — let them choose it."],
    cleanup: "2 minutes.",
    productIds: [],
    timelineId: "arrival",
    todoIds: [],
  },
  {
    id: "ribbon-wands",
    name: "Ribbon wand parade",
    duration: "20 min",
    effort: "Low prep",
    ageMin: 7,
    ageMax: 8,
    summary:
      "Older guests make ribbon wands, then lead a short parade around the garden to music before the tea table.",
    making: "A ribbon wand each, and two minutes of joyful noise before everyone sits down.",
    materials: (g) => [
      `${g} wooden dowels or sticks`,
      `${g} × 3 ribbon lengths (36 in)`,
      `${g} gold bells or charms`,
      "1 playlist, 10 minutes",
    ],
    preparation: ["Pre-tie the ribbon knots so children only decorate.", "Set up a speaker outside."],
    during: ["Everyone chooses three ribbons.", "Parade twice around the garden, then straight to the table."],
    cleanup: "5 minutes.",
    productIds: ["satin-ribbon", "craft-gems"],
    timelineId: "hunt",
    todoIds: ["decor-kit"],
  },
];

export const activitiesFor = (age: number) =>
  allActivities.filter((a) => age >= a.ageMin && age <= a.ageMax);

/* ------------------------------------------------------------------ */
/* Timeline — derived from start time and duration                     */
/* ------------------------------------------------------------------ */

export interface TimelineMoment {
  id: string;
  title: string;
  detail: string;
  /** Share of the party length. */
  share: number;
  lengthMin: number;
  instructions: string[];
  prepare: string[];
  productIds: string[];
  todoIds: string[];
  activityId?: string;
  time?: string;
  endTime?: string;
}

const timelineTemplate: TimelineMoment[] = [
  {
    id: "arrival",
    title: "Arrival & crown decorating",
    detail: "Guests choose a ribbon and gold crown at the welcome table.",
    share: 0,
    lengthMin: 25,
    instructions: [
      "Open the gate and greet each family at the welcome table.",
      "Hand every child a crown and let them decorate while the group gathers.",
      "Keep drinks poured — arrivals always spread over fifteen minutes.",
    ],
    prepare: ["Set the crown stations", "Divide gems and ribbon", "Chill the drinks"],
    productIds: ["gold-crowns", "craft-gems", "satin-ribbon"],
    todoIds: ["decor-kit", "printables"],
    activityId: "crown-decorating",
  },
  {
    id: "portrait",
    title: "Royal portrait moment",
    detail: "A two-minute photo at the blush and eucalyptus backdrop.",
    share: 0.17,
    lengthMin: 20,
    instructions: [
      "Photograph each child in their finished crown.",
      "Take one group shot before anyone eats.",
    ],
    prepare: ["Hang the backdrop", "Inflate the balloon garland the night before"],
    productIds: ["chiffon-backdrop", "balloon-garland", "eucalyptus-stems"],
    todoIds: ["decor-kit"],
    activityId: "portrait-corner",
  },
  {
    id: "hunt",
    title: "The Enchanted Garden hunt",
    detail: "Hidden gems in the garden beds, one per guest, with clue cards.",
    share: 0.3,
    lengthMin: 30,
    instructions: [
      "Gather everyone and read the first clue aloud.",
      "Guide quietly so every child finds exactly one jewel.",
      "Count the finds together and move to the table.",
    ],
    prepare: ["Hide the jewels", "Print and cut clue cards"],
    productIds: ["craft-gems"],
    todoIds: ["printables"],
    activityId: "garden-hunt",
  },
  {
    id: "tea",
    title: "The tea table",
    detail: "Seated snack service with lemonade in glass cups.",
    share: 0.5,
    lengthMin: 30,
    instructions: [
      "Seat children at their place cards — it settles the room instantly.",
      "Serve sandwiches first, then fruit, then popcorn cones.",
      "Pour lemonade from a pitcher rather than a dispenser.",
    ],
    prepare: ["Set the table", "Assemble sandwiches", "Fill popcorn cones 30 min ahead"],
    productIds: ["ivory-tablecloth", "scalloped-plates", "blush-napkins", "gold-rim-cups", "groceries"],
    todoIds: ["table-set", "prep-food", "drinks"],
  },
  {
    id: "cake",
    title: "Cake & wish",
    detail: "Single-tier cake with gold taper candles.",
    share: 0.7,
    lengthMin: 20,
    instructions: [
      "Dim nothing, simply gather everyone around the table.",
      "Light the tapers, sing once, cut into even slices.",
    ],
    prepare: ["Collect the cake", "Have a lighter and cake knife ready"],
    productIds: ["cake", "gold-tapers", "scalloped-plates"],
    todoIds: ["cake"],
  },
  {
    id: "farewell",
    title: "Favor farewell",
    detail: "Each guest leaves with a keepsake pouch and their crown.",
    share: 0.88,
    lengthMin: 15,
    instructions: [
      "Fill pouches during the cake so they are ready at the gate.",
      "Return each crown with the pouch as families leave.",
    ],
    prepare: ["Fill the favor pouches", "Match the count to final RSVPs"],
    productIds: ["favor-pouches", "gold-crowns"],
    todoIds: ["headcount"],
  },
];

function addMinutes(start: string, minutes: number) {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  const suffix = hh >= 12 ? "PM" : "AM";
  const display = hh % 12 === 0 ? 12 : hh % 12;
  return `${display}:${String(mm).padStart(2, "0")} ${suffix}`;
}

export function timelineFor(details: PartyDetails): TimelineMoment[] {
  const total = details.durationHours * 60;
  return timelineTemplate.map((m) => {
    const offset = Math.round((m.share * total) / 5) * 5;
    return {
      ...m,
      time: addMinutes(details.startTime, offset),
      endTime: addMinutes(details.startTime, offset + m.lengthMin),
    };
  });
}

export const timelineMomentById = (details: PartyDetails, id: string) =>
  timelineFor(details).find((m) => m.id === id);

/* ------------------------------------------------------------------ */
/* To-do schedule                                                      */
/* ------------------------------------------------------------------ */

export interface TodoTask {
  id: string;
  task: string;
  due: string;
  week: string;
  note: (d: PartyDetails) => string;
  productIds: string[];
  activityIds: string[];
  timelineIds: string[];
}

export const allTodos: TodoTask[] = [
  {
    id: "invites",
    task: "Send digital invitations",
    due: "4 weeks before",
    week: "4 weeks before",
    note: (d) => `${d.guests} guests · RSVP one week ahead`,
    productIds: [],
    activityIds: [],
    timelineIds: [],
  },
  {
    id: "cake",
    task: "Order the cake",
    due: "3 weeks before",
    week: "3 weeks before",
    note: (d) => `Single tier, ivory buttercream, serves ${d.guests + 4}`,
    productIds: ["cake", "gold-tapers"],
    activityIds: [],
    timelineIds: ["cake"],
  },
  {
    id: "decor-kit",
    task: "Order the decor & activity kit",
    due: "2 weeks before",
    week: "2 weeks before",
    note: () => "Balloon garland, crowns, gems, ribbon, linens",
    productIds: ["balloon-garland", "gold-crowns", "craft-gems", "satin-ribbon", "ivory-tablecloth"],
    activityIds: ["crown-decorating", "portrait-corner"],
    timelineIds: ["arrival", "portrait"],
  },
  {
    id: "printables",
    task: "Print place cards, crowns & clue cards",
    due: "1 week before",
    week: "1 week before",
    note: (d) => `${d.guests} clue cards, ${d.guests} place cards`,
    productIds: ["gold-crowns", "favor-pouches"],
    activityIds: ["crown-decorating", "garden-hunt"],
    timelineIds: ["arrival", "hunt"],
  },
  {
    id: "headcount",
    task: "Confirm final headcount",
    due: "3 days before",
    week: "Party week",
    note: (d) => `Adjust favors to match — currently ${d.guests}`,
    productIds: ["favor-pouches"],
    activityIds: [],
    timelineIds: ["farewell"],
  },
  {
    id: "prep-food",
    task: "Shop groceries & bake ahead",
    due: "2 days before",
    week: "Party week",
    note: () => "See the recipes for exact quantities",
    productIds: ["groceries"],
    activityIds: [],
    timelineIds: ["tea"],
  },
  {
    id: "table-set",
    task: "Set the tea table",
    due: "Morning of",
    week: "Party day",
    note: () => "45 minutes — linens, plates, napkins, greenery",
    productIds: ["ivory-tablecloth", "scalloped-plates", "blush-napkins", "eucalyptus-stems"],
    activityIds: [],
    timelineIds: ["tea"],
  },
  {
    id: "drinks",
    task: "Chill drinks & prep fruit",
    due: "2 hours before",
    week: "Party day",
    note: () => "Keep covered until service",
    productIds: ["gold-rim-cups", "groceries"],
    activityIds: [],
    timelineIds: ["tea"],
  },
];

/* ------------------------------------------------------------------ */
/* Food — recipes with calculated quantities, no retailer              */
/* ------------------------------------------------------------------ */

export interface Recipe {
  id: string;
  course: string;
  name: string;
  yield: (d: PartyDetails) => string;
  ingredients: (d: PartyDetails) => string[];
  method: string[];
  makeAhead: string;
}

export const recipes: Recipe[] = [
  {
    id: "tea-sandwiches",
    course: "Tea table",
    name: "Princess tea sandwiches",
    yield: (d) => `${d.guests * 2} halves`,
    ingredients: (d) => [
      `${Math.ceil(d.guests / 8)} loaf/loaves soft white bread`,
      `${Math.ceil(d.guests * 0.8)} oz cream cheese`,
      `${Math.ceil(d.guests / 5)} cucumbers`,
      "Butter, softened",
      "Sea salt",
    ],
    method: [
      "Butter every slice to the edges so the filling doesn't soak in.",
      "Spread cream cheese, layer thin cucumber, season lightly.",
      "Trim the crusts, cut into triangles, cover with a damp cloth.",
    ],
    makeAhead: "Make the morning of; keep covered and chilled.",
  },
  {
    id: "strawberry-fingers",
    course: "Tea table",
    name: "Strawberry & butter finger sandwiches",
    yield: (d) => `${d.guests * 2} fingers`,
    ingredients: (d) => [
      `${Math.ceil(d.guests / 10)} loaf/loaves soft white bread`,
      `${Math.ceil(d.guests * 1.5)} strawberries`,
      "Salted butter",
      "1 tsp caster sugar",
    ],
    method: ["Butter the bread.", "Layer thin strawberry slices, dust with sugar.", "Trim and cut into fingers."],
    makeAhead: "Assemble two hours ahead at most.",
  },
  {
    id: "fruit-skewers",
    course: "Tea table",
    name: "Fruit skewers with berries and melon",
    yield: (d) => `${d.guests} skewers`,
    ingredients: (d) => [
      `${d.guests} short wooden skewers`,
      `${Math.ceil(d.guests / 5)} punnets strawberries`,
      `${Math.ceil(d.guests / 8)} melon`,
      `${Math.ceil(d.guests / 6)} punnets grapes`,
    ],
    method: ["Cut melon into cubes.", "Thread berry, melon, grape, repeat.", "Chill flat on a tray."],
    makeAhead: "Assemble the night before, cover tightly.",
  },
  {
    id: "crown-cookies",
    course: "Sweet",
    name: "Shortbread crown cookies",
    yield: (d) => `${d.guests + 6} cookies`,
    ingredients: (d) => [
      `${Math.ceil((d.guests + 6) / 12)} × 250 g butter`,
      `${Math.ceil((d.guests + 6) / 12)} × 125 g caster sugar`,
      `${Math.ceil((d.guests + 6) / 12)} × 375 g plain flour`,
      "Edible gold dust",
    ],
    method: [
      "Cream butter and sugar, fold in flour, chill 30 minutes.",
      "Roll to 6 mm, cut crowns, bake 12–14 min at 340°F.",
      "Brush the points with gold dust once cool.",
    ],
    makeAhead: "Bake two days ahead, store airtight.",
  },
  {
    id: "lemonade",
    course: "Drinks",
    name: "Cloudy lemonade",
    yield: (d) => `${Math.ceil(d.guests * 0.4)} L`,
    ingredients: (d) => [
      `${Math.ceil(d.guests * 0.6)} lemons`,
      `${Math.ceil(d.guests * 20)} g sugar`,
      "Still water, ice",
      "Mint to finish",
    ],
    method: ["Warm juice and sugar until dissolved.", "Top with water, chill.", "Serve from a pitcher over ice."],
    makeAhead: "Make the day before.",
  },
];

export const allergyNotes = [
  "Every recipe above is nut-free by default.",
  "For dairy-free, use oat spread and sorbet cups in place of butter and cream cheese.",
  "Ask about allergies in the invitation, not on the day.",
];

/* ------------------------------------------------------------------ */
/* Budget engine — the budget is a hard constraint                     */
/* ------------------------------------------------------------------ */

export interface BudgetResult {
  items: PricedProduct[];
  skipped: PricedProduct[];
  total: number;
  remaining: number;
  byCategory: { category: string; total: number }[];
  budget: number;
}

const priorityRank: Record<Priority, number> = { optional: 0, recommended: 1, essential: 2 };

export function buildShoppingList(details: PartyDetails): BudgetResult {
  const relevant = products.filter((p) => p.themes.includes(details.theme));
  const activityIds = new Set(activitiesFor(details.age).map((a) => a.id));

  // Keep products that are either not activity-bound, or bound to an activity
  // that suits this child's age.
  const suitable = relevant.filter(
    (p) => p.activityIds.length === 0 || p.activityIds.some((id) => activityIds.has(id)),
  );

  let kept = suitable.map((p) => priceFor(p, details.guests));
  const skipped: PricedProduct[] = [];

  const sum = (list: PricedProduct[]) => Math.round(list.reduce((s, i) => s + i.lineTotal, 0) * 100) / 100;

  // Drop the least important, most expensive items until we fit the budget.
  while (sum(kept) > details.budget) {
    const droppable = kept
      .filter((i) => i.priority !== "essential")
      .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || b.lineTotal - a.lineTotal);
    if (droppable.length === 0) break;
    const drop = droppable[0];
    kept = kept.filter((i) => i.id !== drop.id);
    skipped.push(drop);
  }

  const total = sum(kept);
  const byCategory = Array.from(new Set(kept.map((i) => i.category))).map((category) => ({
    category,
    total: Math.round(kept.filter((i) => i.category === category).reduce((s, i) => s + i.lineTotal, 0) * 100) / 100,
  }));

  return {
    items: kept,
    skipped,
    total,
    remaining: Math.round((details.budget - total) * 100) / 100,
    byCategory,
    budget: details.budget,
  };
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Products for a given palette colour, priced for this party. */
export function productsForColor(details: PartyDetails, color: string): PricedProduct[] {
  return products
    .filter((p) => p.colors.includes(color as never) && !p.generic && p.themes.includes(details.theme))
    .map((p) => priceFor(p, details.guests));
}

export function productsByIds(details: PartyDetails, ids: string[]): PricedProduct[] {
  return ids
    .map((id) => productById(id))
    .filter((p): p is Product => Boolean(p))
    .map((p) => priceFor(p, details.guests));
}

/** Cost of the products an activity needs. */
export function activityCost(details: PartyDetails, ids: string[]) {
  return productsByIds(details, ids).reduce((s, p) => s + p.lineTotal, 0);
}
