import { products, productById, type Product, type Priority } from "./products";

/* ------------------------------------------------------------------ */
/* Party constraints — the single set of inputs the engine plans from  */
/* ------------------------------------------------------------------ */

export type DiyLevel = "Low" | "Medium" | "High";

export type Allergen = "dairy" | "egg" | "gluten" | "nuts" | "peanuts" | "sesame" | "other";

export const dietaryOptions: { key: Allergen; label: string }[] = [
  { key: "dairy", label: "Dairy" },
  { key: "egg", label: "Egg" },
  { key: "gluten", label: "Gluten" },
  { key: "nuts", label: "Nuts" },
  { key: "peanuts", label: "Peanuts" },
  { key: "sesame", label: "Sesame" },
  { key: "other", label: "Other" },
];

export const dietaryLabel = (a: Allergen) =>
  dietaryOptions.find((o) => o.key === a)?.label ?? a;

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
  /** Party-wide dietary constraints. Empty = none. */
  dietary: Allergen[];
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
  dietary: [],
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
  /** True when the planner chose the homemade version of this item. */
  diyChosen?: boolean;
}

/**
 * Quantity rules. Fixed and reusable items stay at one however many children
 * come; consumables round up to whole packs and carry a small buffer so
 * nothing runs out on the day.
 */
export function unitsFor(product: Product, guests: number): number {
  if (product.nature !== "consumable" || !product.coversChildren) return 1;
  const needed = guests + (product.buffer ?? 0);
  return Math.max(1, Math.ceil(needed / product.coversChildren));
}

export function priceFor(product: Product, guests: number, diyChosen = false): PricedProduct {
  const units = unitsFor(product, guests);
  const unitPrice = diyChosen && product.diy ? product.diy.price : product.price;
  const lineTotal = Math.round(unitPrice * units * 100) / 100;
  const needLabel =
    product.nature === "consumable" && product.coversChildren
      ? `${units} × ${product.unit}`
      : product.unit;
  return {
    ...product,
    name: diyChosen && product.diy ? product.diy.name : product.name,
    price: unitPrice,
    units,
    lineTotal,
    needLabel,
    diyChosen,
  };
}

/* ------------------------------------------------------------------ */
/* Activities — age, venue, theme and DIY aware                        */
/* ------------------------------------------------------------------ */

/**
 * Each activity exists at more than one level of effort. The engine picks the
 * tier that matches the parent's DIY preference, and may step it down when the
 * budget is tight — simplifying an activity rather than deleting it.
 */
export interface ActivityTier {
  id: "ready" | "simple";
  label: string;
  /** Without these the activity does not work. */
  requiredProductIds: string[];
  /** Nice to have — the first thing budget pressure removes. */
  optionalProductIds: string[];
  prepMinutes: number;
  effort: string;
  note: string;
}

export interface Activity {
  id: string;
  name: string;
  duration: string;
  durationMin: number;
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

  /* ---- planning metadata ---- */
  /** 0–10: how much of the party the children will remember. */
  partyValue: number;
  priority: Priority;
  themes: string[];
  /** Venues this works in. */
  venues: string[];
  setupMinutes: number;
  equipment: string[];
  tiers: ActivityTier[];
}

const THEME = "Elegant Magical Princess";

