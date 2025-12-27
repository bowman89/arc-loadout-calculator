// app/lib/calcCosts.ts

export type Mats = Record<string, number>;

export type Item = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  recipe?: Mats;
  upgradeCost?: Mats;
};

const ROMAN_TO_INT: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
};

const INT_TO_ROMAN = Object.fromEntries(
  Object.entries(ROMAN_TO_INT).map(([k, v]) => [v, k]),
) as Record<number, string>;

function parseId(id: string): { base: string; level: number } {
  // expects: "anvil_iv"
  const idx = id.lastIndexOf("_");
  if (idx === -1) return { base: id, level: 1 };

  const base = id.slice(0, idx);
  const suffix = id.slice(idx + 1).toLowerCase();

  const level = ROMAN_TO_INT[suffix] ?? 1;
  return { base, level };
}

function addMats(target: Mats, add?: Mats, multiplier = 1) {
  if (!add) return;
  for (const [k, v] of Object.entries(add)) {
    target[k] = (target[k] ?? 0) + v * multiplier;
  }
}

export function fullCraftCostForItem(targetId: string, byId: Record<string, Item>): Mats {
  const { base, level } = parseId(targetId);

  const totals: Mats = {};

  // Base craft must come from level 1 recipe: `${base}_i`
  const baseId = `${base}_${INT_TO_ROMAN[1]}`; // `${base}_i`
  const baseItem = byId[baseId];

  addMats(totals, baseItem?.recipe, 1);

  // Upgrades from 2..level, each cost is on that level item
  for (let l = 2; l <= level; l++) {
    const stepId = `${base}_${INT_TO_ROMAN[l]}`;
    const stepItem = byId[stepId];
    addMats(totals, stepItem?.upgradeCost, 1);
  }

  return totals;
}

export function totalsForLoadout(loadout: { weapon: Item; quantity: number }[], byId: Record<string, Item>): Mats {
  const totals: Mats = {};

  for (const entry of loadout) {
    const cost = fullCraftCostForItem(entry.weapon.id, byId);
    addMats(totals, cost, entry.quantity);
  }

  return totals;
}
