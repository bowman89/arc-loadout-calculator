"use client";

import { useState } from "react";

export default function Poll() {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function sendVote(option: string, text?: string) {
    window.dataLayer?.push({
      event: "poll_vote",
      poll_id: "1.0", // Change id on new poll
      poll_option: option,
      poll_text: text || undefined,
    });

    setSubmitted(true);
    setShowOtherInput(false);
    setOtherText("");
  }

  return (
    <div className="mx-auto flex max-w-fit flex-wrap items-center justify-center gap-3 rounded-lg bg-black/30 px-4 py-3 text-xs">
      {!submitted && (
        <>
          {["Ready-to-use loadouts (e.g. Looter / PvP / Glass cannon)", "Save & reuse loadouts", "Make the calculator easier to use on mobile"].map((option) => (
            <button
              key={option}
              onClick={() => sendVote(option)}
              className="
                rounded-full
                border border-white/10
                px-3 py-1
                transition
                hover:border-[#C9B400]/60
                hover:text-[#C9B400]
              "
            >
              {option}
            </button>
          ))}

          <button
            onClick={() => setShowOtherInput((v) => !v)}
            className="
              rounded-full
              border border-[#C9B400]/40
              px-3 py-1
              text-[#C9B400]
              hover:border-[#C9B400]
            "
          >
            Other
          </button>

          {showOtherInput && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Your idea…"
                className="w-40 rounded-md bg-white px-2 py-1 text-xs text-black"
              />
              <button
                onClick={() => sendVote("Other", otherText)}
                disabled={!otherText.trim()}
                className="rounded-md bg-[#C9B400] px-2 py-1 text-xs font-medium text-black disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}
        </>
      )}

      {submitted && (
        <span className="text-[#C9B400] flex items-center gap-1">
          Thanks for the input 🙌
        </span>
      )}
    </div>
  );
}