export const allActivities: Activity[] = [
  {
    id: "crown-decorating",
    name: "Royal crown decorating",
    duration: "20 min",
    durationMin: 20,
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
    partyValue: 9,
    priority: "essential",
    themes: [THEME],
    venues: ["Home", "Backyard", "Park"],
    setupMinutes: 15,
    equipment: ["scissors", "bowls"],
    tiers: [
      {
        id: "ready",
        label: "Ready-made crowns",
        requiredProductIds: ["gold-crowns", "craft-gems"],
        optionalProductIds: ["satin-ribbon"],
        prepMinutes: 25,
        effort: "Low prep",
        note: "Crowns arrive finished — you only divide the gems and ribbon.",
      },
      {
        id: "simple",
        label: "Cut-at-home crowns",
        requiredProductIds: ["craft-gems"],
        optionalProductIds: ["satin-ribbon"],
        prepMinutes: 70,
        effort: "An evening of prep",
        note: "Print the Bureau template onto gold card and cut the crowns yourself.",
      },
    ],
  },
  {
    id: "garden-hunt",
    name: "The Enchanted Garden hunt",
    duration: "25 min",
    durationMin: 25,
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
    partyValue: 8,
    priority: "recommended",
    themes: [THEME],
    venues: ["Backyard", "Park", "Home"],
    setupMinutes: 20,
    equipment: ["scissors"],
    tiers: [
      {
        id: "ready",
        label: "Printed clue cards & jewels",
        requiredProductIds: ["craft-gems"],
        optionalProductIds: [],
        prepMinutes: 30,
        effort: "Low prep",
        note: "Hide the jewels and print the cards.",
      },
      {
        id: "simple",
        label: "Handwritten clues",
        requiredProductIds: ["craft-gems"],
        optionalProductIds: [],
        prepMinutes: 40,
        effort: "Low prep",
        note: "Write the clues by hand on card — children love the handwriting.",
      },
    ],
  },
  {
    id: "portrait-corner",
    name: "Royal portrait corner",
    duration: "Open",
    durationMin: 20,
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
    partyValue: 7,
    priority: "recommended",
    themes: [THEME],
    venues: ["Home", "Backyard"],
    setupMinutes: 30,
    equipment: ["command-hooks", "balloon-pump"],
    tiers: [
      {
        id: "ready",
        label: "Full styled corner",
        requiredProductIds: ["chiffon-backdrop"],
        optionalProductIds: ["balloon-garland", "eucalyptus-stems"],
        prepMinutes: 45,
        effort: "15 min setup",
        note: "Drape, garland and greenery — the strongest visual finish.",
      },
      {
        id: "simple",
        label: "Fabric drape corner",
        requiredProductIds: [],
        optionalProductIds: ["balloon-garland", "eucalyptus-stems"],
        prepMinutes: 60,
        effort: "30 min setup",
        note: "Pin a plain blush sheet to the fence and dress it with what you have.",
      },
    ],
  },
  {
    id: "quiet-corner",
    name: "Quiet corner",
    duration: "Open",
    durationMin: 15,
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
    partyValue: 5,
    priority: "optional",
    themes: [THEME],
    venues: ["Home", "Backyard", "Park"],
    setupMinutes: 5,
    equipment: [],
    tiers: [
      {
        id: "ready",
        label: "Blanket & books",
        requiredProductIds: [],
        optionalProductIds: [],
        prepMinutes: 10,
        effort: "No prep",
        note: "Uses what you already own.",
      },
    ],
  },
  {
    id: "ribbon-wands",
    name: "Ribbon wand parade",
    duration: "20 min",
    durationMin: 20,
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
    partyValue: 6,
    priority: "optional",
    themes: [THEME],
    venues: ["Backyard", "Park"],
    setupMinutes: 15,
    equipment: ["speaker", "scissors"],
    tiers: [
      {
        id: "ready",
        label: "Ribbon & charms",
        requiredProductIds: ["satin-ribbon"],
        optionalProductIds: ["craft-gems"],
        prepMinutes: 30,
        effort: "Low prep",
        note: "Ribbon spools and garden sticks.",
      },
      {
        id: "simple",
        label: "Streamer wands",
        requiredProductIds: [],
        optionalProductIds: ["craft-gems"],
        prepMinutes: 45,
        effort: "Low prep",
        note: "Crepe streamers on sticks from the garden.",
      },
    ],
  },
];

/** Legacy age filter — kept for callers that only need age suitability. */
export const activitiesFor = (age: number) =>
  allActivities.filter((a) => age >= a.ageMin && age <= a.ageMax);

/** Everything the engine may choose from for this party, before costing. */
export function eligibleActivities(details: PartyDetails): Activity[] {
  return allActivities
    .filter(
      (a) =>
        details.age >= a.ageMin &&
        details.age <= a.ageMax &&
        a.themes.includes(details.theme) &&
        a.venues.includes(details.venue),
    )
    .sort((a, b) => b.partyValue - a.partyValue || a.id.localeCompare(b.id));
}

export const activityById = (id: string) => allActivities.find((a) => a.id === id);

/** The tier a DIY preference starts from, before any budget pressure. */
export function preferredTier(activity: Activity, diy: string): ActivityTier {
  const ready = activity.tiers.find((t) => t.id === "ready");
  const simple = activity.tiers.find((t) => t.id === "simple");
  if (diy === "High") return simple ?? ready ?? activity.tiers[0]!;
  return ready ?? simple ?? activity.tiers[0]!;
}

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
  const [h = 0, m = 0] = start.split(":").map(Number);
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
    note: (d) => `${d.guests} children invited · RSVP one week ahead`,
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
/* Food — structured recipes with allergens, equipment and a tip       */
/* ------------------------------------------------------------------ */

