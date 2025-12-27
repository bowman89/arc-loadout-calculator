import Link from "next/link";
import Image from "next/image";

const COLORS = {
  sand: "#ECE8D5",
  sandDark: "#E3DFC8",
  dark: "#0E0F12",
  darkSoft: "#16181D",
  accent: "#C9B400",
  accentDark: "#B3A200",
  textDark: "#0E0F12",
  textLight: "#FFFFFF",
  mutedDark: "#5A5F66",
  mutedLight: "#A0A4AA",
};

export default function Home() {
  return (
    <div style={{ backgroundColor: COLORS.sand, color: COLORS.textDark }}>
      {/* HERO */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://storage.googleapis.com/web-arc-raiders-cms-assets/temp/features/features-keyart.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

        <div className="relative mx-auto max-w-6xl px-6 py-40 text-center">
          <h1 className="flex justify-center">
            <span className="sr-only">ARC RAIDERS</span>
            <Image
              src="/logo-white.png"
              alt="ARC RAIDERS"
              width={420}
              height={120}
              priority
              className="w-[280px] sm:w-[560px] h-auto"
            />
          </h1>

          <h2 className="mt-4 flex items-center justify-center gap-2 text-3xl font-semibold sm:text-4xl">
            <span style={{ color: COLORS.textLight }}>LOADOUT</span>
            <span
              className="rounded-lg px-3 py-1"
              style={{
                backgroundColor: COLORS.accent,
                color: COLORS.textDark,
              }}
            >
              CALCULATOR
            </span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: COLORS.mutedLight }}
          >
            Plan your stash for building weapons and attachments.
            <br />
            Calculate exact crafting materials before you deploy.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/builder"
              className="inline-block rounded-lg px-8 py-3 text-lg font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: COLORS.accent,
                color: COLORS.textDark,
              }}
            >
              Open Build Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT YOU’LL GET */}
      <section
        className="mx-auto max-w-6xl px-6 py-24"
        style={{ backgroundColor: COLORS.sand }}
      >
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: COLORS.accentDark }}
        >
          What is Loadout Calculator?
        </p>

        <h3 className="text-2xl font-semibold mb-8">
          Plan smarter before every raid
        </h3>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Instant calculations",
              text: "Get immediate material requirements as you build weapons and attachments.",
            },
            {
              title: "Combined totals",
              text: "See total materials across your entire loadout — no manual math.",
            },
            {
              title: "Community-driven data",
              text: "Based on up-to-date community-maintained ARC Raiders data.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg p-6"
              style={{ backgroundColor: COLORS.darkSoft, color: COLORS.textLight }}
            >
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm" style={{ color: COLORS.mutedLight }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/builder"
            className="inline-block rounded-md px-6 py-3 text-2xl font-bold transition hover:opacity-90 w-full text-center"
            style={{
              backgroundColor: COLORS.accent,
              color: COLORS.textDark,
            }}
          >
            Launch Calculator
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-6 py-12 text-center text-xs"
        style={{ backgroundColor: COLORS.sandDark, color: COLORS.mutedDark }}
      >
        <p className="mx-auto max-w-3xl leading-relaxed">
          This is an unofficial fan-made tool for ARC RAIDERS.
          Crafting and item data is provided by the community and sourced from
          RaidTheory – arcraiders-data.
          ARC RAIDERS and all related assets are property of their respective
          owners.
        </p>
      </footer>
    </div>
  );
}
