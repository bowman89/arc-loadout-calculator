"use client";

import { useMemo, useState, useEffect } from "react";
import { totalsForLoadout } from "../lib/calcCosts";
import type { Item as Weapon, Mats } from "../lib/calcCosts";
import { Search } from "lucide-react";

import { type Augment } from "../lib/getAugments";
import { type QuickUseItem as QuickUse } from "../lib/getQuickUse";
import { type Ammunition } from "../lib/getAmmo";
import { type ModificationItem } from "../lib/getModifications";
import { type Shield } from "../lib/getShields";
import { type Material } from "../lib/getMaterials";

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

type LoadoutExtraMaterial = {
  material: Material;
  quantity: number;
};

type LoadoutShield = {
  shield: Shield;
  quantity: number;
};

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
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getItemLabel(item?: { name?: { en?: string } }, fallback?: string) {
  return item?.name?.en ?? fallback ?? "Unknown";
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

function hasCraftQuantity(item: unknown): item is { craftQuantity: number } {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  if (!("craftQuantity" in item)) {
    return false;
  }

  return typeof (item as Record<string, unknown>).craftQuantity === "number";
}

function getDisplayQuantity(item: unknown, quantity: number) {
  return hasCraftQuantity(item) ? quantity * item.craftQuantity : quantity;
}

type InputCardKey =
  | "weapon"
  | "augment"
  | "shield"
  | "quickUse"
  | "ammo"
  | "modification"
  | "extraMaterial";

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
  materials,
  recycleGraph,
}: {
  weapons: Weapon[];
  items: Item[];
  augments: Augment[];
  shields: Shield[];
  quickUses: QuickUse[];
  ammo?: Ammunition[];
  modifications: ModificationItem[];
  materials: Material[];
  recycleGraph: Record<
    string,
    {
      sourceItemId: string;
      sourceName?: string;
      amount: number;
    }[]
  >;
}) {
  /* ───────── STATE ───────── */
  const [selectedWeaponId, setSelectedWeaponId] = useState("");
  const [weaponQty, setWeaponQty] = useState(1);
  const [weaponLoadout, setWeaponLoadout] = useState<LoadoutItem[]>([]);

  type WeaponCostMode = "total" | "upgrade";
  const [weaponCostMode, setWeaponCostMode] = useState<WeaponCostMode>("total");

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
  const [modificationLoadout, setModificationLoadout] = useState<
    LoadoutModification[]
  >([]);

  // Track how many materials the user already has (for progress / done state)
  const [materialHave, setMaterialHave] = useState<Record<string, number>>({});

  const [extraMaterialLoadout, setExtraMaterialLoadout] = useState<
    LoadoutExtraMaterial[]
  >([]);

  const [selectedExtraMaterialId, setSelectedExtraMaterialId] = useState("");
  const [extraMaterialQty, setExtraMaterialQty] = useState(1);

  // Recycle modal state
  const [recycleMaterialId, setRecycleMaterialId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!recycleMaterialId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRecycleMaterialId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [recycleMaterialId]);

  function updateMaterialHave(matId: string, value: number) {
    setMaterialHave((prev) => ({
      ...prev,
      [matId]: Math.max(0, value),
    }));
  }

  function resetMaterialHave() {
    setMaterialHave({});
  }

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

  // Recycle data
  const materialsById = useMemo(
    () => Object.fromEntries(materials.map((m) => [m.id, m])),
    [materials]
  );

  const allItemsById = useMemo(
    () => ({
      ...itemsById,
      ...materialsById,
    }),
    [itemsById, materialsById]
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
          i === index ? { ...e, quantity: e.quantity + weaponQty } : e
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
          i === index ? { ...e, quantity: e.quantity + augmentQty } : e
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
          i === index ? { ...e, quantity: e.quantity + shieldQty } : e
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
          i === index ? { ...e, quantity: e.quantity + quickUseQty } : e
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
          i === index ? { ...e, quantity: e.quantity + ammoQty } : e
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
          i === index ? { ...e, quantity: e.quantity + modificationQty } : e
        );
      }
      return [...prev, { modification, quantity: modificationQty }];
    });

    setModificationQty(1);
  }

  function addExtraMaterial() {
    const material = materials.find((m) => m.id === selectedExtraMaterialId);
    if (!material) return;

    setExtraMaterialLoadout((prev) => {
      const index = prev.findIndex((e) => e.material.id === material.id);
      if (index !== -1) {
        return prev.map((e, i) =>
          i === index ? { ...e, quantity: e.quantity + extraMaterialQty } : e
        );
      }
      return [...prev, { material, quantity: extraMaterialQty }];
    });

    setExtraMaterialQty(1);
  }

  /* ───────── REMOVE / CLEAR ───────── */
  function clearAll() {
    setWeaponLoadout([]);
    setAugmentLoadout([]);
    setShieldLoadout([]);
    setQuickUseLoadout([]);
    setAmmoLoadout([]);
    setModificationLoadout([]);

    resetMaterialHave();
  }

  function removeWeapon(i: number) {
    setWeaponLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
  }
  function removeAugment(i: number) {
    setAugmentLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
  }
  function removeShield(i: number) {
    setShieldLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
  }
  function removeQuickUse(i: number) {
    setQuickUseLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
  }
  function removeAmmo(i: number) {
    setAmmoLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
  }
  function removeModification(i: number) {
    setModificationLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
  }

  function removeExtraMaterial(i: number) {
    setExtraMaterialLoadout((p) => p.filter((_, idx) => idx !== i));
    resetMaterialHave();
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

  const extraMaterialTotals = useMemo(() => {
    const totals: Mats = {};
    extraMaterialLoadout.forEach(({ material, quantity }) => {
      totals[material.id] = (totals[material.id] ?? 0) + quantity;
    });
    return totals;
  }, [extraMaterialLoadout]);

  const materialRows = Object.entries(
    mergeMaterials(
      weaponMaterials,
      augmentMaterials,
      shieldMaterials,
      quickUseMaterials,
      ammoMaterials,
      modificationMaterials,
      extraMaterialTotals
    )
  ).sort(([, amountA], [, amountB]) => amountB - amountA);

  const hasAnyLoadout =
    weaponLoadout.length ||
    augmentLoadout.length ||
    shieldLoadout.length ||
    quickUseLoadout.length ||
    ammoLoadout.length ||
    modificationLoadout.length ||
    Object.keys(extraMaterialTotals).length;

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

    extraMaterialLoadout.forEach((e, i) =>
      rows.push({
        key: `extra-material-${i}`,
        item: e.material,
        quantity: e.quantity,
        remove: () => removeExtraMaterial(i),
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
    extraMaterialLoadout,
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
                    {/* HEADER */}
                    <div className="mb-4">
                      {/* MOBILE HEADER */}
                      <div className="flex flex-col items-center gap-2 md:hidden">
                        <h4 className="font-semibold text-center">Weapon</h4>

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

                      {/* DESKTOP HEADER */}
                      <div className="relative hidden md:flex items-center justify-end">
                        <h4 className="absolute left-1/2 -translate-x-1/2 font-semibold">
                          Weapon
                        </h4>

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
                    </div>

                    {/* CONTENT */}
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

                    <QuantityControl
                      value={weaponQty}
                      onChange={setWeaponQty}
                    />

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

                    <QuantityControl
                      value={augmentQty}
                      onChange={setAugmentQty}
                    />

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

                    <QuantityControl
                      value={shieldQty}
                      onChange={setShieldQty}
                    />

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
                    <h4 className="mb-4 font-semibold text-center">
                      Quick Use
                    </h4>

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

                    <QuantityControl
                      value={quickUseQty}
                      onChange={setQuickUseQty}
                    />

                    <button
                      onClick={addQuickUse}
                      className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
                    >
                      Add quick use
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
                    <h4 className="mb-4 font-semibold text-center">
                      Modification
                    </h4>

                    <select
                      value={selectedModificationId}
                      onChange={(e) =>
                        setSelectedModificationId(e.target.value)
                      }
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
              case "extraMaterial":
                return (
                  <section key={key} className="rounded-xl bg-[#16181d] p-6">
                    <h4 className="mb-4 font-semibold text-center">
                      Extra Materials
                    </h4>

                    <select
                      value={selectedExtraMaterialId}
                      onChange={(e) =>
                        setSelectedExtraMaterialId(e.target.value)
                      }
                      className="w-full rounded-md bg-white px-3 py-2 text-black"
                    >
                      <option value="">Select material</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name?.en ?? m.id}
                        </option>
                      ))}
                    </select>

                    <QuantityControl
                      value={extraMaterialQty}
                      onChange={setExtraMaterialQty}
                      min={1}
                    />

                    <button
                      onClick={addExtraMaterial}
                      className="mt-4 w-full rounded-md bg-[#C9B400] px-4 py-2 font-semibold text-black"
                    >
                      Add Material
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
          <div className="mb-4">
            <h4 className="font-semibold">Materials needed</h4>
            <p className="text-xs text-[#A0A4AA] mt-1">
              Track what you need, what you already have, and what’s left to
              farm.
            </p>
            {materialRows.length > 0 && (
              <p className="mt-1 text-xs text-[#C9B400]/50 flex items-center gap-1">
                Click the <Search size={12} className="shrink-0" /> to view
                recycle sources
              </p>
            )}
          </div>

          {materialRows.length === 0 ? (
            <p className="text-sm text-[#A0A4AA]">
              Add items to see required materials.
              <span className="block mt-1 text-[#C9B400]/40">
                Note: Tier I weapons do not require upgrade materials —
                materials will only appear for Tier II weapons and above.
              </span>
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-1 text-xs text-[#A0A4AA]">
                <div className="flex-1">Material</div>
                <div className="w-14 text-center">Need</div>
                <div className="w-20 text-center">Have</div>
                <div className="w-20 text-center">Status</div>
              </div>

              {materialRows.map(([matId, amount]) => {
                const matItem = itemsById[matId];

                return (
                  <div
                    key={matId}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2
                      ${
                        (materialHave[matId] ?? 0) >= amount
                          ? "bg-green-500/10"
                          : "bg-black/40"
                      }
                    `}
                  >
                    {/* RECYCLE ICON + MATERIAL */}
                    <div className="flex items-center gap-2 flex-1 group">
                      {/* Loop icon */}
                      <button
                        type="button"
                        onClick={() => setRecycleMaterialId(matId)}
                        className="
    relative
    text-white/30
    transition
    group-hover:text-[#C9B400]
    group-hover:scale-110
    hover:text-[#C9B400]
    hover:scale-110
  "
                        aria-label="See recycle sources"
                      >
                        <Search size={16} />

                        {/* Tooltip – vises KUN når man hover loopen */}
                        <span
                          className="
      pointer-events-none
      absolute left-1/2 top-full mt-1
      -translate-x-1/2
      whitespace-nowrap
      rounded-md bg-black px-2 py-1
      text-xs text-white
      opacity-0
      hover:opacity-100
      transition
    "
                        >
                          See recycle sources
                        </span>
                      </button>

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
                    </div>

                    {/* NEEDED */}
                    <span className="w-14 text-center text-sm font-medium">
                      {amount}
                    </span>

                    {/* HAVE INPUT */}
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={materialHave[matId] ?? ""}
                      onChange={(e) =>
                        updateMaterialHave(matId, Number(e.target.value) || 0)
                      }
                      onFocus={(e) => e.target.select()}
                      className="w-20 rounded-md bg-white text-black text-center text-sm placeholder:text-gray-400"
                    />

                    {/* STATUS */}
                    <div className="w-20 text-center text-sm">
                      {(materialHave[matId] ?? 0) >= amount ? (
                        <span className="text-green-400">✔ Done</span>
                      ) : (
                        <span className="text-yellow-400">
                          {amount - (materialHave[matId] ?? 0)} left
                        </span>
                      )}
                    </div>
                    {/* RECYCLE MODAL */}
                    {recycleMaterialId && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <div
                          className="absolute inset-0 bg-black/70"
                          onClick={() => setRecycleMaterialId(null)}
                        />

                        {/* Modal */}
                        <div className="relative z-10 w-full max-w-lg rounded-xl bg-[#16181d] p-6">
                          {/* Header */}
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {recycleMaterialId &&
                                itemsById[recycleMaterialId]?.imageFilename && (
                                  <img
                                    src={
                                      itemsById[recycleMaterialId].imageFilename
                                    }
                                    alt={
                                      itemsById[recycleMaterialId]?.name?.en ??
                                      formatMaterialName(recycleMaterialId)
                                    }
                                    className="h-7 w-7"
                                  />
                                )}

                              <h3 className="text-lg font-semibold">
                                {recycleMaterialId &&
                                  (itemsById[recycleMaterialId]?.name?.en ??
                                    formatMaterialName(recycleMaterialId))}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => setRecycleMaterialId(null)}
                              className="text-lg text-white/60 hover:text-white"
                              aria-label="Close"
                            >
                              ×
                            </button>
                          </div>

                          {/* Body */}
                          {/* Recycle list */}
                          <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                            {recycleMaterialId &&
                              recycleGraph[recycleMaterialId]?.map((src) => {
                                const itemMeta = allItemsById[src.sourceItemId];

                                return (
                                  <div
                                    key={src.sourceItemId}
                                    className="flex items-center justify-between rounded-md bg-black/40 px-4 py-2 text-sm"
                                  >
                                    <div className="flex items-center gap-3">
                                      {itemMeta?.imageFilename && (
                                        <img
                                          src={itemMeta.imageFilename}
                                          alt={
                                            itemMeta.name?.en ??
                                            src.sourceName ??
                                            src.sourceItemId
                                          }
                                          className="h-6 w-6"
                                        />
                                      )}

                                      <span className="text-[#E5E7EB]">
                                        {getItemLabel(
                                          itemMeta,
                                          src.sourceName ?? src.sourceItemId
                                        )}
                                      </span>
                                    </div>

                                    <span className="text-[#A0A4AA]">
                                      <span className="text-[#C9B400] mr-40">
                                        →{" "}
                                      </span>
                                      <span className="text-[#A0A4AA]">x </span>
                                      {src.amount}
                                    </span>
                                  </div>
                                );
                              })}

                            {recycleMaterialId &&
                              (!recycleGraph[recycleMaterialId] ||
                                recycleGraph[recycleMaterialId].length ===
                                  0) && (
                                <p className="text-sm text-[#A0A4AA]">
                                  No known recycle sources for this material.
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* EXTRA MATERIALS */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="mb-3">
                  <h5 className="text-sm font-semibold">
                    Extra materials{" "}
                    <span className="opacity-50">(optional)</span>
                  </h5>
                  <p className="text-xs text-[#A0A4AA] mt-1">
                    Add materials you already have, or want to account for
                    manually.
                  </p>
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedExtraMaterialId}
                    onChange={(e) => setSelectedExtraMaterialId(e.target.value)}
                    className="flex-1 rounded-md bg-white px-3 py-2 text-black text-sm"
                  >
                    <option value="">Select material</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name?.en ?? m.id}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    value={extraMaterialQty}
                    onChange={(e) =>
                      setExtraMaterialQty(
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                    className="w-20 rounded-md bg-white text-black text-center text-sm"
                  />

                  <button
                    onClick={addExtraMaterial}
                    className="
                     rounded-md px-3 text-sm font-medium
                     bg-black/40 text-[#C9B400]
                     hover:bg-black/60
                   "
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
