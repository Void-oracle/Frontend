"use client"

import { RefreshCw, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function AutoUpdateIndicator() {
  const [nextUpdate, setNextUpdate] = useState(10 * 60) // 10 minutes in seconds
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setNextUpdate((prev) => {
        if (prev <= 1) {
          return 10 * 60 // Reset to 10 minutes
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const minutes = Math.floor(nextUpdate / 60)
  const seconds = nextUpdate % 60

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-xl">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/30 opacity-50" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <RefreshCw className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-foreground">
              Auto-updating markets
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            Next refresh: {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
