export type ChangelogEntry = {
  date: string;
  title: string;
  items: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-01-08",
    title: "Recycle insights – integrated calculator feature & UX improvements",
    items: [
      "Introduced recycle insights directly inside the Loadout Calculator, allowing players to see which items recycle into required materials without leaving the calculator",
      "Added an interactive recycle lookup modal accessible via the material list for fast, contextual exploration",
      "Integrated a shared data model for items and materials to ensure consistent names, icons, and metadata across the calculator",
      "Added item icons to recycle source lists to improve visual scanning and faster decision-making",
      "Improved discoverability with subtle visual cues and helper text guiding users toward the recycle lookup feature",
      "Refined UX and layout to keep recycle information secondary and non-intrusive during loadout building",
      "Stabilized client-side data flow to prevent undefined recycle mappings and lookup errors",
    ],
  },
  {
    date: "2026-01-06",
    title: "Materials needed – usability improvements",
    items: [
      "Added material tracking so players can mark how many materials they already have",
      "Materials are now sorted from highest to lowest required amount for better farming prioritization",
      'Introduced an "Extra materials (optional)" section to manually account for additional materials',
      "Improved the Materials Needed layout with clearer structure and visual hierarchy",
      "Added a lightweight in-app feedback poll to let users vote on which features should be prioritized next",
    ],
  },
  {
    date: "2026-01-03",
    title: "Improvements & fixes",
    items: [
      "Separated shields into their own dedicated card",
      "Reworked input layout to a consistent 2×3 card grid",
      "Added ordering system for input cards to easily control layout",
      "Improved ammo handling to reflect bundle crafting quantities (e.g. x25)",
      "Updated loadout quantity display to show actual received ammo amount",
      "Added clearer empty-state messaging for Tier I weapons",
      "Improved materials section UX to reduce confusion for new users",
      "Refined CTA styling and feedback link interaction",
      "Minor UI alignment and spacing improvements across input cards",
    ],
  },
  {
    date: "2026-01-02",
    title: "New features",
    items: [
      "Added toggle for total vs upgrade weapon cost",
      "Added support for craftable weapon modifications",
    ],
  },
  {
    date: "2026-01-01",
    title: "Initial release",
    items: ["Public launch of Loadout Calculator"],
  },
];
