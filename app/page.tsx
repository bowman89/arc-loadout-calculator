import Image from "next/image";
import BuilderClient from "./builder/BuilderClient";

// SERVER DATA
import { getWeapons } from "./lib/getWeapons";
import { getItems } from "./lib/getItems";
import { getAugments } from "./lib/getAugments";
import { getQuickUse } from "./lib/getQuickUse";
import { getAmmo } from "./lib/getAmmo"; // ✅ brug din lib-loader

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
  const ammo = getAmmo(); // ✅ kommer nu korrekt med "Ammunition"-items

  return (
    <div style={{ backgroundColor: COLORS.dark, color: COLORS.textLight }}>
      {/* HERO */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://storage.googleapis.com/web-arc-raiders-cms-assets/temp/features/features-keyart.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />

        <div className="relative mx-auto max-w-6xl px-6 py-40 text-center">
          <Image
            src="/logo-white.png"
            alt="ARC RAIDERS"
            width={420}
            height={120}
            priority
            className="mx-auto w-[280px] sm:w-[560px]"
          />

          <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">
            LOADOUT{" "}
            <span
              className="rounded-md px-3 py-1"
              style={{
                backgroundColor: COLORS.accent,
                color: COLORS.dark,
              }}
            >
              CALC
            </span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: COLORS.mutedLight }}
          >
            Know exactly what to farm before every raid.
            <br />
            <span className="opacity-80">
              Instant material breakdowns for weapons, augments and consumables.
            </span>
          </p>

          <a
            href="#calculator"
            className="mt-10 inline-block rounded-lg px-8 py-3 font-semibold transition hover:opacity-90"
            style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
          >
            Go To Calculator
          </a>
        </div>
      </section>

      {/* WHAT IS LOADOUT CALCULATOR */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <p
          className="mb-3 text-xs uppercase tracking-widest"
          style={{ color: COLORS.accentDark }}
        >
          What is Loadout Calculator?
        </p>

        <h3 className="mb-12 text-3xl font-semibold">
          Plan smarter before every raid
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: COLORS.darkCard }}
          >
            <h4 className="mb-2 font-semibold">Instant calculations</h4>
            <p className="text-sm" style={{ color: COLORS.mutedLight }}>
              Get immediate material requirements as you build weapons and
              attachments.
            </p>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: COLORS.darkCard }}
          >
            <h4 className="mb-2 font-semibold">Combined totals</h4>
            <p className="text-sm" style={{ color: COLORS.mutedLight }}>
              See total materials across your entire loadout — no manual math.
            </p>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: COLORS.darkCard }}
          >
            <h4 className="mb-2 font-semibold">Community-driven data</h4>
            <p className="text-sm" style={{ color: COLORS.mutedLight }}>
              Built on community-maintained ARC Raiders data.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT TOOL — NEON BORDER */}
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

          <div
            className="max-w-3xl space-y-4 text-sm leading-relaxed"
            style={{ color: COLORS.mutedLight }}
          >
            <p>
              The ARC Raiders Loadout Calculator is a fan-made utility built to
              help players plan weapon loadouts and attachments before
              deploying. It instantly calculates total crafting materials —
              eliminating guesswork and manual calculations.
            </p>

            <p>
              All crafting data is sourced from community-driven projects and
              continuously refined by dedicated ARC Raiders fans.
            </p>

            <p className="text-xs" style={{ color: COLORS.mutedDark }}>
              Contributions from the community are welcome.
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR — PRIMARY NEON PANEL */}
      <section
        id="calculator"
        className="scroll-mt-24"
        style={{ backgroundColor: COLORS.darkSoft }}
      >
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
              <p
                className="mb-2 text-xs uppercase tracking-widest"
                style={{ color: COLORS.accentDark }}
              >
                Loadout Calculator
              </p>

              <h3 className="text-2xl font-semibold">
                Build your raid loadout
              </h3>

              <p className="mt-3 text-sm" style={{ color: COLORS.mutedLight }}>
                Ammo & shields coming later
              </p>
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
            {/* FOOTER */}
      <footer
        className="px-6 py-16 text-center text-xs"
        style={{ backgroundColor: COLORS.dark }}
      >
        <div
          className="mx-auto max-w-4xl space-y-4 leading-relaxed"
          style={{ color: COLORS.mutedDark }}
        >
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
            </a>
            .
          </p>

          <p>
            This project is licensed under the MIT License. ARC Raiders and all
            related assets are copyright © Embark Studios AB. This project is
            not affiliated with or endorsed by Embark Studios AB.
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
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
