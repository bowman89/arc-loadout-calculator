import fs from "fs";
import path from "path";

const oldDir = "./data/items-old";
const newDir = "./data/items-new";

const oldFiles = fs.readdirSync(oldDir).filter((f) => f.endsWith(".json"));
const newFiles = fs.readdirSync(newDir).filter((f) => f.endsWith(".json"));

const craftChanges = [];
const recycleChanges = [];
const salvageChanges = [];
const missingInNew = [];
const newItems = [];

for (const file of oldFiles) {
  const oldPath = path.join(oldDir, file);
  const newPath = path.join(newDir, file);

  if (!fs.existsSync(newPath)) {
    missingInNew.push(file);
    continue;
  }

  const oldItem = JSON.parse(fs.readFileSync(oldPath, "utf8"));
  const newItem = JSON.parse(fs.readFileSync(newPath, "utf8"));

  const name = oldItem?.name?.en ?? file;

  const oldRecipe = oldItem.recipe ?? {};
  const newRecipe = newItem.recipe ?? {};

  const oldRecycle = oldItem.recyclesInto ?? {};
  const newRecycle = newItem.recyclesInto ?? {};

  const oldSalvage = oldItem.salvagesInto ?? {};
  const newSalvage = newItem.salvagesInto ?? {};

  if (JSON.stringify(oldRecipe) !== JSON.stringify(newRecipe)) {
    craftChanges.push({
      file,
      name,
      old: oldRecipe,
      new: newRecipe,
    });
  }

  if (JSON.stringify(oldRecycle) !== JSON.stringify(newRecycle)) {
    recycleChanges.push({
      file,
      name,
      old: oldRecycle,
      new: newRecycle,
    });
  }

  if (JSON.stringify(oldSalvage) !== JSON.stringify(newSalvage)) {
    salvageChanges.push({
      file,
      name,
      old: oldSalvage,
      new: newSalvage,
    });
  }
}

for (const file of newFiles) {
  if (!oldFiles.includes(file)) {
    newItems.push(file);
  }
}

console.log("----- Craft Recipe Changes -----");
console.dir(craftChanges, { depth: null, maxArrayLength: null });

console.log("\n----- Recycle Changes -----");
console.dir(recycleChanges, { depth: null, maxArrayLength: null });

console.log("\n----- Salvage Changes -----");
console.dir(salvageChanges, { depth: null, maxArrayLength: null });

console.log("\n----- Missing in New Version -----");
console.log(missingInNew);

console.log("\n----- New Items -----");
console.log(newItems);

console.log("\nSummary:");
console.log("Craft changes:", craftChanges.length);
console.log("Recycle changes:", recycleChanges.length);
console.log("Salvage changes:", salvageChanges.length);
console.log("Removed items:", missingInNew.length);
console.log("New items:", newItems.length);

const report = {
  craftChanges,
  recycleChanges,
  salvageChanges,
  missingInNew,
  newItems,
};

fs.writeFileSync(
  "./scripts/item-diff-report.json",
  JSON.stringify(report, null, 2),
);

console.log("\nReport written to scripts/item-diff-report.json");
