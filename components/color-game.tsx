"use client"

import { useCallback, useEffect, useState } from "react"
import { Keyboard, RotateCcw } from "lucide-react"

function generateRandomHex(): string {
  return (
    "#" +
    ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6)
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type FeedbackState = "correct" | "wrong" | null

export default function ColorGame() {
  const [correctColor, setCorrectColor] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const nextRound = useCallback(() => {
    const correct = generateRandomHex()
    const others = [generateRandomHex(), generateRandomHex()]
    setCorrectColor(correct)
    setOptions(shuffle([correct, ...others]))
    setFeedback(null)
    setSelectedIndex(null)
    setIsTransitioning(false)
  }, [])

  useEffect(() => {
    nextRound()
  }, [nextRound])

  const handlePick = useCallback(
    (color: string, index: number) => {
      if (isTransitioning) return

      setSelectedIndex(index)
      setIsTransitioning(true)

      if (color === correctColor) {
        setFeedback("correct")
        setRight((r) => r + 1)
        setStreak((s) => {
          const next = s + 1
          setBestStreak((b) => Math.max(b, next))
          return next
        })
      } else {
        setFeedback("wrong")
        setWrong((w) => w + 1)
        setStreak(0)
      }

      setTimeout(nextRound, 700)
    },
    [correctColor, isTransitioning, nextRound]
  )

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "1" || e.key === "2" || e.key === "3") {
        const idx = parseInt(e.key) - 1
        if (options[idx]) {
          handlePick(options[idx], idx)
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [options, handlePick])

  const total = right + wrong
  const percentage = total > 0 ? Math.round((right / total) * 100) : 0

  const handleReset = () => {
    setRight(0)
    setWrong(0)
    setStreak(0)
    setBestStreak(0)
    nextRound()
  }

  const hexParts = correctColor.toUpperCase()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12 selection:bg-foreground/10">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          Hex Color Game
        </h1>
        <p className="text-xs text-muted-foreground/60">
          Pick the swatch that matches the code
        </p>
      </div>

      {/* Hex Code Display */}
      <div className="rounded-2xl border border-border bg-card px-8 py-6 shadow-lg shadow-black/20">
        <p className="font-mono text-4xl font-bold tracking-wider sm:text-5xl">
          <span className="text-muted-foreground">{hexParts.slice(0, 1)}</span>
          <span className="text-red-400">{hexParts.slice(1, 3)}</span>
          <span className="text-green-400">{hexParts.slice(3, 5)}</span>
          <span className="text-blue-400">{hexParts.slice(5, 7)}</span>
        </p>
      </div>

      {/* Feedback */}
      <div className="h-6">
        {feedback === "correct" && (
          <p className="animate-in fade-in text-sm font-medium text-success">
            Correct!
          </p>
        )}
        {feedback === "wrong" && (
          <p className="animate-in fade-in text-sm font-medium text-destructive">
            Wrong!
          </p>
        )}
      </div>

      {/* Color Swatches */}
      <div className="flex gap-4 sm:gap-6">
        {options.map((color, i) => (
          <button
            key={`${color}-${i}`}
            onClick={() => handlePick(color, i)}
            disabled={isTransitioning}
            aria-label={`Color option ${i + 1}`}
            className="group relative"
          >
            <div
              className={`
                h-24 w-24 rounded-2xl transition-all duration-150 sm:h-28 sm:w-28
                ${
                  isTransitioning && selectedIndex === i
                    ? feedback === "correct"
                      ? "ring-4 ring-success ring-offset-2 ring-offset-background scale-105"
                      : "ring-4 ring-destructive ring-offset-2 ring-offset-background scale-95 opacity-60"
                    : "hover:scale-110 hover:shadow-xl hover:shadow-black/30 active:scale-105"
                }
                ${
                  isTransitioning && selectedIndex !== i && feedback === "wrong" && color === correctColor
                    ? "ring-4 ring-success/50 ring-offset-2 ring-offset-background"
                    : ""
                }
              `}
              style={{ backgroundColor: color }}
            />
            {/* Key hint */}
            <span className="mt-2 block text-center font-mono text-xs text-muted-foreground/40 transition-colors group-hover:text-muted-foreground">
              {i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Score Panel */}
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <ScoreStat label="Right" value={right} color="text-success" />
          <ScoreStat label="Wrong" value={wrong} color="text-destructive" />
          <ScoreStat
            label="Score"
            value={`${percentage}%`}
            color={
              right > wrong
                ? "text-success"
                : wrong > right
                  ? "text-destructive"
                  : "text-info"
            }
          />
          <ScoreStat label="Streak" value={streak} color="text-foreground" />
        </div>

        {total > 0 && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
            <span>
              Best streak: {bestStreak}
            </span>
            <span>|</span>
            <span>Total: {total}</span>
            <button
              onClick={handleReset}
              className="ml-1 inline-flex items-center gap-1 text-muted-foreground/50 transition-colors hover:text-foreground"
              aria-label="Reset score"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      <div className="mt-auto flex items-center gap-1.5 pt-8 text-muted-foreground/30">
        <Keyboard className="h-3.5 w-3.5" />
        <span className="text-xs">
          Press 1, 2, or 3 to pick
        </span>
      </div>
    </div>
  )
}

function ScoreStat({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-mono text-xl font-bold ${color}`}>{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
        {label}
      </span>
    </div>
  )
}
