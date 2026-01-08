// app/lib/getMaterialsById.ts
import fs from "node:fs";
import path from "node:path";

export function getMaterialsById() {
  const itemsDir = path.join(process.cwd(), "data", "items");
  const files = fs.readdirSync(itemsDir).filter(f => f.endsWith(".json"));

  type MaterialMeta = {
  id: string;
  name?: string;
  imageFilename?: string;
};

const map: Record<string, MaterialMeta> = {};


  for (const file of files) {
    const raw = fs.readFileSync(path.join(itemsDir, file), "utf-8");
    try {
      const item = JSON.parse(raw);

      if (!item.id) continue;

      map[item.id] = {
        id: item.id,
        name: item.name?.en,
        imageFilename: item.imageFilename,
      };
    } catch {
      // ignore
    }
  }

  return map;
}