export interface Ingredient {
  id: string;
  label: (d: PartyDetails) => string;
  allergens: Allergen[];
  /** A safe replacement when one of `allergens` is on the party's list. */
  swap?: { label: (d: PartyDetails) => string; allergens: Allergen[] };
}

export interface Recipe {
  id: string;
  course: string;
  name: string;
  yield: (d: PartyDetails) => string;
  items: Ingredient[];
  equipment: string[];
  prepMinutes: number;
  method: string[];
  makeAhead: string;
  /** A Celebration Bureau flourish — something that makes the party better. */
  tip: string;
}

export const recipes: Recipe[] = [
  {
    id: "tea-sandwiches",
    course: "Tea table",
    name: "Princess tea sandwiches",
    yield: (d) => `${d.guests * 2} halves`,
    items: [
      {
        id: "bread",
        label: (d) => `${Math.ceil(d.guests / 8)} loaf/loaves soft white bread`,
        allergens: ["gluten"],
        swap: { label: (d) => `${Math.ceil(d.guests / 8)} loaf/loaves gluten-free white bread`, allergens: [] },
      },
      {
        id: "cream-cheese",
        label: (d) => `${Math.ceil(d.guests * 0.8)} oz cream cheese`,
        allergens: ["dairy"],
        swap: { label: (d) => `${Math.ceil(d.guests * 0.8)} oz oat-based soft spread`, allergens: [] },
      },
      { id: "cucumber", label: (d) => `${Math.ceil(d.guests / 5)} cucumbers`, allergens: [] },
      {
        id: "butter",
        label: () => "Butter, softened",
        allergens: ["dairy"],
        swap: { label: () => "Dairy-free spread, softened", allergens: [] },
      },
      { id: "salt", label: () => "Sea salt", allergens: [] },
    ],
    equipment: ["knife", "utensils", "fridge"],
    prepMinutes: 30,
    method: [
      "Butter every slice to the edges so the filling doesn't soak in.",
      "Spread cream cheese, layer thin cucumber, season lightly.",
      "Trim the crusts, cut into triangles, cover with a damp cloth.",
    ],
    makeAhead: "Make the morning of; keep covered and chilled.",
    tip: "Cut two of every four into crown shapes with a cookie cutter — children reach for those first.",
  },
  {
    id: "strawberry-fingers",
    course: "Tea table",
    name: "Strawberry & butter finger sandwiches",
    yield: (d) => `${d.guests * 2} fingers`,
    items: [
      {
        id: "bread",
        label: (d) => `${Math.ceil(d.guests / 10)} loaf/loaves soft white bread`,
        allergens: ["gluten"],
        swap: { label: (d) => `${Math.ceil(d.guests / 10)} loaf/loaves gluten-free bread`, allergens: [] },
      },
      { id: "strawberries", label: (d) => `${Math.ceil(d.guests * 1.5)} strawberries`, allergens: [] },
      {
        id: "butter",
        label: () => "Salted butter",
        allergens: ["dairy"],
        swap: { label: () => "Salted dairy-free spread", allergens: [] },
      },
      { id: "sugar", label: () => "1 tsp caster sugar", allergens: [] },
    ],
    equipment: ["knife", "utensils"],
    prepMinutes: 20,
    method: ["Butter the bread.", "Layer thin strawberry slices, dust with sugar.", "Trim and cut into fingers."],
    makeAhead: "Assemble two hours ahead at most.",
    tip: "A whisper of vanilla in the butter makes these taste like a bakery.",
  },
  {
    id: "fruit-skewers",
    course: "Tea table",
    name: "Fruit skewers with berries and melon",
    yield: (d) => `${d.guests} skewers`,
    items: [
      { id: "skewers", label: (d) => `${d.guests} short wooden skewers`, allergens: [] },
      { id: "strawberries", label: (d) => `${Math.ceil(d.guests / 5)} punnets strawberries`, allergens: [] },
      { id: "melon", label: (d) => `${Math.ceil(d.guests / 8)} melon`, allergens: [] },
      { id: "grapes", label: (d) => `${Math.ceil(d.guests / 6)} punnets grapes`, allergens: [] },
    ],
    equipment: ["knife", "tray", "fridge"],
    prepMinutes: 25,
    method: ["Cut melon into cubes.", "Thread berry, melon, grape, repeat.", "Chill flat on a tray."],
    makeAhead: "Assemble the night before, cover tightly.",
    tip: "Blunt the skewer points with scissors before the youngest guests arrive.",
  },
  {
    id: "crown-cookies",
    course: "Sweet",
    name: "Shortbread crown cookies",
    yield: (d) => `${d.guests + 6} cookies`,
    items: [
      {
        id: "butter",
        label: (d) => `${Math.ceil((d.guests + 6) / 12)} × 250 g butter`,
        allergens: ["dairy"],
        swap: { label: (d) => `${Math.ceil((d.guests + 6) / 12)} × 250 g dairy-free block`, allergens: [] },
      },
      { id: "sugar", label: (d) => `${Math.ceil((d.guests + 6) / 12)} × 125 g caster sugar`, allergens: [] },
      {
        id: "flour",
        label: (d) => `${Math.ceil((d.guests + 6) / 12)} × 375 g plain flour`,
        allergens: ["gluten"],
        swap: { label: (d) => `${Math.ceil((d.guests + 6) / 12)} × 375 g gluten-free flour blend`, allergens: [] },
      },
      { id: "gold-dust", label: () => "Edible gold dust", allergens: [] },
    ],
    equipment: ["oven", "mixer", "tray", "bowls"],
    prepMinutes: 50,
    method: [
      "Cream butter and sugar, fold in flour, chill 30 minutes.",
      "Roll to 6 mm, cut crowns, bake 12–14 min at 340°F.",
      "Brush the points with gold dust once cool.",
    ],
    makeAhead: "Bake two days ahead, store airtight.",
    tip: "Add edible pearls or a light sprinkle just before serving — it costs nothing and reads as expensive.",
  },
  {
    id: "lemonade",
    course: "Drinks",
    name: "Cloudy lemonade",
    yield: (d) => `${Math.ceil(d.guests * 0.4)} L`,
    items: [
      { id: "lemons", label: (d) => `${Math.ceil(d.guests * 0.6)} lemons`, allergens: [] },
      { id: "sugar", label: (d) => `${Math.ceil(d.guests * 20)} g sugar`, allergens: [] },
      { id: "water", label: () => "Still water, ice", allergens: [] },
      { id: "mint", label: () => "Mint to finish", allergens: [] },
    ],
    equipment: ["saucepan", "pitcher", "fridge"],
    prepMinutes: 20,
    method: ["Warm juice and sugar until dissolved.", "Top with water, chill.", "Serve from a pitcher over ice."],
    makeAhead: "Make the day before.",
    tip: "Freeze a few strawberries into the ice cubes — the pitcher becomes part of the styling.",
  },
];

