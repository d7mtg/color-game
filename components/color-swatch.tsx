"use client"

import { cn } from "@/lib/utils"
import { isLightColor } from "@/lib/color"

interface ColorSwatchProps {
  color: string
  index: number
  onClick: () => void
  state: "idle" | "correct" | "wrong" | "reveal"
  disabled: boolean
}

export function ColorSwatch({
  color,
  index,
  onClick,
  state,
  disabled,
}: ColorSwatchProps) {
  const light = isLightColor(color)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Color option ${index + 1}`}
      className={cn(
        "relative flex h-28 w-full items-center justify-center rounded-2xl transition-all duration-150 md:h-36",
        "active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        state === "idle" && "hover:scale-[1.03] hover:shadow-lg",
        state === "correct" &&
          "ring-4 ring-emerald-500 ring-offset-2 ring-offset-background scale-[1.03]",
        state === "wrong" &&
          "opacity-50 scale-95",
        state === "reveal" &&
          "ring-4 ring-emerald-500/50 ring-offset-2 ring-offset-background",
        disabled && state === "idle" && "cursor-default"
      )}
      style={{ backgroundColor: color }}
    >
      <span
        className={cn(
          "font-mono text-sm font-semibold tracking-wide uppercase opacity-0 transition-opacity duration-200",
          light ? "text-foreground/70" : "text-background/70",
          (state === "correct" || state === "wrong" || state === "reveal") &&
            "opacity-100"
        )}
      >
        {state === "correct"
          ? "Correct!"
          : state === "wrong"
            ? "Nope"
            : state === "reveal"
              ? "Answer"
              : ""}
      </span>

      {/* Keyboard hint */}
      <span
        className={cn(
          "absolute bottom-2 right-3 font-mono text-xs font-medium",
          light ? "text-foreground/30" : "text-background/30",
          "hidden md:block"
        )}
      >
        {index + 1}
      </span>
    </button>
  )
}
