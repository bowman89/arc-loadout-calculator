import { ArrowRight } from "lucide-react";

const COLORS = {
  dark: "#0E0F12",
  mutedDark: "#6B7077",
};

export default function Footer() {
  return (
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
          ARC Raiders and all related assets are copyright © Embark Studios AB.
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

        <p className="text-xs text-[#A0A4AA] mt-2">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf1PgLtEkk91pI--JvRLkGhKM_KPgtK8O1LdN_zT9ez8g66GQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              rounded-md border border-white/10
              px-3 py-1.5 text-xs
              transition
              hover:text-white
              hover:border-[#C9B400]/40
              group
            "
          >
            <span>Missing something or have suggestions?</span>
            <span className="inline-flex items-center gap-1 text-[#C9B400]">
              Let me know
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </p>
      </div>
    </footer>
  );
}
