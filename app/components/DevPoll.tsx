"use client"

import { useEffect, useState } from "react"

const OPTIONS = [
  { key: "yes_active", label: "Yes, I use it actively and regularly" },
  { key: "yes_sometimes", label: "Yes, but only every now and then" },
  { key: "not_currently", label: "Not right now, but I'd miss it if it was gone" },
  { key: "no", label: "No, I don't use it anymore" },
] as const

type OptionKey = (typeof OPTIONS)[number]["key"]

const STORAGE_KEY = "bovle_poll_voted"
const API_BASE = "/api/poll"

type Counts = Record<OptionKey, number>

export default function DevPoll() {
  const [counts, setCounts] = useState<Counts>({
    yes_active: 0,
    yes_sometimes: 0,
    not_currently: 0,
    no: 0,
  })
  const [selected, setSelected] = useState<OptionKey | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const pct = (key: OptionKey) => (total === 0 ? 0 : Math.round((counts[key] / total) * 100))

  useEffect(() => {
    const voted = localStorage.getItem(STORAGE_KEY)
    if (voted) setHasVoted(true)

    fetch(API_BASE)
      .then((r) => r.json())
      .then((data) => {
        setCounts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function submitVote() {
    if (!selected) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: selected }),
      })
      if (!res.ok) throw new Error("Server error")
      const data = await res.json()
      setCounts(data)
      setHasVoted(true)
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      setError("Something went wrong — please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-20 max-w-3xl mx-auto border border-[#C9B400] rounded p-6 bg-[#C9B400]/30">
      <h2 className="text-2xl font-semibold text-center mb-2">
        [2026-05-11] Are you still using the Loadout Calculator?
      </h2>
      <p className="text-white/80 text-center text-sm mb-6">
        Between work and dad life, keeping this free app running takes real time and effort. Help me understand if
        it&apos;s still worth it — your vote genuinely matters.
      </p>

      {loading ? (
        <p className="text-center text-white/60 text-sm">Loading votes…</p>
      ) : hasVoted ? (
        <div className="space-y-3">
          {OPTIONS.map((opt) => (
            <div key={opt.key}>
              <div className="flex justify-between text-sm mb-1">
                <span>{opt.label}</span>
                <span className="text-white/60">
                  {pct(opt.key)}% ({counts[opt.key]})
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C9B400] transition-all duration-500"
                  style={{ width: `${pct(opt.key)}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-center text-white/60 text-xs mt-4">
            {total} vote{total === 1 ? "" : "s"} total
          </p>
          <p className="text-center text-white/80 text-sm font-semibold">Thanks for voting! ❤️ — BovleDK</p>
        </div>
      ) : (
        <div className="space-y-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`w-full text-left px-4 py-3 rounded border transition-colors text-sm ${
                selected === opt.key
                  ? "border-[#C9B400] bg-[#C9B400]/40 font-medium"
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <button
            onClick={submitVote}
            disabled={!selected || submitting}
            className="w-full mt-4 py-2.5 rounded border border-white/30 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {submitting ? "Submitting…" : "Submit vote"}
          </button>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        </div>
      )}
    </div>
  )
}
