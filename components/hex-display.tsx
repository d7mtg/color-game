"use client"

import { splitHex } from "@/lib/color"

interface HexDisplayProps {
  hex: string
  colorized: boolean
}

export function HexDisplay({ hex, colorized }: HexDisplayProps) {
  const parts = splitHex(hex)

  if (!colorized) {
    return (
      <span className="font-mono text-3xl font-bold tracking-widest text-foreground uppercase md:text-4xl">
        {hex}
      </span>
    )
  }

  return (
    <span className="font-mono text-3xl font-bold tracking-widest uppercase md:text-4xl">
      <span className="text-foreground">{"#"}</span>
      <span style={{ color: "#e53e3e" }}>{parts.r}</span>
      <span style={{ color: "#38a169" }}>{parts.g}</span>
      <span style={{ color: "#3182ce" }}>{parts.b}</span>
    </span>
  )
}
