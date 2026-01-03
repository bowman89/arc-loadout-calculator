// getAmmo.ts
import fs from "node:fs";
import path from "node:path";

/* ---------- types ---------- */
export type Ammunition = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  recipe?: Record<string, number>;
  type?: string;
  stackSize?: number;
  craftQuantity?: number;
};

/* ---------- loader ---------- */
export function getAmmo(): Ammunition[] {
  const itemsDir = path.join(process.cwd(), "data", "items");

  const files = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json"));

  const ammo: Ammunition[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(itemsDir, file), "utf-8");
      const item = JSON.parse(raw) as Ammunition;

      const type = item?.type?.toLowerCase();

      // Dine data bruger "Ammunition" (men vi accepterer også "ammo")
      const isAmmoType = type === "ammunition" || type === "ammo";

      const hasRecipe =
        item.recipe && typeof item.recipe === "object" && Object.keys(item.recipe).length > 0;

      if (isAmmoType && hasRecipe) {
  ammo.push({
    ...item,
    craftQuantity: item.craftQuantity ?? 25,
  });
}
    } catch {
      // ignore bad json
    }
  }

  ammo.sort((a, b) => (a.name?.en ?? a.id).localeCompare(b.name?.en ?? b.id));

  return ammo;
}
