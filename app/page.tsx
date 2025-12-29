import Image from "next/image";
import BuilderClient from "./builder/BuilderClient";

// SERVER DATA
import { getWeapons } from "./lib/getWeapons";
import { getItems } from "./lib/getItems";
import { getAugments } from "./lib/getAugments";
import { getQuickUse } from "./lib/getQuickUse";
import { getAmmo } from "./lib/getAmmo";

// ICONS
import {
  PackageCheck,
  Layers3,
  Repeat,
  Brain,
  Users,
  Calculator,
} from "lucide-react";

// IMAGE
import Mockup from "../public/mockup.png";
import SteamWhite from "../public/steam-white.png";

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

export default async function Home() {
  const weapons = getWeapons();
  const items = getItems();
  const augments = getAugments();
  const quickUses = getQuickUse();
  const ammo = getAmmo();

  return (
    <div style={{ backgroundColor: COLORS.dark, color: COLORS.textLight }}>

{/* ─────────────────────────────────────
    HERO SECTION
───────────────────────────────────── */}
<section
  className="relative bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://storage.googleapis.com/web-arc-raiders-cms-assets/temp/features/features-keyart.jpg')",
  }}
>
  {/* Overlay - no pointer events */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90 pointer-events-none" />

  {/* Content - allows pointer events */}
  <div className="relative mx-auto max-w-6xl px-6 py-40 text-center pointer-events-auto">
    <Image
      src="/logo-white.png"
      alt="ARC RAIDERS"
      width={420}
      height={120}
      priority
      className="mx-auto w-[280px] sm:w-[760px]"
    />

    <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">
      LOADOUT{" "}
      <span
        className="rounded-md px-3 py-1"
        style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
      >
        CALC
      </span>
    </h2>

    <h2 className="mt-10 text-3xl font-semibold sm:text-4xl text-white">
      Want a stash full of ready-to-raid loadouts?
    </h2>

    <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-200 sm:text-2xl leading-relaxed">
      Know exactly what to farm before every raid.
    </p>

    <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg leading-relaxed">
      <span className="font-medium text-white">LoadoutCALC</span> gives you instant material breakdowns
      for what you need to craft weapons, augments, ammo, and quick use items.
    </p>

    <a
      href="#calculator"
      className="mt-12 inline-block rounded-lg px-8 py-3 font-semibold transition hover:opacity-90"
      style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
    >
      Start Planning
    </a>

    {/* Developer credit below button */}
    <p className="mt-16 text-xs flex justify-center items-center gap-3 text-[#F4F4F5]">
      Built by <span className="font-medium text-white">BovleDK</span>

      {/* Steam link */}
      <a
        href="https://steamcommunity.com/profiles/76561198119149195/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Steam"
        className="hover:opacity-80 inline-flex items-center justify-center cursor-pointer"
      >
        <img src="/steam-white.png" alt="Steam" width="16" height="16" />

      </a>

      {/* Discord link */}
      <a
        href="https://discord.com/users/240202971915223043"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord"
        className="hover:opacity-80 inline-flex items-center justify-center cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#F4F4F5"
          viewBox="0 0 24 24"
        >
          <path d="M20.317 4.369A19.791 19.791 0 0 0 15.956 3c-.2.364-.426.85-.58 1.234a18.37 18.37 0 0 0-5.752 0A12.7 12.7 0 0 0 9.042 3c-1.86.315-3.627.92-5.271 1.869C.807 10.247-.26 16.007.201 21.693c2.201 1.612 4.86 2.49 7.602 2.307l.576-.675c-2.468-.559-4.735-1.647-6.84-3.243-.119-2.442.292-4.866 1.296-7.064.725-.176 1.462-.337 2.22-.475.304 1.466.978 2.839 1.938 4.006.088.107.186.208.287.309 1.034.248 2.11.38 3.205.384 1.095-.003 2.171-.136 3.205-.384.101-.101.2-.202.287-.309.96-1.167 1.634-2.54 1.938-4.006a24.65 24.65 0 0 1 2.22.475c1.004 2.198 1.415 4.622 1.296 7.064-2.105 1.596-4.372 2.684-6.84 3.243l.576.675c2.742.183 5.401-.695 7.602-2.307.46-5.686-.606-11.446-3.701-17.324zM9.6 15.72c-1.067 0-1.933-.978-1.933-2.184s.866-2.184 1.933-2.184c1.068 0 1.933.978 1.933 2.184S10.668 15.72 9.6 15.72zm4.8 0c-1.067 0-1.933-.978-1.933-2.184s.866-2.184 1.933-2.184c1.068 0 1.933.978 1.933 2.184s-.865 2.184-1.933 2.184z"/>
        </svg>
      </a>
    </p>
  </div>
</section>


      {/* ─────────────────────────────────────
          BENEFITS / VALUE PROPOSITION
      ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <p
          className="mb-3 text-xs uppercase tracking-widest"
          style={{ color: COLORS.accentDark }}
        >
          Why Use LoadoutCALC?
        </p>

        <h3 className="mb-12 text-3xl font-semibold">
          Smarter Loadouts. Less Grinding.
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl p-6 flex flex-col items-center text-center" style={{ backgroundColor: COLORS.darkCard }}>
            <Calculator className="mb-4 h-6 w-6 text-accent" />
            <h4 className="mb-2 font-semibold">Instant Calculations</h4>
            <p className="text-sm" style={{ color: COLORS.mutedLight }}>
              Get immediate material requirements as you build weapons and attachments.
            </p>
          </div>

          <div className="rounded-xl p-6 flex flex-col items-center text-center" style={{ backgroundColor: COLORS.darkCard }}>
            <Layers3 className="mb-4 h-6 w-6 text-accent" />
            <h4 className="mb-2 font-semibold">Combined Totals</h4>
            <p className="text-sm" style={{ color: COLORS.mutedLight }}>
              See total materials across your entire loadout without manual math.
            </p>
          </div>

          <div className="rounded-xl p-6 flex flex-col items-center text-center" style={{ backgroundColor: COLORS.darkCard }}>
            <Users className="mb-4 h-6 w-6 text-accent" />
            <h4 className="mb-2 font-semibold">Community-Driven Data</h4>
            <p className="text-sm" style={{ color: COLORS.mutedLight }}>
              Built on community-maintained ARC Raiders data.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          HOW IT WORKS SECTION
      ───────────────────────────────────── */}
      <section className="mt-24 py-24" style={{ backgroundColor: COLORS.darkSoft }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* TEXT */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest" style={{ color: COLORS.accentDark }}>
                How it works
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
                Plan smarter in 3 steps:
              </h2>

              <div className="mt-6 space-y-6 text-gray-300 text-sm sm:text-base">
                <div>
                  <h4 className="font-semibold text-white mb-1">1. Build your loadout</h4>
                  <p>Select your desired weapons, augments, ammo and quick use items.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">2. See exact materials needed</h4>
                  <p>Instantly get total crafting requirements – across your entire build.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">3. Farm with a plan</h4>
                  <p>Use the breakdown to collect only what you need. No overfarming.</p>
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                borderColor: COLORS.accentDark,
                backgroundColor: "rgba(255,255,255,0.02)",
                boxShadow: `
                  0 0 0 1px rgba(201,180,0,0.25),
                  0 0 24px rgba(201,180,0,0.12),
                  inset 0 0 0 1px rgba(255,255,255,0.02)
                `,
              }}
            >
              <Image
                src={Mockup}
                alt="Loadout calculator example"
                width={640}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          <a
            href="#calculator"
            className="mt-12 block mx-auto rounded-lg text-center px-8 py-3 font-semibold transition hover:opacity-90"
            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
          >
            Start Planning
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────
          ABOUT SECTION
      ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div
          className="relative rounded-2xl p-8 sm:p-12 border"
          style={{
            backgroundColor: COLORS.darkCard,
            borderColor: COLORS.accentDark,
            boxShadow: `
              0 0 0 1px rgba(201,180,0,0.25),
              0 0 24px rgba(201,180,0,0.12),
              inset 0 0 0 1px rgba(255,255,255,0.02)
            `,
          }}
        >
          <h3 className="mb-4 text-xl font-semibold">
            About the Loadout Calculator
          </h3>

          <div className="max-w-3xl space-y-4 text-sm leading-relaxed" style={{ color: COLORS.mutedLight }}>
            <p>
              The ARC Raiders Loadout Calculator is a fan-made utility built to help players plan weapon loadouts and attachments before deploying.
              It instantly calculates total crafting materials — eliminating guesswork and manual calculations.
            </p>

            <p>
              All crafting data is sourced from community-driven projects and continuously refined by dedicated ARC Raiders fans.
            </p>

            <p className="text-xs" style={{ color: COLORS.mutedDark }}>
              Contributions from the community are welcome.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          CALCULATOR SECTION
      ───────────────────────────────────── */}
      <section id="calculator" className="scroll-mt-24" style={{ backgroundColor: COLORS.darkSoft }}>
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div
            className="relative rounded-2xl p-8 border transition"
            style={{
              backgroundColor: COLORS.dark,
              borderColor: COLORS.accent,
              boxShadow: `
                0 0 0 1px rgba(201,180,0,0.35),
                0 0 32px rgba(201,180,0,0.18),
                0 12px 28px rgba(0,0,0,0.6)
              `,
            }}
          >
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: COLORS.accentDark }}>
                Loadout Calculator
              </p>

              <h3 className="text-2xl font-semibold">
                Build your raid loadout
              </h3>

            </div>

            <BuilderClient
              weapons={weapons}
              items={items}
              augments={augments}
              quickUses={quickUses}
              ammo={ammo}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          FOOTER
      ───────────────────────────────────── */}
      <footer className="px-6 py-16 text-center text-xs" style={{ backgroundColor: COLORS.dark }}>
        <div className="mx-auto max-w-4xl space-y-4 leading-relaxed" style={{ color: COLORS.mutedDark }}>
          <p>This is an unofficial fan-made tool for ARC RAIDERS.</p>

          <p>
            Crafting and item data is provided by the community and sourced from{" "}
            <a
              href="https://github.com/RaidTheory/arcraiders-data"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              RaidTheory – arcraiders-data
            </a>{" "}
            and{" "}
            <a
              href="https://arctracker.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              ArcTracker.io
            </a>.
          </p>

          <p>
            This project is licensed under the MIT License. ARC Raiders and all related assets are copyright © Embark Studios AB.
            This project is not affiliated with or endorsed by Embark Studios AB.
          </p>

          <p>
            Join the community on{" "}
            <a
              href="https://discord.gg/pAtQ4Aw8em"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              Discord
            </a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
