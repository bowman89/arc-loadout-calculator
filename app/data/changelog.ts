export type ChangelogEntry = {
  date: string;
  title: string;
  items: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-01-03",
    title: "Improvements & fixes",
    items: [
      "Modifications now stack instead of creating duplicate rows",
      "Added modifications to the tool",
      "Clear all now correctly resets modification materials",
      "Improved loadout removal logic",
      "Added changelog",
      "Improved feedback link UX"
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
