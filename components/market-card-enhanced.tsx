"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, TrendingUp, Zap, Brain, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getOraclePrediction } from "@/lib/api/oracle"

interface Market {
  id: number
  title: string
  description?: string
  ticker?: string
  marketProbability: number
  aiTruthScore: number
  volume: string
  endDate: string
  category?: string
}

export function MarketCardEnhanced({ market, index }: { market: Market; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [realScores, setRealScores] = useState<{
    aiScore: number
    marketScore: number
    summary?: string
  } | null>(null)
  
  // Use real scores if available, otherwise use mock data
  const aiScore = realScores?.aiScore ?? market.aiTruthScore
  const marketScore = realScores?.marketScore ?? market.marketProbability
  const divergence = Math.abs(aiScore - marketScore)
  const isHighDivergence = divergence > 20

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  async function analyzeMarket(e: React.MouseEvent) {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()
    
    if (isAnalyzing || analyzed) return
    
    setIsAnalyzing(true)
    
    try {
      const result = await getOraclePrediction({
        ticker: market.ticker || 'SOL',
        query: market.description || market.title,
        time_range_hours: 24
      })
      
      setRealScores({
        aiScore: result.ai_score,
        marketScore: result.market_score,
        summary: result.vocal_summary
      })
      setAnalyzed(true)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="relative">
      <motion.div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "group relative overflow-hidden rounded-lg p-5 transition-all duration-200 h-full",
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

        {/* Analyzed Badge */}
        {analyzed && (
          <div className="absolute left-3 top-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              <span className="text-[10px] text-green-400 font-medium">AI Analyzed</span>
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
          <ProgressBar 
            label="Market" 
            value={marketScore} 
            isHovering={isHovering}
            isReal={analyzed}
          />
          <ProgressBar 
            label="AI Truth" 
            value={aiScore} 
            isHovering={isHovering}
            isReal={analyzed}
          />
        </div>

        {/* Divergence Badge */}
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-all duration-150",
            isHighDivergence ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground",
          )}
        >
          <TrendingUp className="h-2.5 w-2.5" />
          {divergence.toFixed(1)}% Gap
        </div>

        {/* AI Summary (if analyzed) */}
        {analyzed && realScores?.summary && (
          <div className="mb-3 p-3 rounded bg-white/5 border border-white/10">
            <p className="text-xs text-muted-foreground line-clamp-3">
              {realScores.summary}
            </p>
          </div>
        )}

        {/* Analyze Button */}
        {!analyzed && (
          <button
            onClick={analyzeMarket}
            disabled={isAnalyzing}
            className={cn(
              "mb-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded",
              "text-xs font-medium transition-all",
              "bg-primary/10 hover:bg-primary/20 text-primary",
              "border border-primary/20 hover:border-primary/40",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-3 w-3" />
                Analyze with AI
              </>
            )}
          </button>
        )}

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

        {/* View Details Link */}
        <Link 
          href={`/main/market/${market.id}`}
          className="absolute inset-0 z-0"
          aria-label={`View details for ${market.title}`}
        />
      </motion.div>
    </div>
  )
}

function ProgressBar({
  label,
  value,
  isHovering,
  isReal = false,
}: {
  label: string
  value: number
  isHovering: boolean
  isReal?: boolean
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 200)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider">
        <span className="text-muted-foreground flex items-center gap-1">
          {label}
          {isReal && <span className="text-green-400">●</span>}
        </span>
        <span
          className={cn(
            "font-medium tabular-nums transition-opacity duration-150",
            isHovering ? "opacity-100" : "opacity-60",
            isReal && "text-primary"
          )}
        >
          {value.toFixed(1)}%
        </span>
      </div>
      <div
        className={cn(
          "h-1 overflow-hidden rounded-full transition-all duration-150",
          isHovering ? "bg-muted/50" : "bg-muted/20",
        )}
      >
        <motion.div
          className={cn(
            "h-full rounded-full",
            isReal ? "bg-primary" : "bg-primary/70"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
