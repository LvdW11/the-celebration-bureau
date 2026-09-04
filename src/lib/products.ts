import goldCrowns from "@/assets/products/gold-crowns.jpg";
import craftGems from "@/assets/products/craft-gems.jpg";
import blushRibbon from "@/assets/products/blush-ribbon.jpg";
import blushBalloons from "@/assets/products/blush-balloons.jpg";
import ivoryTablecloth from "@/assets/products/ivory-tablecloth.jpg";
import blushNapkins from "@/assets/products/blush-napkins.jpg";
import goldPlates from "@/assets/products/gold-plates.jpg";
import goldCandles from "@/assets/products/gold-candles.jpg";
import eucalyptus from "@/assets/products/eucalyptus.jpg";
import favorPouches from "@/assets/products/favor-pouches.jpg";

/** Palette keys used across the plan. */
export type PaletteColor = "ivory" | "blush" | "sage" | "gold";

export type Priority = "essential" | "recommended" | "optional";

export type ProductCategory =
  | "Decor"
  | "Tableware"
  | "Activities"
  | "Favors"
  | "Food & drink";

/**
 * How the quantity of a product behaves as the guest count changes.
 * - consumable: one per child (or per pack of children), scales with guests
 * - reusable: one is enough however many children come, and it survives the day
 * - fixed: a single fixed-cost element (a backdrop, the cake stand moment)
 */
export type ProductNature = "consumable" | "reusable" | "fixed";

/** A homemade stand-in the planner can choose instead of buying. */
export interface DiyOption {
  name: string;
  /** Materials cost for the homemade version. */
  price: number;
  prepMinutes: number;
  note: string;
}

/**
 * A single purchasable item. Products are referenced by id from activities,
 * timeline moments, to-do tasks and the palette, so the same product can
 * appear in many places without being duplicated.
 *
 * The planning metadata (`nature`, `partyValue`, `diy`, `buffer`) is what the
 * budget engine reasons with — see engine.ts.
 */
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  themes: string[];
  colors: PaletteColor[];
  image: string;
  retailer: string;
  price: number;
  /** What one unit contains, e.g. "Set of 12". */
  unit: string;
  /** How many children one unit serves. `null` = one unit is always enough. */
  coversChildren: number | null;
  affiliateUrl: string;
  estimatedDelivery: string;
  priority: Priority;
  activityIds: string[];
  timelineIds: string[];
  todoIds: string[];
  /** Cheaper stand-in used when the budget is tight. */
  alternativeId?: string;
  /** Non-affiliate planning line (groceries, bakery) — no retailer link. */
  generic?: boolean;

  /* ---- planning metadata ---- */
  /** How quantity responds to the guest count. */
  nature: ProductNature;
  /** 0–10: what this contributes to the party the child remembers. */
  partyValue: number;
  /** Extra children to cover on consumables, so nothing runs out. */
  buffer?: number;
  /** A homemade alternative the planner may pick under budget pressure. */
  diy?: DiyOption;
  /** A ready-made convenience purchase — the first thing High DIY reconsiders. */
  convenience?: boolean;
  /**
   * Plainer stand-ins that only ever enter a plan as the `alternativeId` of
   * another product. They are never chosen on their own merits.
   */
  alternativeOnly?: boolean;
}

const THEME = "Elegant Magical Princess";

