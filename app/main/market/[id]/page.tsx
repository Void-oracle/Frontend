"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, TrendingUp, Users, Zap, RefreshCw, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { CosmicBackground } from "@/components/cosmic-background"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"
import { TimeframeSelector, Timeframe, getTimeframeHours } from "@/components/timeframe-selector"
import { useMarketHistoryDB } from "@/hooks/use-market-history-db"

interface MarketInfo {
  market_id: string
  ticker: string
  query: string
  description: string
  status: string
  deadline: string | null
  category: string
  ai_score: number
  market_score: number
  divergence: number
  confidence: number
  vocal_summary: string
  predictions_count: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold">{entry.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "TBD"
  try {
    const date = new Date(deadline)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return deadline
  }
}

function createTitle(query: string, ticker: string): string {
  if (query.toLowerCase().includes("reach")) {
    const priceMatch = query.match(/\$[\d,]+/)
    if (priceMatch) {
      return `${ticker} to ${priceMatch[0]}?`
    }
  }
  if (query.toLowerCase().includes("approved") || query.toLowerCase().includes("etf")) {
    return `${ticker} Approval?`
  }
  if (query.toLowerCase().includes("win")) {
    return `${ticker} Win?`
  }
  return query.length > 30 ? query.substring(0, 27) + "..." : query
}

export default function MarketPage() {
  const params = useParams()
  const id = params.id as string
  
  const marketId = id.startsWith("market_") ? id : `market_${id}`
  
  const [market, setMarket] = useState<MarketInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<Timeframe>("1d")

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await fetch(`/api/v1/oracle/markets`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        
        const found = data.markets.find((m: any) => m.market_id === marketId)
        if (found) {
          setMarket(found)
          setError(null)
        } else {
          setError(`Market ${marketId} not found`)
        }
      } catch (err) {
        console.error("Failed to fetch market:", err)
        setError(err instanceof Error ? err.message : "Failed to load market")
      } finally {
        setLoading(false)
      }
    }
    
    fetchMarket()
  }, [marketId])

  const { history, currentData, isLoading: historyLoading, lastUpdate } = useMarketHistoryDB({
    marketId: marketId,
    timeRangeHours: getTimeframeHours(timeframe),
    refreshInterval: 30000,
    enabled: !!market,
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050508]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading market...</span>
      </div>
    )
  }

  if (error || !market) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050508]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Market not found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/main" className="text-primary hover:underline">
            Back to markets
          </Link>
        </div>
      </div>
    )
  }

  const aiScore = currentData?.ai_score ?? market.ai_score ?? 50
  const marketProb = currentData?.market_score ?? market.market_score ?? 50
  const divergence = Math.abs(aiScore - marketProb)
  const isHighDivergence = divergence > 20
  const title = createTitle(market.query, market.ticker)

  const chartData = history.map((point, index) => ({
    index: index + 1,
    market: Math.round(point.market_score * 10) / 10,
    ai: Math.round(point.ai_score * 10) / 10,
    divergence: Math.round(point.divergence_index * 10) / 10,
  }))

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <Header />

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <Link
          href="/main"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to markets
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-card/30 backdrop-blur-xl p-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                  {market.category || "markets"}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-muted-foreground">
                  {market.ticker}
                </span>
                {isHighDivergence && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    High Divergence
                  </span>
                )}
                {currentData && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live Data
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-muted-foreground">{market.query}</p>
            </div>
            
            <div className="ml-6">
              <TimeframeSelector selected={timeframe} onChange={setTimeframe} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted-foreground mb-1">Predictions</div>
              <div className="text-xl font-semibold">{market.predictions_count || 0}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Deadline
              </div>
              <div className="text-xl font-semibold">{formatDeadline(market.deadline)}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Confidence
              </div>
              <div className="text-xl font-semibold">{((market.confidence || 0.5) * 100).toFixed(0)}%</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Divergence
              </div>
              <div className={cn("text-xl font-semibold", isHighDivergence ? "text-primary" : "")}>
                {divergence.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Prediction History</h3>
              <div className="text-xs text-muted-foreground">
                {history.length} data points • Updates every 30 min
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="index" hide={true} />
                    <YAxis
                      domain={[0, 100]}
                      stroke="rgba(255,255,255,0.4)"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                      tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 20 }}
                      formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                    />
                    <Line
                      type="monotone"
                      dataKey="market"
                      name="Market Prediction"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#06b6d4" }}
                      activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ai"
                      name="AI Prediction"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#8b5cf6" }}
                      activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="divergence"
                      name="Divergence"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 2, fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    {historyLoading ? (
                      <>
                        <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                        <p>Loading historical data...</p>
                      </>
                    ) : (
                      <>
                        <p className="mb-2">No history data yet</p>
                        <p className="text-sm">Data will accumulate as AI analyzes this market</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Market Probability</span>
                <span className="text-sm font-semibold">{marketProb.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${marketProb}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">AI Prediction</span>
                <span className="text-sm font-semibold">{aiScore.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${aiScore}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
