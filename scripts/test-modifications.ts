import { getModifications } from "../app/lib/getModifications";

const mods = getModifications();

console.log("Found modifications:", mods.length);

mods.forEach((m) => {
  console.log({
    id: m.id,
    name: m.name?.en,
    hasRecipe: !!m.recipe,
    type: m.type,
  });
});