export const products: Product[] = [
  {
    id: "gold-crowns",
    name: "Gold Paper Crowns",
    category: "Activities",
    themes: [THEME],
    colors: ["gold", "ivory"],
    image: goldCrowns,
    retailer: "Amazon",
    price: 13.99,
    unit: "Set of 12",
    coversChildren: 12,
    affiliateUrl: "https://www.amazon.com/s?k=gold+paper+party+crowns&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "essential",
    activityIds: ["crown-decorating"],
    timelineIds: ["arrival"],
    todoIds: ["decor-kit", "printables"],
    nature: "consumable",
    partyValue: 8,
    buffer: 2,
    convenience: true,
    diy: {
      name: "Crowns cut from gold cardstock",
      price: 5.49,
      prepMinutes: 45,
      note: "Print the Bureau crown template onto gold card and cut them the evening before.",
    },
  },
  {
    id: "craft-gems",
    name: "Adhesive Gems & Gold Star Stickers",
    category: "Activities",
    themes: [THEME],
    colors: ["gold", "ivory"],
    image: craftGems,
    retailer: "Amazon",
    price: 8.99,
    unit: "Pack of 500",
    coversChildren: 10,
    affiliateUrl: "https://www.amazon.com/s?k=adhesive+gems+gold+star+stickers&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "essential",
    activityIds: ["crown-decorating", "garden-hunt"],
    timelineIds: ["arrival", "hunt"],
    todoIds: ["decor-kit"],
    nature: "consumable",
    partyValue: 7,
  },
  {
    id: "satin-ribbon",
    name: "Satin Ribbon Assortment, Blush & Ivory",
    category: "Activities",
    themes: [THEME],
    colors: ["blush", "ivory"],
    image: blushRibbon,
    retailer: "Etsy",
    price: 9.49,
    unit: "6 spools",
    coversChildren: 15,
    affiliateUrl: "https://www.etsy.com/search?q=blush+ivory+satin+ribbon",
    estimatedDelivery: "3–5 days",
    priority: "recommended",
    activityIds: ["crown-decorating"],
    timelineIds: ["arrival"],
    todoIds: ["decor-kit"],
    nature: "consumable",
    partyValue: 5,
    diy: {
      name: "Crepe paper streamers, cut into lengths",
      price: 3.99,
      prepMinutes: 20,
      note: "Cut blush crepe paper into 24-inch lengths — it curls beautifully.",
    },
  },
  {
    id: "balloon-garland",
    name: "Blush & Ivory Balloon Garland Kit",
    category: "Decor",
    themes: [THEME],
    colors: ["blush", "ivory"],
    image: blushBalloons,
    retailer: "Amazon",
    price: 24.99,
    unit: "120-balloon kit",
    coversChildren: null,
    affiliateUrl: "https://www.amazon.com/s?k=blush+ivory+balloon+garland+kit&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "recommended",
    activityIds: ["portrait-corner"],
    timelineIds: ["portrait"],
    todoIds: ["decor-kit", "table-set"],
    nature: "fixed",
    partyValue: 6,
    convenience: true,
    diy: {
      name: "Loose balloons on fishing line",
      price: 9.99,
      prepMinutes: 60,
      note: "Two bags of blush and ivory balloons threaded onto line — the same look, an hour of work.",
    },
  },
  {
    id: "ivory-tablecloth",
    name: "Ivory Linen-Look Tablecloth, 60 x 102",
    category: "Decor",
    themes: [THEME],
    colors: ["ivory"],
    image: ivoryTablecloth,
    retailer: "Target",
    price: 18.99,
    unit: "1 cloth",
    coversChildren: 12,
    affiliateUrl: "https://www.target.com/s?searchTerm=ivory+linen+tablecloth",
    estimatedDelivery: "2 days",
    priority: "essential",
    activityIds: [],
    timelineIds: ["tea"],
    todoIds: ["decor-kit", "table-set"],
    nature: "reusable",
    partyValue: 5,
    diy: {
      name: "Kraft paper table runner",
      price: 6.99,
      prepMinutes: 15,
      note: "A paper roll down the centre of the table, with names written at each place.",
    },
  },
  {
    id: "blush-napkins",
    name: "Blush Linen-Feel Napkins",
    category: "Tableware",
    themes: [THEME],
    colors: ["blush"],
    image: blushNapkins,
    retailer: "Target",
    price: 9.49,
    unit: "Pack of 20",
    coversChildren: 20,
    affiliateUrl: "https://www.target.com/s?searchTerm=blush+linen+feel+napkins",
    estimatedDelivery: "2 days",
    priority: "essential",
    activityIds: [],
    timelineIds: ["tea"],
    todoIds: ["decor-kit", "table-set"],
    nature: "consumable",
    partyValue: 4,
    buffer: 4,
  },
  {
    id: "scalloped-plates",
    name: "Scalloped Ivory Plates with Gold Rim",
    category: "Tableware",
    themes: [THEME],
    colors: ["ivory", "gold"],
    image: goldPlates,
    retailer: "Amazon",
    price: 15.99,
    unit: "Pack of 24",
    coversChildren: 12,
    affiliateUrl: "https://www.amazon.com/s?k=scalloped+ivory+gold+rim+party+plates&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "essential",
    activityIds: [],
    timelineIds: ["tea", "cake"],
    todoIds: ["decor-kit", "table-set"],
    nature: "consumable",
    partyValue: 5,
    buffer: 2,
  },
  {
    id: "gold-rim-cups",
    name: "Gold-Rim Clear Cups",
    category: "Tableware",
    themes: [THEME],
    colors: ["gold", "ivory"],
    image: goldPlates,
    retailer: "Amazon",
    price: 10.99,
    unit: "Pack of 12",
    coversChildren: 12,
    affiliateUrl: "https://www.amazon.com/s?k=gold+rim+clear+party+cups&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "recommended",
    activityIds: [],
    timelineIds: ["tea"],
    todoIds: ["table-set", "drinks"],
    nature: "consumable",
    partyValue: 4,
    buffer: 2,
  },
  {
    id: "gold-tapers",
    name: "Gold Taper Candles",
    category: "Decor",
    themes: [THEME],
    colors: ["gold"],
    image: goldCandles,
    retailer: "Etsy",
    price: 8.99,
    unit: "Set of 6",
    coversChildren: null,
    affiliateUrl: "https://www.etsy.com/search?q=gold+taper+birthday+candles",
    estimatedDelivery: "3–5 days",
    priority: "recommended",
    activityIds: [],
    timelineIds: ["cake"],
    todoIds: ["cake"],
    nature: "fixed",
    partyValue: 7,
  },
  {
    id: "eucalyptus-stems",
    name: "Preserved Eucalyptus Stems",
    category: "Decor",
    themes: [THEME],
    colors: ["sage"],
    image: eucalyptus,
    retailer: "Etsy",
    price: 14.99,
    unit: "2 bunches",
    coversChildren: null,
    affiliateUrl: "https://www.etsy.com/search?q=preserved+eucalyptus+stems",
    estimatedDelivery: "3–5 days",
    priority: "recommended",
    activityIds: ["portrait-corner"],
    timelineIds: ["portrait", "tea"],
    todoIds: ["decor-kit", "table-set"],
    nature: "fixed",
    partyValue: 3,
    convenience: true,
    diy: {
      name: "Cuttings from the garden",
      price: 0,
      prepMinutes: 20,
      note: "Any soft green foliage, cut the morning of and kept in water until you dress the table.",
    },
  },
  {
    id: "favor-pouches",
    name: "Muslin Favor Pouches",
    category: "Favors",
    themes: [THEME],
    colors: ["ivory"],
    image: favorPouches,
    retailer: "Amazon",
    price: 12.99,
    unit: "Pack of 12",
    coversChildren: 12,
    affiliateUrl: "https://www.amazon.com/s?k=muslin+drawstring+favor+bags&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "essential",
    activityIds: [],
    timelineIds: ["farewell"],
    todoIds: ["headcount", "printables"],
    nature: "consumable",
    partyValue: 6,
    buffer: 2,
    diy: {
      name: "Folded paper cones tied with ribbon",
      price: 4.49,
      prepMinutes: 30,
      note: "Ivory cardstock rolled into cones — children love them just as much.",
    },
  },
  {
    id: "chiffon-backdrop",
    name: "Blush Chiffon Backdrop Drape",
    category: "Decor",
    themes: [THEME],
    colors: ["blush"],
    image: blushRibbon,
    retailer: "Amazon",
    price: 21.99,
    unit: "1 drape, 6 ft",
    coversChildren: null,
    affiliateUrl: "https://www.amazon.com/s?k=blush+chiffon+backdrop+drape&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "optional",
    activityIds: ["portrait-corner"],
    timelineIds: ["portrait"],
    todoIds: ["decor-kit"],
    nature: "fixed",
    partyValue: 6,
    convenience: true,
    diy: {
      name: "A blush sheet or fabric length, pinned",
      price: 7.99,
      prepMinutes: 30,
      note: "Pin a plain blush sheet to the fence and steam out the folds the morning of.",
    },
  },
  {
    id: "gold-flatware",
    name: "Gold Plastic Flatware Set",
    category: "Tableware",
    themes: [THEME],
    colors: ["gold"],
    image: goldPlates,
    retailer: "Amazon",
    price: 12.49,
    unit: "24 pieces",
    coversChildren: 24,
    affiliateUrl: "https://www.amazon.com/s?k=gold+plastic+party+flatware&tag=celebrationbureau-20",
    estimatedDelivery: "2–3 days",
    priority: "optional",
    activityIds: [],
    timelineIds: ["tea"],
    todoIds: ["table-set"],
    nature: "consumable",
    partyValue: 2,
  },
  {
    id: "cake",
    name: "Single-Tier Ivory Buttercream Cake",
    category: "Food & drink",
    themes: [THEME],
    colors: ["ivory"],
    image: goldCandles,
    retailer: "Local bakery",
    price: 45,
    unit: "Serves 12",
    coversChildren: 12,
    affiliateUrl: "",
    estimatedDelivery: "Collect morning of",
    priority: "essential",
    activityIds: [],
    timelineIds: ["cake"],
    todoIds: ["cake"],
    generic: true,
    nature: "consumable",
    partyValue: 9,
    convenience: true,
    diy: {
      name: "Home-baked single-tier cake",
      price: 18,
      prepMinutes: 180,
      note: "Two sponge layers, ivory buttercream, finished with the same gold tapers.",
    },
  },
  {
    id: "groceries",
    name: "Tea-table groceries (see recipes)",
    category: "Food & drink",
    themes: [THEME],
    colors: ["ivory"],
    image: eucalyptus,
    retailer: "Your local grocery",
    price: 3.6,
    unit: "Per child",
    coversChildren: 1,
    affiliateUrl: "",
    estimatedDelivery: "Buy 1–2 days before",
    priority: "essential",
    activityIds: [],
    timelineIds: ["tea"],
    todoIds: ["drinks", "prep-food"],
    generic: true,
    nature: "consumable",
    partyValue: 8,
    diy: {
      name: "Pared-back tea table (baked and assembled at home)",
      price: 2.4,
      prepMinutes: 90,
      note: "The same menu with home-baked shortbread and simpler fillings instead of shop-bought extras.",
    },
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);

export const paletteColors: { key: PaletteColor; name: string; cls: string; note: string }[] = [
  { key: "ivory", name: "Warm ivory", cls: "bg-ivory", note: "The base — linen, plates, paper." },
  { key: "blush", name: "Soft blush", cls: "bg-blush", note: "The romance — balloons, ribbon, napkins." },
  { key: "sage", name: "Sage", cls: "bg-sage", note: "The garden — eucalyptus and greenery." },
  { key: "gold", name: "Muted gold", cls: "bg-gold", note: "The sparkle — crowns, candles, rims." },
];

/** Digital add-ons. Structured now so printables can be sold later. */
export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  activityIds: string[];
  included: boolean;
  price: number;
}

export const digitalProducts: DigitalProduct[] = [
  {
    id: "crown-template",
    name: "Printable crown templates",
    description: "Three crown shapes to print on gold cardstock, sized for ages 4–8.",
    activityIds: ["crown-decorating"],
    included: true,
    price: 0,
  },
  {
    id: "hunt-cards",
    name: "Enchanted Garden clue cards",
    description: "Ten illustrated clue cards to read aloud between finds.",
    activityIds: ["garden-hunt"],
    included: true,
    price: 0,
  },
  {
    id: "place-cards",
    name: "Tea-table place cards",
    description: "Editable place cards and a menu card for the tea table.",
    activityIds: [],
    included: true,
    price: 0,
  },
  {
    id: "colouring-pack",
    name: "Princess colouring & activity sheets",
    description: "Twelve colouring pages and a matching game for the quiet corner.",
    activityIds: ["quiet-corner"],
    included: false,
    price: 6,
  },
  {
    id: "certificates",
    name: "Royal certificates & bingo",
    description: "Personalised certificates and princess bingo cards.",
    activityIds: [],
    included: false,
    price: 6,
  },
];
