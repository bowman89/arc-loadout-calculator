"use client";

import { useMemo, useState } from "react";
import {
  totalsForLoadout,
  type Item as Weapon,
  type Mats,
} from "../lib/calcCosts";

type Item = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
};

type LoadoutItem = {
  weapon: Weapon;
  quantity: number;
};

/* ---------- helpers ---------- */
function formatMaterialName(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ---------- component ---------- */
export default function BuilderClient({
  weapons,
  items,
}: {
  weapons: Weapon[];
  items: Item[];
}) {
  const [selectedWeaponId, setSelectedWeaponId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadout, setLoadout] = useState<LoadoutItem[]>([]);

  const weaponsById = useMemo(() => {
    const map: Record<string, Weapon> = {};
    for (const w of weapons) map[w.id] = w;
    return map;
  }, [weapons]);

  const itemsById = useMemo(() => {
    const map: Record<string, Item> = {};
    for (const it of items) map[it.id] = it;
    return map;
  }, [items]);

  const materialTotals: Mats = useMemo(() => {
    return totalsForLoadout(loadout, weaponsById);
  }, [loadout, weaponsById]);

  function addToLoadout() {
    if (!selectedWeaponId) return;
    const weapon = weaponsById[selectedWeaponId];
    if (!weapon) return;

    setLoadout((prev) => [...prev, { weapon, quantity }]);
  }

  function removeFromLoadout(index: number) {
    setLoadout((prev) => prev.filter((_, i) => i !== index));
  }

  function clearLoadout() {
    setLoadout([]);
  }

  const materialRows = Object.entries(materialTotals).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        items-start
        md:grid-cols-[320px_420px_320px]
      "
    >
      {/* ADD ITEM */}
      <section className="rounded-xl bg-white/5 p-6">
        <h4 className="mb-4 font-semibold text-white">Add item</h4>

        <label className="block text-sm text-[#A0A4AA]">Weapon</label>
        <select
          value={selectedWeaponId}
          onChange={(e) => setSelectedWeaponId(e.target.value)}
          className="mt-1 w-full rounded bg-white px-3 py-2 text-black"
        >
          <option value="">Select weapon</option>
          {weapons.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name?.en ?? w.id}
            </option>
          ))}
        </select>

        {/* QUANTITY */}
        <label className="mt-4 block text-sm text-[#A0A4AA]">Quantity</label>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-md border border-white/10 bg-[#0E0F12] text-white hover:bg-white/10 transition"
          >
            −
          </button>

          <div className="h-9 min-w-[48px] rounded-md bg-[#0E0F12] border border-white/10 text-sm font-medium text-white flex items-center justify-center">
            {quantity}
          </div>

          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 rounded-md border border-white/10 bg-[#0E0F12] text-white hover:bg-white/10 transition"
          >
            +
          </button>
        </div>

        <button
          onClick={addToLoadout}
          className="mt-6 w-full rounded-md bg-[#C9B400] px-4 py-2 text-sm font-semibold text-[#0E0F12] hover:bg-[#B3A200] transition"
        >
          Add to loadout
        </button>
      </section>

      {/* CURRENT LOADOUT */}
      <section className="rounded-xl bg-white/5 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h4 className="font-semibold text-white">Current loadout</h4>
          <button
            onClick={clearLoadout}
            disabled={loadout.length === 0}
            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-40 px-2 rounded"
          >
            Clear all
          </button>
        </div>

        {loadout.length === 0 && (
          <p className="text-sm text-[#A0A4AA]">No items added yet</p>
        )}

        <div className="space-y-3">
          {loadout.map((item, index) => (
            <div
              key={`${item.weapon.id}-${index}`}
              className="flex items-center gap-3 rounded-lg bg-[#0E0F12] border border-white/5 p-3"
            >
              {item.weapon.imageFilename && (
                <img
                  src={item.weapon.imageFilename}
                  alt={item.weapon.name?.en ?? item.weapon.id}
                  className="h-12 w-12 flex-shrink-0 object-contain"
                />
              )}

              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-white">
                  {item.weapon.name?.en ?? item.weapon.id}
                </strong>
                <div className="text-xs text-[#A0A4AA]">
                  Quantity: {item.quantity}
                </div>
              </div>

              <button
                onClick={() => removeFromLoadout(index)}
                className="text-zinc-400 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIALS */}
      <section className="rounded-xl bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-white">Materials needed</h4>

          {/* INFO ICON */}
          <div className="relative group">
            <div
              className="
                flex h-6 w-6 items-center justify-center
                rounded-full
                border border-[#C9B400]
                text-xs font-semibold
                text-[#C9B400]
                cursor-default
                hover:bg-white/10
              "
            >
              i
            </div>

            {/* TOOLTIP */}
            <div
              className="
                pointer-events-none
                absolute right-0 top-8 z-10
                w-56
                rounded-md
                bg-[#0E0F12]
                border border-[#C9B400]
                p-3
                text-xs
                text-[#C9B400]
                opacity-0
                translate-y-1
                transition
                group-hover:opacity-100
                group-hover:translate-y-0
              "
            >
Shows the <strong className="text-white">total materials</strong> required
to craft everything in your current loadout.
<br />
<br />
Tip: You can <strong className="text-white">clip this list</strong> using
the screenshot tool and paste it directly into
<strong className="text-white"> Steam Notes</strong> for easy in-game reference.
<br />
<br />
Updates automatically when items change.
            </div>
          </div>
        </div>

        {materialRows.length === 0 ? (
          <p className="text-sm text-[#A0A4AA]">
            Add items to see required materials.
          </p>
        ) : (
          <div className="space-y-2">
            {materialRows.map(([matId, amount]) => {
              const matItem = itemsById[matId];

              return (
                <div
                  key={matId}
                  className="flex items-center justify-between gap-3 rounded-md bg-[#0E0F12] border border-white/5 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {matItem?.imageFilename && (
                      <img
                        src={matItem.imageFilename}
                        alt={matItem.name?.en ?? matId}
                        className="h-6 w-6 flex-shrink-0"
                      />
                    )}
                    <span className="truncate text-sm text-white">
                      {matItem?.name?.en ?? formatMaterialName(matId)}
                    </span>
                  </div>

                  <strong className="text-sm text-white">{amount}</strong>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
