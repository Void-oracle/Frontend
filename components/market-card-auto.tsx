"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAutoOracle } from "@/hooks/use-auto-oracle"

interface Market {
  id: number
  market_id?: string
  title: string
  description?: string
  ticker?: string
  marketProbability: number
  aiTruthScore: number
  volume: string
  endDate: string
  category?: string
  lastUpdate?: string
}

export function MarketCardAuto({ 
  market, 
  index,
}: { 
  market: Market; 
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const { result } = useAutoOracle({
    ticker: market.ticker || 'SOL',
    query: market.description || market.title,
    timeRangeHours: 24,
    enabled: true,
    updateInterval: 10 * 60 * 1000,
    initialDelay: index * 5000,
  })
  
  const aiScore = result?.aiScore ?? market.aiTruthScore
  const marketScore = result?.marketScore ?? market.marketProbability
  const divergence = Math.abs(aiScore - marketScore)
  const isHighDivergence = divergence > 20

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80)
    return () => clearTimeout(timer)
  }, [index])

  const lastUpdated = result?.lastUpdated 
    ? new Date(result.lastUpdated).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : null

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "group relative overflow-hidden rounded-lg p-5 transition-all duration-300 h-full",
          // Floating Glass effect - very subtle white tint
          "bg-white/[0.03] backdrop-blur-xl",
          // Ultra-thin border
          "border border-white/[0.08]",
          isHighDivergence && "border-cyan-500/20",
          isHovering && "bg-white/[0.05] border-white/[0.15]",
          isHighDivergence && isHovering && "border-cyan-500/40",
        )}
        animate={{
          y: isHovering ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          boxShadow: isHighDivergence 
            ? isHovering 
              ? "0 8px 40px rgba(6, 182, 212, 0.25), 0 0 60px rgba(6, 182, 212, 0.1)" 
              : "0 4px 20px rgba(6, 182, 212, 0.15)"
            : isHovering
              ? "0 8px 30px rgba(0, 0, 0, 0.3)"
              : "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* High Divergence Ping Indicator */}
        {isHighDivergence && (
          <div className="absolute right-3 top-3 z-10">
            <div className="relative">
              {/* Ping animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.3,
                }}
              />
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/50">
                <Zap className="h-3 w-3 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,1)]" />
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className={cn(
          "mb-4 pr-8 text-sm font-medium leading-snug transition-colors duration-200",
          isHovering ? "text-white" : "text-white/70",
        )}>
          {market.title}
        </h3>

        {/* Progress Bars - Glowing */}
        <div className="mb-4 space-y-3">
          <GlowingProgressBar 
            label="Market" 
            value={marketScore} 
            isHovering={isHovering}
            isLive={!!result}
            color="cyan"
          />
          <GlowingProgressBar 
            label="AI Truth" 
            value={aiScore} 
            isHovering={isHovering}
            isLive={!!result}
            color="violet"
          />
        </div>

        {/* Divergence Badge */}
        <div className={cn(
          "mb-4 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-all duration-200",
          isHighDivergence
            ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
            : "bg-white/5 text-white/50 border border-white/10",
        )}>
          <TrendingUp className="h-3 w-3" />
          <span className="tabular-nums">{divergence.toFixed(1)}%</span>
          <span className="text-white/30">divergence</span>
        </div>

        {/* Footer */}
        <div className={cn(
          "flex items-center justify-between pt-3 text-[11px] font-mono transition-all duration-200 border-t border-white/[0.05]",
          isHovering ? "text-white/60" : "text-white/30",
        )}>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{market.endDate}</span>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-cyan-400/60">{lastUpdated}</span>
            )}
            <span className="text-white/50">{market.volume}</span>
          </div>
        </div>

        {/* Click overlay */}
        <Link 
          href={`/main/market/${market.market_id || market.id}`}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${market.title}`}
        />
      </motion.div>
    </motion.div>
  )
}

function GlowingProgressBar({
  label,
  value,
  isHovering,
  isLive = false,
  color = "cyan",
}: {
  label: string
  value: number
  isHovering: boolean
  isLive?: boolean
  color?: "cyan" | "violet"
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 200)
    return () => clearTimeout(timer)
  }, [value])

  const gradients = {
    cyan: "from-cyan-500 via-blue-500 to-cyan-400",
    violet: "from-violet-500 via-purple-500 to-indigo-500",
  }

  const glowColors = {
    cyan: "rgba(6, 182, 212, 0.8)",
    violet: "rgba(139, 92, 246, 0.8)",
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
        <span className="text-white/40 flex items-center gap-1.5">
          {label}
          {isLive && (
            <motion.span 
              className="text-green-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ●
            </motion.span>
          )}
        </span>
        <span className={cn(
          "tabular-nums transition-colors duration-200",
          isHovering ? "text-white/80" : "text-white/50",
        )}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08] relative">
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r relative",
            gradients[color],
          )}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            boxShadow: `0 0 20px ${glowColors[color]}, 0 0 40px ${glowColors[color]}`,
          }}
        >
          {/* Intense glow effect */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${glowColors[color]}, transparent)`,
              filter: "blur(4px)",
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
