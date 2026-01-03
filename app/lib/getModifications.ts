// getModifications.ts
import fs from "node:fs";
import path from "node:path";

/* ---------- types ---------- */
export type ModificationItem = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  recipe?: Record<string, number>;
  type?: string;
};

/* ---------- loader ---------- */
export function getModifications(): ModificationItem[] {
  const itemsDir = path.join(
    process.cwd(),
    "data",
    "items"
  );

  const files = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json"));

  const modifications: ModificationItem[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(itemsDir, file), "utf-8");

    try {
      const item = JSON.parse(raw) as ModificationItem;

      // ✅ STRICT FILTER:
      // - must be Modification
      // - must have a real recipe object with content
      if (
        item?.type?.toLowerCase() === "modification" &&
        item.recipe &&
        typeof item.recipe === "object" &&
        Object.keys(item.recipe).length > 0
      ) {
        modifications.push(item);
      }
    } catch {
      // ignore malformed JSON
    }
  }

  // Sort alphabetically
  modifications.sort((a, b) =>
    (a.name?.en ?? a.id).localeCompare(b.name?.en ?? b.id)
  );

  return modifications;
}
