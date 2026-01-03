"use client";

import { useMemo, useState } from "react";
import { totalsForLoadout } from "../lib/calcCosts";
import type { Item as Weapon, Mats } from "../lib/calcCosts";

import { type Augment } from "../lib/getAugments";
import { type QuickUseItem as QuickUse } from "../lib/getQuickUse";
import { type Ammunition } from "../lib/getAmmo";
import { type ModificationItem } from "../lib/getModifications";
import { type Shield } from "../lib/getShields";

import { track } from "../lib/track";



/* ─────────────────────────────────────
   TYPES
───────────────────────────────────── */
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

type LoadoutModification = {
  modification: ModificationItem;
  quantity: number;
};

type LoadoutShield ={
  shield: Shield;
  quantity: number;
}

type LoadoutRow = {
  key: string;
  item: {
    id: string;
    name?: { en?: string };
    imageFilename?: string;
  };
  quantity: number;
  remove: () => void;
};

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
function formatMaterialName(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function QuantityControl({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 rounded-md bg-black/40 text-lg"
      >
        −
      </button>

      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isNaN(next)) return;
          onChange(Math.max(min, next));
        }}
        onFocus={(e) => e.target.select()}
        className="
          w-20
          h-9
          rounded-md
          bg-white
          text-black
          text-center
          font-semibold
          leading-none
          px-0
          appearance-none
        "
      />

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 rounded-md bg-black/40 text-lg"
      >
        +
      </button>
    </div>
  );
}

function hasCraftQuantity(
  item: unknown
): item is { craftQuantity: number } {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  if (!("craftQuantity" in item)) {
    return false;
  }

  return typeof (item as Record<string, unknown>).craftQuantity === "number";
}


function getDisplayQuantity(item: unknown, quantity: number) {
  return hasCraftQuantity(item)
    ? quantity * item.craftQuantity
    : quantity;
}

type InputCardKey =
  | "weapon"
  | "augment"
  | "shield"
  | "quickUse"
  | "ammo"
  | "modification";

type InputCard = {
  order: number;
  key: InputCardKey;
};


