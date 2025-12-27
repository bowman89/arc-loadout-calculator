import { getWeapons } from "../lib/getWeapons";
import { getItems } from "../lib/getItems";
import BuilderClient from "./BuilderClient";

export default function BuilderPage() {
  const weapons = getWeapons();
  const items = getItems();

  return <BuilderClient weapons={weapons} items={items} />;
}
