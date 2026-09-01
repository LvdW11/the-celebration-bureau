export const party = {
  childName: "Emma",
  age: 7,
  guests: 10,
  venue: "Backyard",
  budget: 200,
  theme: "Elegant Magical Princess",
  diy: "Low",
  date: "Saturday, October 11 · 2:00–4:30 PM",
  duration: "2.5 hours",
};

export const timeline = [
  { time: "2:00", title: "Arrival & crown decorating", detail: "Guests choose a ribbon and gold crown at the welcome table." },
  { time: "2:25", title: "Royal portrait moment", detail: "Two-minute photo at the blush and eucalyptus backdrop." },
  { time: "2:45", title: "The Enchanted Garden hunt", detail: "Ten hidden gems, one per guest, in the backyard beds." },
  { time: "3:15", title: "Tea table", detail: "Seated snack service with lemonade in glass cups." },
  { time: "3:45", title: "Cake & wish", detail: "Single-tier cake with gold taper candles." },
  { time: "4:10", title: "Favor farewell", detail: "Each guest leaves with a keepsake pouch." },
];

export const todos = [
  { id: 1, task: "Send digital invitations", due: "4 weeks before", done: true, note: "10 guests, RSVP by Oct 4" },
  { id: 2, task: "Order the cake", due: "3 weeks before", done: true, note: "Single tier, ivory buttercream" },
  { id: 3, task: "Buy decor kit items", due: "2 weeks before", done: false, note: "See shopping list" },
  { id: 4, task: "Print place cards & crowns", due: "1 week before", done: false, note: "Printable pack included" },
  { id: 5, task: "Confirm final headcount", due: "3 days before", done: false, note: "Adjust favors to match" },
  { id: 6, task: "Set the tea table", due: "Morning of", done: false, note: "45 minutes, see layout" },
  { id: 7, task: "Chill drinks & prep fruit", due: "2 hours before", done: false, note: "Keep covered until service" },
];

export const shopping = [
  {
    category: "Table & decor",
    items: [
      { name: "Ivory tablecloth (60 x 102)", qty: "1", price: 18 },
      { name: "Blush gauze table runner", qty: "1", price: 12 },
      { name: "Gold taper candles", qty: "6", price: 9 },
      { name: "Eucalyptus stems", qty: "2 bunches", price: 14 },
      { name: "Blush garden roses", qty: "1 bunch", price: 16 },
    ],
  },
  {
    category: "Tableware",
    items: [
      { name: "Scalloped ivory plates", qty: "20", price: 15 },
      { name: "Gold-rim clear cups", qty: "12", price: 11 },
      { name: "Blush linen-feel napkins", qty: "20", price: 9 },
      { name: "Gold flatware set", qty: "20", price: 12 },
    ],
  },
  {
    category: "Activities & favors",
    items: [
      { name: "Gold paper crowns", qty: "10", price: 14 },
      { name: "Satin ribbon assortment", qty: "1 set", price: 8 },
      { name: "Acrylic gems for the hunt", qty: "1 bag", price: 7 },
      { name: "Muslin favor pouches", qty: "10", price: 13 },
      { name: "Cardstock for printables", qty: "1 pack", price: 10 },
    ],
  },
  {
    category: "Food & drink",
    items: [
      { name: "Cake (ordered)", qty: "1", price: 45 },
      { name: "Berries, grapes, melon", qty: "—", price: 18 },
      { name: "Sandwich & tea-cake ingredients", qty: "—", price: 22 },
      { name: "Lemonade & sparkling water", qty: "—", price: 12 },
    ],
  },
];

export const activities = [
  {
    name: "Crown decorating",
    duration: "20 min",
    effort: "Low prep",
    description:
      "Guests personalise a plain gold crown with satin ribbon and adhesive gems as they arrive. It doubles as the welcome activity and the favor.",
    needs: ["Gold paper crowns", "Satin ribbon", "Adhesive gems"],
  },
  {
    name: "The Enchanted Garden hunt",
    duration: "25 min",
    effort: "Low prep",
    description:
      "Ten gems hidden through the backyard beds, one per guest, with a printed clue card read aloud between finds. No winners, no losers.",
    needs: ["Acrylic gems", "Printed clue cards", "Small basket"],
  },
  {
    name: "Royal portrait corner",
    duration: "Open",
    effort: "15 min setup",
    description:
      "A simple blush and eucalyptus backdrop against the fence. Guests pose in their crowns; parents get one keepsake photo each.",
    needs: ["Eucalyptus stems", "Blush fabric", "Command hooks"],
  },
  {
    name: "Quiet corner",
    duration: "Open",
    effort: "No prep",
    description:
      "A shaded blanket with storybooks for children who need a pause. Small detail, saves the middle of the party.",
    needs: ["Picnic blanket", "Two or three books"],
  },
];

export const food = [
  {
    course: "Tea table",
    items: [
      { name: "Crustless cucumber & cream cheese triangles", note: "Make morning of, keep covered" },
      { name: "Strawberry & butter finger sandwiches", note: "Kid-approved sweet option" },
      { name: "Fruit skewers with berries and melon", note: "Assemble the night before" },
      { name: "Buttered popcorn in paper cones", note: "Fill 30 minutes ahead" },
    ],
  },
  {
    course: "Sweet",
    items: [
      { name: "Single-tier ivory buttercream cake", note: "Ordered — collect morning of" },
      { name: "Shortbread crown cookies", note: "Bake two days ahead, store airtight" },
      { name: "Blush meringue kisses", note: "Store-bought is perfectly fine" },
    ],
  },
  {
    course: "Drinks",
    items: [
      { name: "Cloudy lemonade in glass cups", note: "Serve from a pitcher, not a dispenser" },
      { name: "Sparkling water with raspberries", note: "For grown-ups" },
    ],
  },
  {
    course: "Allergy notes",
    items: [
      { name: "Nut-free by default", note: "Every item above contains no nuts" },
      { name: "Swap for dairy-free", note: "Use oat spread and sorbet cups" },
    ],
  },
];
