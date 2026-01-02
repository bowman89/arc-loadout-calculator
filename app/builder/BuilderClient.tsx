"use client";

import { useMemo, useState } from "react";
import { totalsForLoadout } from "../lib/calcCosts";
import type { Item as Weapon, Mats } from "../lib/calcCosts";

import { type Augment } from "../lib/getAugments";
import { type QuickUseItem as QuickUse } from "../lib/getQuickUse";
import { type Ammunition } from "../lib/getAmmo";

import { track } from "../lib/track";

/* ---------- types ---------- */
type Item = {
  id: string;
  name?: { en?: string };
  imageFilename?: string;
};

type LoadoutItem = {
  weapon: Weapon;
  quantity: number;
};

type LoadoutAugment = {
  augment: Augment;
  quantity: number;
};

type LoadoutQuickUse = {
  quickUse: QuickUse;
  quantity: number;
};

type LoadoutAmmo = {
  ammo: Ammunition;
  quantity: number;
};

type LoadoutRow = {
  key: string;
  item: { id: string; name?: { en?: string }; imageFilename?: string };
  quantity: number;
  remove: () => void;
};

/*-- GTM -- */


/* ---------- helpers ---------- */
function formatMaterialName(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="h-9 w-9 rounded-md bg-black/40 text-lg"
      >
        −
      </button>
      <div className="min-w-[32px] text-center font-semibold">{value}</div>
      <button
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 rounded-md bg-black/40 text-lg"
      >
        +
      </button>
    </div>
  );
}

