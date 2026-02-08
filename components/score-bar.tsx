"use client"

import { cn } from "@/lib/utils"

interface ScoreBarProps {
  right: number
  wrong: number
  streak: number
}

export function ScoreBar({ right, wrong, streak }: ScoreBarProps) {
  const total = right + wrong
  const pct = total > 0 ? Math.round((right / total) * 100) : 0

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3 text-card-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-muted-foreground">
            Score
          </span>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              pct >= 60
                ? "text-emerald-600"
                : pct >= 40
                  ? "text-amber-600"
                  : total === 0
                    ? "text-foreground"
                    : "text-destructive"
            )}
          >
            {pct}%
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-muted-foreground">
              Right
            </span>
            <span className="text-base font-semibold tabular-nums text-emerald-600">
              {right}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-muted-foreground">
              Wrong
            </span>
            <span className="text-base font-semibold tabular-nums text-destructive">
              {wrong}
            </span>
          </div>
        </div>
      </div>

      {streak > 1 && (
        <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1">
          <span className="text-xs font-semibold text-amber-700">
            {streak}x streak
          </span>
        </div>
      )}
    </div>
  )
}
