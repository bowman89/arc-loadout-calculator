import fs from "fs";
import path from "path";

const diff = JSON.parse(
  fs.readFileSync("./scripts/item-diff-report.json", "utf8"),
);

const buildDir = "./data/items";

function applyChanges(changes, field) {
  for (const change of changes) {
    const filePath = path.join(buildDir, change.file);

    if (!fs.existsSync(filePath)) {
      console.log("Skipping (not in build):", change.file);
      continue;
    }

    const item = JSON.parse(fs.readFileSync(filePath, "utf8"));

    item[field] = change.new;

    fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
  }
}

applyChanges(diff.craftChanges, "recipe");
applyChanges(diff.recycleChanges, "recyclesInto");
applyChanges(diff.salvageChanges, "salvagesInto");

console.log("✔ Items updated in /data/items");