/* ─────────────────────────────────────
   COMPONENT
───────────────────────────────────── */
export default function BuilderClient({
  weapons,
  items,
  augments,
  shields,
  quickUses,
  ammo = [],
  modifications,
}: {
  weapons: Weapon[];
  items: Item[];
  augments: Augment[];
  shields: Shield[];
  quickUses: QuickUse[];
  ammo?: Ammunition[];
  modifications: ModificationItem[];
}) {
  /* ───────── STATE ───────── */
  const [selectedWeaponId, setSelectedWeaponId] = useState("");
  const [weaponQty, setWeaponQty] = useState(1);
  const [weaponLoadout, setWeaponLoadout] = useState<LoadoutItem[]>([]);

  type WeaponCostMode = "total" | "upgrade";
  const [weaponCostMode, setWeaponCostMode] =
    useState<WeaponCostMode>("total");

  const [selectedAugmentId, setSelectedAugmentId] = useState("");
  const [augmentQty, setAugmentQty] = useState(1);
  const [augmentLoadout, setAugmentLoadout] = useState<LoadoutAugment[]>([]);

  const [selectedShieldId, setSelectedShieldId] = useState("");
  const [shieldQty, setShieldQty] = useState(1);
  const [shieldLoadout, setShieldLoadout] = useState<LoadoutShield[]>([]);


  const [selectedQuickUseId, setSelectedQuickUseId] = useState("");
  const [quickUseQty, setQuickUseQty] = useState(1);
  const [quickUseLoadout, setQuickUseLoadout] = useState<LoadoutQuickUse[]>([]);

  const [selectedAmmoId, setSelectedAmmoId] = useState("");
  const [ammoQty, setAmmoQty] = useState(1);
  const [ammoLoadout, setAmmoLoadout] = useState<LoadoutAmmo[]>([]);

  const [selectedModificationId, setSelectedModificationId] = useState("");
  const [modificationQty, setModificationQty] = useState(1);
  const [modificationLoadout, setModificationLoadout] = useState<LoadoutModification[]>([]);

  /* ───────── LOOKUP MAPS ───────── */
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

  const shieldsById = useMemo(
  () => Object.fromEntries(shields.map((s) => [s.id, s])),
  [shields]
  );


  const quickUsesById = useMemo(
    () => Object.fromEntries(quickUses.map((q) => [q.id, q])),
    [quickUses]
  );

  const ammoById = useMemo(
    () => Object.fromEntries(ammo.map((a) => [a.id, a])),
    [ammo]
  );

  const modificationsById = useMemo(
    () => Object.fromEntries(modifications.map((m) => [m.id, m])),
    [modifications]
  );

  /* ───────── ADD HANDLERS ───────── */
  function addWeapon() {
    const weapon = weaponsById[selectedWeaponId];
    if (!weapon) return;

    track("add_weapon", {
      weapon_id: weapon.id,
      quantity: weaponQty,
    });

    setWeaponLoadout((prev) => {
      const index = prev.findIndex((e) => e.weapon.id === weapon.id);
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index
            ? { ...e, quantity: e.quantity + weaponQty }
            : e
        );
      }
      return [...prev, { weapon, quantity: weaponQty }];
    });

    setWeaponQty(1);
  }

  function addAugment() {
    const augment = augmentsById[selectedAugmentId];
    if (!augment) return;

    track("add_augmentShield", {
      augment_id: augment.id,
      quantity: augmentQty,
    });

    setAugmentLoadout((prev) => {
      const index = prev.findIndex((e) => e.augment.id === augment.id);
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index
            ? { ...e, quantity: e.quantity + augmentQty }
            : e
        );
      }
      return [...prev, { augment, quantity: augmentQty }];
    });

    setAugmentQty(1);
  }

  function addShield() {
    const shield = shieldsById[selectedShieldId];
    if (!shield) return;

    track("add_shield", {
      shield_id: shield.id,
      quantity: shieldQty,
    });

    setShieldLoadout((prev) => {
      const index = prev.findIndex((e) => e.shield.id === shield.id);
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index
            ? { ...e, quantity: e.quantity + shieldQty }
            : e
        );
      }
      return [...prev, { shield, quantity: shieldQty }];
    });

    setShieldQty(1);
  }


  function addQuickUse() {
    const quickUse = quickUsesById[selectedQuickUseId];
    if (!quickUse) return;

    track("add_quickUse", {
      quickUse_id: quickUse.id,
      quantity: quickUseQty,
    });

    setQuickUseLoadout((prev) => {
      const index = prev.findIndex((e) => e.quickUse.id === quickUse.id);
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index
            ? { ...e, quantity: e.quantity + quickUseQty }
            : e
        );
      }
      return [...prev, { quickUse, quantity: quickUseQty }];
    });

    setQuickUseQty(1);
  }

  function addAmmo() {
    const ammoItem = ammoById[selectedAmmoId];
    if (!ammoItem) return;

    track("add_ammo", {
      a_id: ammoItem.id,
      quantity: ammoQty,
    });

    setAmmoLoadout((prev) => {
      const index = prev.findIndex((e) => e.ammo.id === ammoItem.id);
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index
            ? { ...e, quantity: e.quantity + ammoQty }
            : e
        );
      }
      return [...prev, { ammo: ammoItem, quantity: ammoQty }];
    });

    setAmmoQty(1);
  }

  function addModification() {
    const modification = modificationsById[selectedModificationId];
    if (!modification) return;

    setModificationLoadout((prev) => {
      const index = prev.findIndex(
        (e) => e.modification.id === modification.id
      );
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index
            ? { ...e, quantity: e.quantity + modificationQty }
            : e
        );
      }
      return [...prev, { modification, quantity: modificationQty }];
    });

    setModificationQty(1);
  }

  /* ───────── REMOVE / CLEAR ───────── */
  function clearAll() {
    setWeaponLoadout([]);
    setAugmentLoadout([]);
    setShieldLoadout([]);
    setQuickUseLoadout([]);
    setAmmoLoadout([]);
    setModificationLoadout([]);
  }

  function removeWeapon(i: number) {
    setWeaponLoadout((p) => p.filter((_, idx) => idx !== i));
  }
  function removeAugment(i: number) {
    setAugmentLoadout((p) => p.filter((_, idx) => idx !== i));
  }
  function removeShield(i: number) {
  setShieldLoadout((p) => p.filter((_, idx) => idx !== i));
  }
  function removeQuickUse(i: number) {
    setQuickUseLoadout((p) => p.filter((_, idx) => idx !== i));
  }
  function removeAmmo(i: number) {
    setAmmoLoadout((p) => p.filter((_, idx) => idx !== i));
  }
  function removeModification(i: number) {
    setModificationLoadout((p) => p.filter((_, idx) => idx !== i));
  }

  /* ───────── MATERIAL CALCS ───────── */
  const weaponMaterials = useMemo(
    () => totalsForLoadout(weaponLoadout, weaponsById, weaponCostMode),
    [weaponLoadout, weaponsById, weaponCostMode]
  );

  const mergeMaterials = (...lists: Mats[]) =>
    lists.reduce((acc, list) => {
      Object.entries(list).forEach(([k, v]) => {
        acc[k] = (acc[k] ?? 0) + v;
      });
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

  const shieldMaterials = useMemo(() => {
  const totals: Mats = {};
  shieldLoadout.forEach(({ shield, quantity }) => {
    if (!shield.recipe) return;
    Object.entries(shield.recipe).forEach(
      ([k, v]) => (totals[k] = (totals[k] ?? 0) + v * quantity)
    );
  });
  return totals;
  }, [shieldLoadout]);


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

  const modificationMaterials = useMemo(() => {
    const totals: Mats = {};
    modificationLoadout.forEach(({ modification, quantity }) => {
      if (!modification.recipe) return;
      Object.entries(modification.recipe).forEach(
        ([k, v]) => (totals[k] = (totals[k] ?? 0) + v * quantity)
      );
    });
    return totals;
  }, [modificationLoadout]);

  const materialRows = Object.entries(
    mergeMaterials(
      weaponMaterials,
      augmentMaterials,
      shieldMaterials,
      quickUseMaterials,
      ammoMaterials,
      modificationMaterials
    )
  ).sort((a, b) => a[0].localeCompare(b[0]));

  const hasAnyLoadout =
    weaponLoadout.length ||
    augmentLoadout.length ||
    shieldLoadout.length ||
    quickUseLoadout.length ||
    ammoLoadout.length ||
    modificationLoadout.length;

  /* ───────── FLATTEN LOADOUT ───────── */
  const currentRows: LoadoutRow[] = useMemo(() => {
    const rows: LoadoutRow[] = [];

    weaponLoadout.forEach((e, i) =>
      rows.push({
        key: `weapon-${i}`,
        item: e.weapon,
        quantity: e.quantity,
        remove: () => removeWeapon(i),
      })
    );

    augmentLoadout.forEach((e, i) =>
      rows.push({
        key: `augment-${i}`,
        item: e.augment,
        quantity: e.quantity,
        remove: () => removeAugment(i),
      })
    );

    shieldLoadout.forEach((e, i) =>
      rows.push({
        key: `shield-${i}`,
        item: e.shield,
        quantity: e.quantity,
        remove: () => removeShield(i),
      })
    );
    
    quickUseLoadout.forEach((e, i) =>
      rows.push({
        key: `quickUse-${i}`,
        item: e.quickUse,
        quantity: e.quantity,
        remove: () => removeQuickUse(i),
      })
    );

    ammoLoadout.forEach((e, i) =>
      rows.push({
        key: `ammo-${i}`,
        item: e.ammo,
        quantity: e.quantity,
        remove: () => removeAmmo(i),
      })
    );

    modificationLoadout.forEach((e, i) =>
      rows.push({
        key: `modification-${i}`,
        item: e.modification,
        quantity: e.quantity,
        remove: () => removeModification(i),
      })
    );

    return rows;
  }, [
    weaponLoadout,
    augmentLoadout,
    shieldLoadout,
    quickUseLoadout,
    ammoLoadout,
    modificationLoadout,
  ]);

const inputCards: InputCard[] = [
  { order: 1, key: "weapon" },
  { order: 4, key: "augment" },
  { order: 5, key: "shield" },
  { order: 6, key: "quickUse" },
  { order: 3, key: "ammo" },
  { order: 2, key: "modification" },
];


 /* ---------- UI ---------- */
return (
  <div className="space-y-6">
{/* INPUT GRID */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {inputCards
    .sort((a, b) => a.order - b.order)
    .map(({ key }) => {
      switch (key) {
        case "weapon":
          return (
            <section key={key} className="rounded-xl bg-[#16181d] p-6">
              {/* WEAPON */}
              <div className="mb-3 relative flex items-center">
  <h4 className="absolute left-1/2 -translate-x-1/2 font-semibold">Weapon</h4>

                <div className="flex rounded-md bg-black/40 p-0.5 text-sm">
                  <button
                    type="button"
                    onClick={() => setWeaponCostMode("total")}
                    className={`px-2 py-0.5 rounded transition ${
                      weaponCostMode === "total"
                        ? "bg-[#C9B400] text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Total
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeaponCostMode("upgrade")}
                    className={`px-2 py-0.5 rounded transition ${
                      weaponCostMode === "upgrade"
                        ? "bg-[#C9B400] text-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Upgrade
                  </button>
                </div>
              </div>

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
                onClick={addWeapon}
                className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
              >
                Add Weapon
              </button>
            </section>
          );

        case "augment":
          return (
            <section key={key} className="rounded-xl bg-[#16181d] p-6">
              <h4 className="mb-4 font-semibold text-center">Augment</h4>

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
                onClick={addAugment}
                className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
              >
                Add Augment
              </button>
            </section>
          );

        case "shield":
          return (
            <section key={key} className="rounded-xl bg-[#16181d] p-6">
              <h4 className="mb-4 font-semibold text-center">Shields</h4>

              <select
                value={selectedShieldId}
                onChange={(e) => setSelectedShieldId(e.target.value)}
                className="w-full rounded-md bg-white px-3 py-2 text-black"
              >
                <option value="">Select shield</option>
                {shields.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name?.en ?? s.id}
                  </option>
                ))}
              </select>

              <QuantityControl value={shieldQty} onChange={setShieldQty} />

              <button
                onClick={addShield}
                className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
              >
                Add Shield
              </button>
            </section>
          );

        case "quickUse":
          return (
            <section key={key} className="rounded-xl bg-[#16181d] p-6">
              <h4 className="mb-4 font-semibold text-center">Quick Use</h4>

              <select
                value={selectedQuickUseId}
                onChange={(e) => setSelectedQuickUseId(e.target.value)}
                className="w-full rounded-md bg-white px-3 py-2 text-black"
              >
                <option value="">Select quick use</option>
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
          );

        case "ammo":
          return (
            <section key={key} className="rounded-xl bg-[#16181d] p-6">
              <h4 className="mb-4 font-semibold text-center">Ammo</h4>

              <select
                value={selectedAmmoId}
                onChange={(e) => setSelectedAmmoId(e.target.value)}
                className="w-full rounded-md bg-white px-3 py-2 text-black"
              >
                <option value="">Select ammo</option>
                {ammo.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name?.en ?? a.id} (x{a.craftQuantity ?? 25})
                  </option>
                ))}
              </select>

              <QuantityControl value={ammoQty} onChange={setAmmoQty} />

              <button
                onClick={addAmmo}
                className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
              >
                Add Ammo
              </button>
            </section>
          );

        case "modification":
          return (
            <section key={key} className="rounded-xl bg-[#16181d] p-6">
              <h4 className="mb-4 font-semibold text-center">Modification</h4>

              <select
                value={selectedModificationId}
                onChange={(e) => setSelectedModificationId(e.target.value)}
                className="w-full rounded-md bg-white px-3 py-2 text-black"
              >
                <option value="">Select Modification</option>
                {modifications.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name?.en ?? m.id}
                  </option>
                ))}
              </select>

              <QuantityControl
                value={modificationQty}
                onChange={setModificationQty}
              />

              <button
                onClick={addModification}
                className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
              >
                Add Modification
              </button>
            </section>
          );

        default:
          return null;
      }
    })}
</div>


    {/* LOADOUT + MATERIALS */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* CURRENT LOADOUT */}
      <section className="rounded-xl bg-[#16181d] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold">Current loadout</h4>

          <button
            onClick={clearAll}
            disabled={!hasAnyLoadout}
            className={`text-sm rounded border px-3 py-1 ${
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
                    alt={row.item.name?.en ?? row.item.id}
                    className="h-8 w-8"
                  />
                )}

                <div className="flex-1">
                  <div>{row.item.name?.en ?? row.item.id}</div>
                  <div className="text-sm opacity-70">
                    Qty: {getDisplayQuantity(row.item, row.quantity)}
                  </div>
                </div>

                <button
                  onClick={row.remove}
                  aria-label="Remove item"
                  title="Remove"
                  className="px-2 py-1 text-lg leading-none text-red-400 hover:text-red-300"
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
  <span className="block mt-1 text-[#C9B400]/40">
    Note: Tier I weapons do not require upgrade materials — materials will only appear for Tier II weapons and above.
  </span>
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
                      alt={matItem.name?.en ?? matId}
                      className="h-6 w-6"
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
  </div>
);
}