/* ---------- component ---------- */
export default function BuilderClient({
  weapons,
  items,
  augments,
  quickUses,
  ammo = [],
}: {
  weapons: Weapon[];
  items: Item[];
  augments: Augment[];
  quickUses: QuickUse[];
  ammo?: Ammunition[];
}) {
  const [selectedWeaponId, setSelectedWeaponId] = useState("");
  const [weaponQty, setWeaponQty] = useState(1);
  const [weaponLoadout, setWeaponLoadout] = useState<LoadoutItem[]>([]);

  const [selectedAugmentId, setSelectedAugmentId] = useState("");
  const [augmentQty, setAugmentQty] = useState(1);
  const [augmentLoadout, setAugmentLoadout] = useState<LoadoutAugment[]>([]);

  const [selectedQuickUseId, setSelectedQuickUseId] = useState("");
  const [quickUseQty, setQuickUseQty] = useState(1);
  const [quickUseLoadout, setQuickUseLoadout] = useState<LoadoutQuickUse[]>([]);

  const [selectedAmmoId, setSelectedAmmoId] = useState("");
  const [ammoQty, setAmmoQty] = useState(1);
  const [ammoLoadout, setAmmoLoadout] = useState<LoadoutAmmo[]>([]);

  const weaponsById = useMemo(
    () => Object.fromEntries(weapons.map((w) => [w.id, w])),
    [weapons]
  );

  const itemsById = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items]
  );

  const augmentsById = useMemo(
    () => Object.fromEntries(augments.map((a) => [a.id, a])),
    [augments]
  );

  const quickUsesById = useMemo(
    () => Object.fromEntries(quickUses.map((q) => [q.id, q])),
    [quickUses]
  );

  const ammoById = useMemo(
    () => Object.fromEntries(ammo.map((a) => [a.id, a])),
    [ammo]
  );

  function addWeapon() {
    const weapon = weaponsById[selectedWeaponId];
    if (!weapon) return;
    
  track("add_weapon", {
    weapon_id: weapon.id,
    quantity: weaponQty,
  });

    setWeaponLoadout((p) => [...p, { weapon, quantity: weaponQty }]);
    setWeaponQty(1);
  }

  function addAugment() {
    const augment = augmentsById[selectedAugmentId];
    if (!augment) return;
    
  track("add_augmentShield", {
    augment_id: augment.id,
    quantity: augmentQty,
  });

    
    setAugmentLoadout((p) => [...p, { augment, quantity: augmentQty }]);
    setAugmentQty(1);
  }

  function addQuickUse() {
    const quickUse = quickUsesById[selectedQuickUseId];
    if (!quickUse) return;
    
  track("add_quickUse", {
    quickUse_id: quickUse.id,
    quantity: quickUseQty,
  });

    
    setQuickUseLoadout((p) => [...p, { quickUse, quantity: quickUseQty }]);
    setQuickUseQty(1);
  }

  function addAmmo() {
    const a = ammoById[selectedAmmoId];
    if (!a) return;
    
  track("add_ammo", {
    a_id: a.id,
    quantity: ammoQty,
  });

    
    setAmmoLoadout((p) => [...p, { ammo: a, quantity: ammoQty }]);
    setAmmoQty(1);
  }

  function clearAll() {
    setWeaponLoadout([]);
    setAugmentLoadout([]);
    setQuickUseLoadout([]);
    setAmmoLoadout([]);
  }

  function removeWeapon(index: number) {
    setWeaponLoadout((p) => p.filter((_, i) => i !== index));
  }
  function removeAugment(index: number) {
    setAugmentLoadout((p) => p.filter((_, i) => i !== index));
  }
  function removeQuickUse(index: number) {
    setQuickUseLoadout((p) => p.filter((_, i) => i !== index));
  }
  function removeAmmo(index: number) {
    setAmmoLoadout((p) => p.filter((_, i) => i !== index));
  }

  const weaponMaterials = useMemo(
    () => totalsForLoadout(weaponLoadout, weaponsById),
    [weaponLoadout, weaponsById]
  );

  const mergeMaterials = (...lists: Mats[]) =>
    lists.reduce((acc, list) => {
      for (const [k, v] of Object.entries(list)) {
        acc[k] = (acc[k] ?? 0) + v;
      }
      return acc;
    }, {} as Mats);

  const augmentMaterials = useMemo(() => {
    const totals: Mats = {};
    augmentLoadout.forEach(({ augment, quantity }) => {
      if (!augment.recipe) return;
      Object.entries(augment.recipe).forEach(
        ([k, v]) => (totals[k] = (totals[k] ?? 0) + v * quantity)
      );
    });
    return totals;
  }, [augmentLoadout]);

  const quickUseMaterials = useMemo(() => {
    const totals: Mats = {};
    quickUseLoadout.forEach(({ quickUse, quantity }) => {
      if (!quickUse.recipe) return;
      Object.entries(quickUse.recipe).forEach(
        ([k, v]) => (totals[k] = (totals[k] ?? 0) + v * quantity)
      );
    });
    return totals;
  }, [quickUseLoadout]);

  const ammoMaterials = useMemo(() => {
    const totals: Mats = {};
    ammoLoadout.forEach(({ ammo, quantity }) => {
      if (!ammo.recipe) return;
      Object.entries(ammo.recipe).forEach(
        ([k, v]) => (totals[k] = (totals[k] ?? 0) + v * quantity)
      );
    });
    return totals;
  }, [ammoLoadout]);

  const materialRows = Object.entries(
    mergeMaterials(
      weaponMaterials,
      augmentMaterials,
      quickUseMaterials,
      ammoMaterials
    )
  ).sort((a, b) => a[0].localeCompare(b[0]));

  const hasAnyLoadout = Boolean(
    weaponLoadout.length ||
      augmentLoadout.length ||
      quickUseLoadout.length ||
      ammoLoadout.length
  );

  // ✅ Flatten rows so TS never has to guess the type in render
  const currentRows: LoadoutRow[] = useMemo(() => {
    const rows: LoadoutRow[] = [];

    weaponLoadout.forEach((e, i) => {
      rows.push({
        key: `weapon-${i}`,
        item: e.weapon,
        quantity: e.quantity,
        remove: () => removeWeapon(i),
      });
    });

    augmentLoadout.forEach((e, i) => {
      rows.push({
        key: `augment-${i}`,
        item: e.augment,
        quantity: e.quantity,
        remove: () => removeAugment(i),
      });
    });

    quickUseLoadout.forEach((e, i) => {
      rows.push({
        key: `quickUse-${i}`,
        item: e.quickUse,
        quantity: e.quantity,
        remove: () => removeQuickUse(i),
      });
    });

    ammoLoadout.forEach((e, i) => {
      rows.push({
        key: `ammo-${i}`,
        item: e.ammo,
        quantity: e.quantity,
        remove: () => removeAmmo(i),
      });
    });

    return rows;
  }, [weaponLoadout, augmentLoadout, quickUseLoadout, ammoLoadout]);

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CURRENT LOADOUT */}
        <section className="rounded-xl bg-[#16181d] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold">Current loadout</h4>

            {/* ✅ Always render, but disabled when empty */}
            <button
              onClick={clearAll}
              disabled={!hasAnyLoadout}
              className={`text-sm px-3 py-1 rounded border
                ${
                  hasAnyLoadout
                    ? "cursor-pointer text-red-400 hover:text-red-300 border-red-400/30"
                    : "cursor-not-allowed text-white/30 border-white/10"
                }`}
            >
              Clear all
            </button>
          </div>

          {!hasAnyLoadout ? (
            <p className="text-sm text-[#A0A4AA]">No items added yet</p>
          ) : (
            <div className="space-y-2">
              {currentRows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center gap-3 rounded-lg bg-black/40 px-3 py-2"
                >
                  {row.item.imageFilename && (
                    <img
                      src={row.item.imageFilename}
                      className="h-8 w-8"
                      alt={row.item.name?.en ?? row.item.id}
                    />
                  )}

                  <div className="flex-1">
                    <div>{row.item.name?.en ?? row.item.id}</div>
                    <div className="text-sm opacity-70">Qty: {row.quantity}</div>
                  </div>

                  {/* ✅ Big click target + pointer on hover */}
                  <button
                    onClick={row.remove}
                    aria-label="Remove item"
                    title="Remove"
                    className="cursor-pointer text-red-400 hover:text-red-300 text-lg leading-none px-2 py-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MATERIALS */}
        <section className="rounded-xl bg-[#16181d] p-6">
          <h4 className="mb-4 font-semibold">Materials needed</h4>

          {materialRows.length === 0 ? (
            <p className="text-sm text-[#A0A4AA]">
              Add items to see required materials.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {materialRows.map(([matId, amount]) => {
                const matItem = itemsById[matId];
                return (
                  <div
                    key={matId}
                    className="inline-flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2"
                  >
                    {matItem?.imageFilename && (
                      <img
                        src={matItem.imageFilename}
                        className="h-6 w-6"
                        alt={matItem.name?.en ?? matId}
                      />
                    )}
                    <span className="text-sm">
                      {matItem?.name?.en ?? formatMaterialName(matId)}
                    </span>
                    <span className="rounded-full bg-white/10 px-2 text-sm">
                      {amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* INPUT GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* WEAPON */}
        <section className="rounded-xl bg-[#16181d] p-6">
          <h4 className="mb-4 font-semibold">Add weapon</h4>
          <select
            value={selectedWeaponId}
            onChange={(e) => setSelectedWeaponId(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-black"
          >
            <option value="">Select weapon</option>
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name?.en ?? w.id}
              </option>
            ))}
          </select>

          <QuantityControl value={weaponQty} onChange={setWeaponQty} />

          <button
            id="btn-add-weapon"
            data-action="add_weappon"
            onClick={addWeapon}
            className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
          >
            Add weapon
          </button>
        </section>

        {/* AUGMENT */}
        <section className="rounded-xl bg-[#16181d] p-6">
          <h4 className="mb-4 font-semibold">Add augment / Shield</h4>
          <select
            value={selectedAugmentId}
            onChange={(e) => setSelectedAugmentId(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-black"
          >
            <option value="">Select augment</option>
            {augments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name?.en ?? a.id}
              </option>
            ))}
          </select>

          <QuantityControl value={augmentQty} onChange={setAugmentQty} />

          <button
            id="btn-add-augmentShield"
            data-action="add_augmentShield"
            onClick={addAugment}
            className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
          >
            Add augment / shield
          </button>
        </section>

        {/* CONSUMABLE */}
        <section className="rounded-xl bg-[#16181d] p-6">
          <h4 className="mb-4 font-semibold">Add consumable</h4>
          <select
            value={selectedQuickUseId}
            onChange={(e) => setSelectedQuickUseId(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-black"
          >
            <option value="">Select consumable</option>
            {quickUses.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name?.en ?? q.id}
              </option>
            ))}
          </select>

          <QuantityControl value={quickUseQty} onChange={setQuickUseQty} />

          <button
            onClick={addQuickUse}
            className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
          >
            Add consumable
          </button>
        </section>

        {/* AMMO */}
        <section className="rounded-xl bg-[#16181d] p-6">
          <h4 className="mb-4 font-semibold">Add ammo</h4>
          <select
            value={selectedAmmoId}
            onChange={(e) => setSelectedAmmoId(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-black"
          >
            <option value="">Select ammo</option>
            {ammo.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name?.en ?? a.id}
              </option>
            ))}
          </select>

          <QuantityControl value={ammoQty} onChange={setAmmoQty} />

          <button
            onClick={addAmmo}
            className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
          >
            Add ammo
          </button>
        </section>
      </div>
    </div>
  );
}
