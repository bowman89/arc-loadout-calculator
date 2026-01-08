// getRecycleGraph.ts
import fs from "node:fs";
import path from "node:path";

/* ---------- TYPES ---------- */

export type RecycleSource = {
  sourceItemId: string;
  sourceName?: string;
  amount: number;
};

export type RecycleGraph = {
  [materialId: string]: RecycleSource[];
};

/* ---------- LOADER ---------- */

export function getRecycleGraph(): RecycleGraph {
  const itemsDir = path.join(process.cwd(), "data", "items");
  const files = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json"));

  const graph: RecycleGraph = {};

  for (const file of files) {
    const raw = fs.readFileSync(path.join(itemsDir, file), "utf-8");

    try {
      const item = JSON.parse(raw);

      if (!item?.recyclesInto || typeof item.recyclesInto !== "object")
        continue;

      Object.entries(item.recyclesInto).forEach(([materialId, amount]) => {
        if (!graph[materialId]) {
          graph[materialId] = [];
        }

        graph[materialId].push({
          sourceItemId: item.id,
          sourceName: item.name?.en,
          amount: Number(amount),
        });
      });
    } catch {
      // ignore broken json
    }
  }

  // Sort each material by highest yield first
  Object.values(graph).forEach((sources) =>
    sources.sort((a, b) => b.amount - a.amount)
  );

  return graph;
}
