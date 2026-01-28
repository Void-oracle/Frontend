"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Activity, Brain, TrendingUp, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketStats {
  avgAiScore: number
  avgMarketScore: number | null  // null if no markets have external links
  avgDivergence: number | null
  activeMarkets: number
  linkedMarkets: number  // markets with external_market_url
}

function ShuffleNumber({
  value,
  isShuffling,
}: {
  value: number
  isShuffling: boolean
}) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (!isShuffling) {
      setDisplayValue(value)
      return
    }

    const shuffleInterval = setInterval(() => {
      setDisplayValue(Math.random() * 100)
    }, 50)

    const settleTimeout = setTimeout(() => {
      clearInterval(shuffleInterval)
      setDisplayValue(value)
    }, 800)

    return () => {
      clearInterval(shuffleInterval)
      clearTimeout(settleTimeout)
    }
  }, [isShuffling, value])

  return <span className="tabular-nums font-mono">{displayValue.toFixed(1)}%</span>
}

export function DivergenceHero() {
  const [stats, setStats] = useState<MarketStats>({
    avgAiScore: 0,
    avgMarketScore: null,
    avgDivergence: null,
    activeMarkets: 0,
    linkedMarkets: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [divergenceValue, setDivergenceValue] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  // Fetch real data from API
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/markets/list')
      if (!response.ok) return
      
      const data = await response.json()
      const markets = data.markets || []
      
      if (markets.length === 0) {
        setStats({
          avgAiScore: 0,
          avgMarketScore: null,
          avgDivergence: null,
          activeMarkets: 0,
          linkedMarkets: 0,
        })
        setIsLoading(false)
        return
      }

      // Calculate AI score average from all markets
      const marketsWithAiScore = markets.filter((m: any) => m.ai_score !== undefined)
      const avgAiScore = marketsWithAiScore.length > 0
        ? marketsWithAiScore.reduce((sum: number, m: any) => sum + (m.ai_score ?? 50), 0) / marketsWithAiScore.length
        : 50

      // Calculate market score only from markets with external links
      const linkedMarkets = markets.filter((m: any) => m.external_market_url)
      const avgMarketScore = linkedMarkets.length > 0
        ? linkedMarkets.reduce((sum: number, m: any) => sum + (m.market_score ?? 50), 0) / linkedMarkets.length
        : null

      // Calculate divergence only if we have linked markets
      const avgDivergence = avgMarketScore !== null 
        ? Math.abs(avgAiScore - avgMarketScore) 
        : null

      setStats({
        avgAiScore,
        avgMarketScore,
        avgDivergence,
        activeMarkets: markets.length,
        linkedMarkets: linkedMarkets.length,
      })
      
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchStats])

  // Animate divergence value
  useEffect(() => {
    const targetValue = stats.avgDivergence ?? 0
    const duration = 1500
    const steps = 60
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setDivergenceValue(targetValue)
        clearInterval(timer)
      } else {
        setDivergenceValue(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [stats.avgDivergence])

  const handleHover = useCallback(() => {
    setIsHovering(true)
    setIsShuffling(true)
  }, [])

  const handleHoverEnd = useCallback(() => {
    setIsHovering(false)
    setTimeout(() => setIsShuffling(false), 200)
  }, [])

  return (
    <div className="mb-6">
      <motion.div
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverEnd}
        className={cn(
          "relative overflow-hidden rounded-lg p-5 lg:p-6 transition-all duration-300",
          // Floating Glass style
          "bg-white/[0.02] backdrop-blur-xl",
          "border border-white/[0.06]",
          isHovering && "bg-white/[0.04] border-cyan-500/20",
        )}
        style={{
          boxShadow: isHovering 
            ? "0 8px 40px rgba(6, 182, 212, 0.15), inset 0 0 40px rgba(6, 182, 212, 0.02)" 
            : "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <h1 className={cn(
                "text-lg lg:text-xl font-mono uppercase tracking-[0.3em] transition-colors duration-200",
                isHovering ? "text-cyan-400" : "text-white/60",
              )}>
                Divergence Index
              </h1>
              <button
                onClick={fetchStats}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                title="Refresh stats"
              >
                <RefreshCw className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isLoading ? "animate-spin text-cyan-400" : "text-white/30 hover:text-white/60"
                )} />
              </button>
            </div>
            <p className={cn(
              "mb-5 max-w-md text-[13px] font-mono transition-colors duration-200",
              isHovering ? "text-white/60" : "text-white/30",
            )}>
              {stats.activeMarkets > 0 
                ? "Real-time gap between AI sentiment and market probabilities"
                : "Create a market to start tracking divergence"
              }
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <StatCard 
                icon={Brain} 
                label="AI Oracle" 
                value={stats.activeMarkets > 0 ? `${stats.avgAiScore.toFixed(1)}%` : "—"} 
                isHovering={isHovering} 
                color="violet" 
              />
              <StatCard 
                icon={TrendingUp} 
                label="Market" 
                value={stats.avgMarketScore !== null ? `${stats.avgMarketScore.toFixed(1)}%` : "N/A"} 
                isHovering={isHovering} 
                color="cyan" 
                subtitle={stats.linkedMarkets > 0 ? `${stats.linkedMarkets} linked` : "no links"}
              />
              <StatCard 
                icon={Activity} 
                label="Active" 
                value={stats.activeMarkets.toString()} 
                isHovering={isHovering} 
                color="green" 
              />
            </div>
          </div>

          {/* Gauge */}
          <div className="relative flex flex-col items-center cursor-pointer">
            <div className="relative h-40 w-40 lg:h-44 lg:w-44">
              <svg className="h-full w-full rotate-180" viewBox="0 0 100 100">
                {/* Background arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="132 264"
                />
                <defs>
                  <linearGradient id="divergenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {/* Active arc with glow */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#divergenceGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(divergenceValue / 100) * 132} 264`}
                  className="transition-all duration-300"
                  style={{ 
                    filter: "drop-shadow(0 0 10px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 20px rgba(6, 182, 212, 0.4))",
                  }}
                />
                {/* Pulsing glow */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#divergenceGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(divergenceValue / 100) * 132} 264`}
                  style={{ filter: "blur(6px)" }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  "text-3xl font-mono font-semibold transition-colors duration-200",
                  isHovering ? "text-white" : "text-white/80",
                )}>
                  {stats.avgDivergence !== null ? (
                    <ShuffleNumber value={divergenceValue} isShuffling={isShuffling} />
                  ) : stats.activeMarkets > 0 ? (
                    <span className="text-violet-400 text-2xl">AI</span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                  {stats.avgDivergence !== null ? "Divergence" : stats.activeMarkets > 0 ? "Only Mode" : "No Data"}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className={cn(
              "mt-3 rounded-md px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all duration-200 border",
              stats.activeMarkets === 0
                ? "bg-white/5 text-white/40 border-white/10"
                : stats.avgDivergence === null
                  ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                  : divergenceValue > 25 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" 
                    : "bg-white/5 text-white/40 border-white/10",
            )}>
              {stats.activeMarkets === 0 
                ? "No Markets" 
                : stats.avgDivergence === null
                  ? "AI Analysis Only"
                  : divergenceValue > 25 
                    ? "High Opportunity" 
                    : "Low Divergence"
              }
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  isHovering,
  color = "cyan",
  subtitle,
}: {
  icon: React.ElementType
  label: string
  value: string
  isHovering: boolean
  color?: "cyan" | "violet" | "green"
  subtitle?: string
}) {
  const colors = {
    cyan: {
      icon: "text-cyan-400",
      glow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    violet: {
      icon: "text-violet-400",
      glow: "drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    green: {
      icon: "text-green-400",
      glow: "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  }

  const c = colors[color]

  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-all duration-200 border",
      "bg-white/[0.02]",
      isHovering ? c.border : "border-white/[0.05]",
    )}>
      <div className={cn("rounded p-1", c.bg)}>
        <Icon className={cn("h-3 w-3", c.icon, isHovering && c.glow)} />
      </div>
      <div>
        <p className="text-[9px] font-mono uppercase tracking-wider text-white/30 flex items-center gap-1">
          {label}
          {subtitle && <span className="text-white/20 normal-case">({subtitle})</span>}
        </p>
        <p className={cn(
          "text-xs font-mono font-medium tabular-nums transition-colors",
          value === "N/A" ? "text-white/30" : (isHovering ? "text-white/90" : "text-white/60"),
        )}>{value}</p>
      </div>
    </div>
  )
}
