import { changelog } from "@/app/data/changelog";
import { ArrowRight } from "lucide-react";


export default function Changelog() {
  return (
    <section
      className="mt-6 mx-auto max-w-5xl rounded-2xl px-6 py-5"
      style={{
        // backgroundColor: "rgba(28,31,38,0.6)", // mere diskret end About
      }}
    >
      {/* Section header */}
      <div className="mb-4 text-center">
        <h4 className="text-base font-semibold text-white">
          Latest updates
        </h4>
        <p className="mt-1 text-xs text-white/50">
          Ongoing improvements & changes
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl">
        <div className="max-h-30 space-y-4 overflow-y-auto pr-2 text-sm text-[#A0A4AA] scrollbar-subtle">
          {changelog.map((entry) => (
            <div key={entry.date}>
              <div className="mb-1 flex items-center gap-2 text-white">
                <span className="text-xs opacity-50">{entry.date}</span>
                <span className="font-medium">{entry.title}</span>
              </div>

              <ul className="ml-2 space-y-1 list-none">
                {entry.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#C9B400] opacity-70">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
  <a
  href="https://docs.google.com/forms/d/e/1FAIpQLSf1PgLtEkk91pI--JvRLkGhKM_KPgtK8O1LdN_zT9ez8g66GQ/viewform"
  target="_blank"
  rel="noopener noreferrer"
  className="
    inline-flex items-center gap-2
    rounded-md border border-white/10
    px-3 py-1.5 text-xs
    text-[#A0A4AA]
    transition
    hover:text-white
    hover:border-[#C9B400]/40
    group
  "
>
  <span>Missing something or have suggestions?</span>

  <span className="inline-flex items-center gap-1 text-[#C9B400]">
    Let me know
    <ArrowRight
      size={12}
      className="transition-transform group-hover:translate-x-0.5"
    />
  </span>
</a>

</div>

    </section>
  );
}
