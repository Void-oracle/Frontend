"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Market {
  id: number
  title: string
  marketProbability: number
  aiTruthScore: number
  volume: string
  endDate: string
  category?: string
}

export function MarketCard({ market, index }: { market: Market; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const divergence = Math.abs(market.aiTruthScore - market.marketProbability)
  const isHighDivergence = divergence > 20

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <Link href={`/main/market/${market.id}`}>
      <motion.div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "group relative overflow-hidden rounded-lg p-5 transition-all duration-200 cursor-pointer h-full",
          "backdrop-blur-xl bg-card/30 border",
          isHovering ? "border-white/40" : "border-white/10",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        initial={false}
        animate={{
          backdropFilter: isHovering ? "blur(0px)" : "blur(16px)",
          backgroundColor: isHovering ? "rgba(8,8,8,0.95)" : "rgba(8,8,8,0.2)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* High Divergence Indicator */}
        {isHighDivergence && (
          <div className="absolute right-3 top-3">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
              <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-2.5 w-2.5 text-primary" />
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <h3
          className={cn(
            "mb-4 pr-8 text-base font-medium leading-tight transition-opacity duration-150",
            isHovering ? "opacity-100" : "opacity-70",
          )}
        >
          {market.title}
        </h3>

        {/* Progress Bars */}
        <div className="mb-4 space-y-3">
          <ProgressBar label="Market" value={market.marketProbability} isHovering={isHovering} />
          <ProgressBar label="AI Truth" value={market.aiTruthScore} isHovering={isHovering} />
        </div>

        {/* Divergence Badge */}
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-all duration-150",
            isHighDivergence ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground",
          )}
        >
          <TrendingUp className="h-2.5 w-2.5" />
          {divergence}% Gap
        </div>

        {/* Footer */}
        <div
          className={cn(
            "flex items-center justify-between pt-3 text-xs transition-all duration-200 border-t",
            isHovering ? "opacity-100 border-white/20" : "opacity-50 border-white/5",
          )}
        >
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {market.endDate}
          </div>
          <div className="font-medium">{market.volume}</div>
        </div>
      </motion.div>
    </Link>
  )
}

function ProgressBar({
  label,
  value,
  isHovering,
}: {
  label: string
  value: number
  isHovering: boolean
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 200)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium tabular-nums transition-opacity duration-150",
            isHovering ? "opacity-100" : "opacity-60",
          )}
        >
          {value}%
        </span>
      </div>
      <div
        className={cn(
          "h-1 overflow-hidden rounded-full transition-all duration-150",
          isHovering ? "bg-muted/50" : "bg-muted/20",
        )}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
