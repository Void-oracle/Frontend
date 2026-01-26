"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type Timeframe = "1h" | "1d" | "30d"

interface TimeframeSelectorProps {
  selected: Timeframe
  onChange: (timeframe: Timeframe) => void
}

const timeframes: Array<{ value: Timeframe; label: string; hours: number }> = [
  { value: "1h", label: "1 Hour", hours: 1 },
  { value: "1d", label: "1 Day", hours: 24 },
  { value: "30d", label: "30 Days", hours: 720 },
]

export function TimeframeSelector({ selected, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Timeframe:</span>
      </div>
      
      <div className="relative flex items-center gap-1 rounded-lg bg-background/50 p-1 backdrop-blur-xl border border-white/10">
        {timeframes.map((timeframe) => {
          const isSelected = selected === timeframe.value
          
          return (
            <button
              key={timeframe.value}
              onClick={() => onChange(timeframe.value)}
              className={cn(
                "relative z-10 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                isSelected
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="timeframe-indicator"
                  className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{timeframe.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function getTimeframeHours(timeframe: Timeframe): number {
  const found = timeframes.find((t) => t.value === timeframe)
  return found?.hours || 24
}
