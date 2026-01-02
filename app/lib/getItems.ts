// getItems.ts
import fs from "fs";
import path from "path";

export type Item = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  recipe?: Record<string, number>;
  upgradeCost?: Record<string, number>;
};

export function getItems(): Item[] {
  const itemsDir = path.join(
    process.cwd(),
    "data",
    "items"
  );

  const files = fs
    .readdirSync(itemsDir)
    .filter((file) => file.endsWith(".json"));

  return files.map((file) => {
    const fullPath = path.join(itemsDir, file);
    return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  });
}
