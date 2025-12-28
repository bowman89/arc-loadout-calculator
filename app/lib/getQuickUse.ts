import fs from "node:fs";
import path from "node:path";

/* ---------- types ---------- */
export type QuickUseItem = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  recipe?: Record<string, number>;
  type?: string;
};

/* ---------- loader ---------- */
export function getQuickUse(): QuickUseItem[] {
  const itemsDir = path.join(
    process.cwd(),
    "data",
    "arcraiders-data",
    "items"
  );

  const files = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json"));

  const quickUses: QuickUseItem[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(itemsDir, file), "utf-8");

    try {
      const item = JSON.parse(raw) as QuickUseItem;

      // ✅ STRICT FILTER:
      // - must be Quick Use
      // - must have a real recipe object with content
      if (
        item?.type?.toLowerCase() === "quick use" &&
        item.recipe &&
        typeof item.recipe === "object" &&
        Object.keys(item.recipe).length > 0
      ) {
        quickUses.push(item);
      }
    } catch {
      // ignore malformed JSON
    }
  }

  // Sort alphabetically (same pattern as weapons / augments)
  quickUses.sort((a, b) =>
    (a.name?.en ?? a.id).localeCompare(b.name?.en ?? b.id)
  );

  return quickUses;
}
