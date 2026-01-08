// app/recycle-lab/page.tsx
import Image from "next/image";
import recycleHero from "@/app/components/Recycle-lab-img.png";
import { getRecycleGraph } from "../lib/getRecycleGraph";
import { getMaterialsById } from "../lib/getMaterialsById";
import RecycleLabClient from "./RecycleLabClient";
import Footer from "../components/Footer";

// THEME COLORS
const COLORS = {
  dark: "#0E0F12",
  darkSoft: "#16181D",
  darkCard: "#1C1F26",
  accent: "#C9B400",
  accentDark: "#B3A200",
  textLight: "#FFFFFF",
  mutedLight: "#A0A4AA",
  mutedDark: "#6B7077",
};

export default function RecycleLabPage() {
  const graph = getRecycleGraph();
  const materialsById = getMaterialsById();

  return (
    <div className="relative">
{/* ─────────────────────────────────────
    HERO SECTION
───────────────────────────────────── */}
<section className="relative overflow-hidden">
  {/* Background image */}
  <Image
    src={recycleHero}
    alt="Recycle Lab"
    fill
    priority
    className="object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 pointer-events-none" />

  {/* Content */}
  <div className="relative mx-auto max-w-6xl px-6 py-36 text-center pointer-events-auto">

    {/* Context label */}
    <p
      className="mb-4 text-xs uppercase tracking-widest"
      style={{ color: COLORS.accentDark }}
    >
      A Loadout CALC Experimental Tool
    </p>

    {/* Main title */}
    <h1 className="text-4xl sm:text-6xl font-semibold text-white">
      Recycle Lab
    </h1>

    {/* Accent line (key value prop) */}
    <p
      className="mx-auto mt-6 max-w-3xl text-xl sm:text-2xl leading-relaxed underline"
      style={{ color: COLORS.accent }}
    >
      Not all loot is worth extracting!
    </p>

    {/* Supporting explanation */}
    <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#A0A4AA]">
      <span className="font-medium text-[#D9B400]">Recycle Lab</span> helps you decide what’s worth keeping when your backpack is full.
Use it together with the Loadout Calculator to turn missing materials into clear loot priorities.
    </p>

  </div>
  
</section>



      {/* TOOL */}
          <RecycleLabClient
      graph={graph}
      materialsById={materialsById}
    />

      <Footer />
    </div>
  );
}
