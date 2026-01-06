import { getMaterials } from "../app/lib/getMaterials";

const materials = getMaterials();

console.log("Found materials:", materials.length);

materials.forEach((m) => {
  console.log({
    id: m.id,
    name: m.name?.en,
    type: m.type,
  });
});
