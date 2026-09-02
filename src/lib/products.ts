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
 * A single purchasable item. Products are referenced by id from activities,
 * timeline moments, to-do tasks and the palette, so the same product can
 * appear in many places without being duplicated.
 *
 * `price` and `affiliateUrl` are intentionally kept in one place so this
 * catalogue can later be replaced by a real affiliate/product API.
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