/** A recipe resolved against the party's dietary constraints. */
export interface PlannedRecipe extends Recipe {
  ingredients: string[];
  /** Ingredients that were replaced to respect the party's constraints. */
  substitutions: string[];
  /** True when no safe version of this dish exists for this party. */
  excluded: boolean;
}

export function planRecipe(recipe: Recipe, details: PartyDetails): PlannedRecipe {
  const avoid = details.dietary;
  const ingredients: string[] = [];
  const substitutions: string[] = [];
  let excluded = false;

  for (const item of recipe.items) {
    const clash = item.allergens.some((a) => avoid.includes(a));
    if (!clash) {
      ingredients.push(item.label(details));
      continue;
    }
    if (item.swap && !item.swap.allergens.some((a) => avoid.includes(a))) {
      ingredients.push(item.swap.label(details));
      substitutions.push(`${item.label(details)} → ${item.swap.label(details)}`);
      continue;
    }
    excluded = true;
  }

  return { ...recipe, ingredients, substitutions, excluded };
}

/** The menu for this party — every dish already respects the constraints. */
export function menuFor(details: PartyDetails): PlannedRecipe[] {
  return recipes.map((r) => planRecipe(r, details)).filter((r) => !r.excluded);
}

export function allergyNotesFor(details: PartyDetails): string[] {
  const notes = ["Every dish on this menu is nut-free and peanut-free by default."];
  if (details.dietary.length === 0) {
    notes.push("Set a dietary requirement in the builder and the whole menu re-plans around it.");
  } else {
    const labels = details.dietary.map(dietaryLabel).join(", ");
    notes.push(`This menu avoids: ${labels}. Ingredients have been swapped where needed.`);
    const dropped = recipes
      .map((r) => planRecipe(r, details))
      .filter((r) => r.excluded)
      .map((r) => r.name);
    if (dropped.length > 0) {
      notes.push(`Left off the menu for safety: ${dropped.join(", ")}.`);
    }
  }
  notes.push("Ask about allergies in the invitation, not on the day.");
  return notes;
}

/** Backwards-compatible static notes. */
export const allergyNotes = allergyNotesFor(defaultParty);

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

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

export const priorityRank: Record<Priority, number> = { optional: 0, recommended: 1, essential: 2 };
