"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { randomHexColor } from "@/lib/color"
import { HexDisplay } from "@/components/hex-display"
import { ColorSwatch } from "@/components/color-swatch"
import { ScoreBar } from "@/components/score-bar"
import { cn } from "@/lib/utils"

interface Round {
  correctColor: string
  options: string[]
  correctIndex: number
}

function generateRound(): Round {
  const correctColor = randomHexColor()
  const correctIndex = Math.floor(Math.random() * 3)
  const options = Array.from({ length: 3 }, (_, i) =>
    i === correctIndex ? correctColor : randomHexColor()
  )
  return { correctColor, options, correctIndex }
}

type SwatchState = "idle" | "correct" | "wrong" | "reveal"

export function ColorGame() {
  const [round, setRound] = useState<Round>(generateRound)
  const [swatchStates, setSwatchStates] = useState<SwatchState[]>([
    "idle",
    "idle",
    "idle",
  ])
  const [answered, setAnswered] = useState(false)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [streak, setStreak] = useState(0)
  const [colorized, setColorized] = useState(true)
  const [roundKey, setRoundKey] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const nextRound = useCallback(() => {
    setRound(generateRound())
    setSwatchStates(["idle", "idle", "idle"])
    setAnswered(false)
    setRoundKey((k) => k + 1)
  }, [])

  const handleChoice = useCallback(
    (index: number) => {
      if (answered) return

      setAnswered(true)
      const isCorrect = index === round.correctIndex

      if (isCorrect) {
        setRight((r) => r + 1)
        setStreak((s) => s + 1)
        setSwatchStates((prev) =>
          prev.map((_, i) => (i === index ? "correct" : "idle"))
        )
      } else {
        setWrong((w) => w + 1)
        setStreak(0)
        setSwatchStates((prev) =>
          prev.map((_, i) =>
            i === index ? "wrong" : i === round.correctIndex ? "reveal" : "idle"
          )
        )
      }

      timeoutRef.current = setTimeout(nextRound, 1000)
    },
    [answered, round.correctIndex, nextRound]
  )

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "1") handleChoice(0)
      else if (e.key === "2") handleChoice(1)
      else if (e.key === "3") handleChoice(2)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleChoice])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleReset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setRight(0)
    setWrong(0)
    setStreak(0)
    nextRound()
  }, [nextRound])

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 py-6 md:py-10">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Color Game
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setColorized((c) => !c)}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              "border border-border",
              colorized
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground hover:bg-secondary"
            )}
            aria-label="Toggle RGB color mode"
          >
            RGB
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-card-foreground transition-colors hover:bg-secondary"
            aria-label="Reset score"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Score */}
      <div className="mb-6">
        <ScoreBar right={right} wrong={wrong} streak={streak} />
      </div>

      {/* Hex Code Display */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          Which color is this?
        </p>
        <div
          key={roundKey}
          className="rounded-xl border border-border bg-card px-6 py-5 shadow-sm"
        >
          <HexDisplay hex={round.correctColor} colorized={colorized} />
        </div>
      </div>

      {/* Color Swatches */}
      <div className="flex flex-1 flex-col gap-4">
        {round.options.map((color, i) => (
          <ColorSwatch
            key={`${roundKey}-${i}`}
            color={color}
            index={i}
            onClick={() => handleChoice(i)}
            state={swatchStates[i]}
            disabled={answered}
          />
        ))}
      </div>

      {/* Footer hint */}
      <footer className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="hidden md:inline">
            {"Press 1, 2, or 3 to choose"}
          </span>
          <span className="md:hidden">Tap the matching color</span>
        </p>
      </footer>
    </div>
  )
}
