import fs from "node:fs";
import path from "node:path";

export type Augment = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
  recipe?: Record<string, number>;
  type?: string;
};

export function getAugments(): Augment[] {
  const dir = path.join(process.cwd(), "data", "arcraiders-data", "items");

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
    .filter((i) => i?.type?.toLowerCase() === "augment")
    .sort((a, b) =>
      (a.name?.en ?? a.id).localeCompare(b.name?.en ?? b.id)
    );
}
