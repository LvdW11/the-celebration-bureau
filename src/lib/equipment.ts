/**
 * Equipment the plan may need. The Bureau assumes normal household basics and
 * only calls out what a parent might genuinely not have. Activities and
 * recipes reference these by id so the planner can reason about them.
 */
export type EquipmentLevel = "basic" | "specific" | "unusual";

export interface Equipment {
  id: string;
  name: string;
  level: EquipmentLevel;
  note?: string;
}

export const equipment: Equipment[] = [
  { id: "scissors", name: "Scissors", level: "basic" },
  { id: "bowls", name: "Mixing bowls", level: "basic" },
  { id: "utensils", name: "Everyday utensils", level: "basic" },
  { id: "fridge", name: "Fridge space", level: "basic" },
  { id: "knife", name: "Sharp knife & board", level: "basic" },
  { id: "tray", name: "Baking tray", level: "basic" },
  { id: "oven", name: "Oven", level: "specific", note: "Needed for the shortbread crowns." },
  { id: "mixer", name: "Hand or stand mixer", level: "specific", note: "A wooden spoon also works." },
  { id: "saucepan", name: "Saucepan", level: "specific" },
  { id: "pitcher", name: "Large pitcher", level: "specific" },
  { id: "speaker", name: "Outdoor speaker", level: "specific" },
  { id: "cake-stand", name: "Cake stand", level: "specific", note: "Borrowable — a flat plate is fine." },
  { id: "balloon-pump", name: "Balloon pump", level: "specific", note: "Usually included in garland kits." },
  { id: "command-hooks", name: "Command hooks or twine", level: "specific" },
];

export const equipmentById = (id: string) => equipment.find((e) => e.id === id);

/** Only the pieces worth telling a parent about — basics are assumed. */
export const notableEquipment = (ids: string[]) =>
  ids
    .map(equipmentById)
    .filter((e): e is Equipment => Boolean(e) && e!.level !== "basic")
    .sort((a, b) => a.id.localeCompare(b.id));

export const equipmentList = (ids: string[]) =>
  ids
    .map(equipmentById)
    .filter((e): e is Equipment => Boolean(e))
    .sort((a, b) => a.id.localeCompare(b.id));
