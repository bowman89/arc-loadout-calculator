"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* ─────────────────────────────────────
   TYPES
───────────────────────────────────── */

export type RecycleSource = {
  sourceItemId: string;
  sourceName?: string;
  amount: number;
};

export type RecycleGraph = Record<string, RecycleSource[]>;

export type MaterialMeta = {
  id: string;
  name?: string;
  imageFilename?: string;
};

/* ─────────────────────────────────────
   COMPONENT
───────────────────────────────────── */

export default function RecycleLabClient({
  graph,
  materialsById = {},
}: {
  graph: RecycleGraph;
  materialsById?: Record<string, MaterialMeta>;
}) {
  const materialIds = Object.keys(graph).sort();

  const [targetMaterial, setTargetMaterial] = useState("");
  const [showFullList, setShowFullList] = useState(false);

  function formatFallbackName(id: string) {
    return id.replace(/_/g, " ");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-28 space-y-16 text-white">
      {/* ─────────────────────────────────────
          RECYCLE PLAYGROUND
      ───────────────────────────────────── */}
      <section
        className="rounded-2xl border p-8 space-y-6"
        style={{
          backgroundColor: "#16181D",
          borderColor: "rgba(201,180,0,0.35)",
          boxShadow: `
            0 0 0 1px rgba(201,180,0,0.25),
            0 0 24px rgba(201,180,0,0.12)
          `,
        }}
      >
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Recycle Playground</h2>
          <p className="text-xs text-[#A0A4AA]">
            Designed to be used together with the{" "}
            <span className="text-[#C9B400]">Loadout Calculator</span> for smarter raid planning.
          </p>
        </div>

        {/* Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#A0A4AA]">
          <div className="flex items-start gap-2">
            <span className="text-[#C9B400] font-semibold">1.</span>
            <span>
              Identify missing materials in the{" "}
              <span className="text-[#C9B400]">Calculator</span>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-[#C9B400] font-semibold">2.</span>
            <span>See which loot recycles into those materials</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-[#C9B400] font-semibold">3.</span>
            <span>Enter raids knowing what’s worth extracting</span>
          </div>
        </div>

        {/* Material select */}
        <select
          value={targetMaterial}
          onChange={(e) => setTargetMaterial(e.target.value)}
          className="
            w-full rounded-md
            bg-black/60 border border-white/10
            px-3 py-2 text-sm text-white
            focus:outline-none focus:border-[#C9B400]/60
          "
        >
          <option value="">Select material you need</option>

          {materialIds.map((id) => {
            const mat = materialsById[id];

            return (
              <option key={id} value={id}>
                {mat?.name ?? formatFallbackName(id)}
              </option>
            );
          })}
        </select>

        {/* Results */}
        {targetMaterial && (
  <div className="space-y-2 pt-2">
    {graph[targetMaterial]?.map((src) => {
      const itemMeta = materialsById[src.sourceItemId];

      return (
        <div
          key={src.sourceItemId}
          className="
            flex items-center justify-between
            rounded-md px-4 py-2
            bg-black/40 text-sm
          "
        >
          <div className="flex items-center gap-3">
            {itemMeta?.imageFilename && (
              <img
                src={itemMeta.imageFilename}
                alt={itemMeta.name ?? src.sourceItemId}
                className="h-6 w-6"
              />
            )}

            <span className="text-[#E5E7EB]">
              {itemMeta?.name ?? src.sourceName ?? src.sourceItemId}
            </span>
          </div>

          <span className="text-[#A0A4AA]">
            → {src.amount}
          </span>
        </div>
      );
    })}
  </div>
)}

      </section>

      {/* ─────────────────────────────────────
          TOGGLE FULL LIST
      ───────────────────────────────────── */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowFullList((v) => !v)}
          className="
            inline-flex items-center gap-2
            rounded-md border border-[#C9B400]
            px-4 py-2
            text-xs font-medium
            text-[#A0A4AA]
            transition
            hover:text-white
            hover:border-[#C9B400]/40
            group
          "
        >
          <span>
            {showFullList
              ? "Hide full recycle reference"
              : "Show full recycle reference"}
          </span>

          <ChevronDown
            size={14}
            className={`
              transition-transform
              ${showFullList ? "rotate-180" : "rotate-0"}
              group-hover:text-[#C9B400]
            `}
          />
        </button>
      </div>

      {/* ─────────────────────────────────────
          FULL LIST
      ───────────────────────────────────── */}
      {showFullList && (
        <section className="space-y-10 pt-6">
          {materialIds.map((id) => {
            const mat = materialsById[id];

            return (
              <div key={id} className="rounded-xl bg-[#16181D] p-5 space-y-3">
                <div className="flex items-center gap-3">
                  {mat?.imageFilename && (
                    <img
                      src={mat.imageFilename}
                      alt={mat.name ?? id}
                      className="h-6 w-6"
                    />
                  )}

                  <h3 className="font-semibold text-lg">
                    {mat?.name ?? formatFallbackName(id)}
                  </h3>
                </div>

                <div className="space-y-1">
                  {graph[id]?.map((src) => (
                    <div
                      key={src.sourceItemId}
                      className="
                        flex justify-between
                        rounded px-3 py-1.5
                        bg-black/40 text-sm
                      "
                    >
                      <span className="text-[#D1D5DB]">
                        {src.sourceName ?? src.sourceItemId}
                      </span>

                      <span className="text-[#9CA3AF]">
                        → {src.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
