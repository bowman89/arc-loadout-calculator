import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

const VALID_OPTIONS = ["yes_active", "yes_sometimes", "not_currently", "no"] as const
type Option = (typeof VALID_OPTIONS)[number]

async function getCounts() {
  const results = await Promise.all(VALID_OPTIONS.map((o) => kv.get<number>(`poll:${o}`)))
  return Object.fromEntries(VALID_OPTIONS.map((o, i) => [o, results[i] ?? 0]))
}

export async function GET() {
  const counts = await getCounts()
  return NextResponse.json(counts)
}

export async function POST(req: Request) {
  const { option } = await req.json()
  if (!VALID_OPTIONS.includes(option as Option)) {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 })
  }
  await kv.incr(`poll:${option}`)
  const counts = await getCounts()
  return NextResponse.json(counts)
}
