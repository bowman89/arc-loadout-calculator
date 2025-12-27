// getWeapons.ts
import fs from "node:fs";
import path from "node:path";

export type WeaponItem = {
  id: string;
  name?: { en?: string };
  isWeapon?: boolean;
};

export function getWeapons(): WeaponItem[] {
  const itemsDir = path.join(process.cwd(), "data", "arcraiders-data", "items");

  const files = fs
    .readdirSync(itemsDir)
    .filter((f) => f.endsWith(".json"));

  const weapons: WeaponItem[] = [];

  for (const file of files) {
    const fullPath = path.join(itemsDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");

    try {
      const item = JSON.parse(raw) as WeaponItem;

      if (item?.isWeapon === true) {
        weapons.push(item);
      }
    } catch {
      // hvis en fil fejler, skipper vi den (funktion først)
    }
  }

  // sorter alfabetisk (engelsk navn)
  weapons.sort((a, b) =>
    (a.name?.en ?? a.id).localeCompare(b.name?.en ?? b.id)
  );

  return weapons;
}
