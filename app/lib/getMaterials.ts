// getMaterials.ts
import fs from "node:fs";
import path from "node:path";

/* ---------- types ---------- */
export type Material = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  type: "Basic Material" | "Refined Material" | "Topside Material";
};

/* ---------- loader ---------- */
export function getMaterials(): Material[] {
  const itemsDir = path.join(process.cwd(), "data", "items");

  const files = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json"));

  const materials: Material[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(itemsDir, file), "utf-8");

    try {
      const item = JSON.parse(raw) as Material;

      // ✅ STRICT FILTER:
      // - must be a material
      // - must have a known material type
      if (
        item?.type &&
        ["basic material", "refined material", "topside material"].includes(
          item.type.toLowerCase()
        )
      ) {
        materials.push(item);
      }
    } catch {
      // ignore malformed JSON
    }
  }

  // Sort alphabetically (same behavior as other get-files)
  materials.sort((a, b) =>
    (a.name?.en ?? a.id).localeCompare(b.name?.en ?? b.id)
  );

  return materials;
}
