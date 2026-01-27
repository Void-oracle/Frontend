"use client"

import { useState, useEffect } from "react"
import { MarketCardAuto } from "@/components/market-card-auto"
import { cn } from "@/lib/utils"
import { Trophy, Newspaper, TrendingUp, MoreHorizontal, Search, X, RefreshCw, Loader2, Plus } from "lucide-react"
import Link from "next/link"

interface Market {
  id: number
  market_id: string
  title: string
  description: string
  ticker: string
  marketProbability: number
  aiTruthScore: number
  volume: string
  endDate: string
  category: string
  lastUpdate?: string
}

const categories = [
  { id: "all", label: "All", icon: null },
  { id: "crypto", label: "Crypto", icon: TrendingUp },
  { id: "tech", label: "Tech", icon: Newspaper },
  { id: "politics", label: "Politics", icon: Trophy },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "other", label: "Other", icon: MoreHorizontal },
]

// Helper to format deadline
function formatDeadline(deadline: string | null): string {
  if (!deadline) return "TBD"
  try {
    const date = new Date(deadline)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return deadline
  }
}

// Helper to create title from query - show full question
function createTitle(query: string, ticker: string): string {
  // Show full query as title
  return query
}

export function MarketGrid() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch markets from API
  const fetchMarkets = async () => {
    try {
        const response = await fetch(`/api/v1/oracle/markets`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform API data to frontend format
      const transformedMarkets: Market[] = data.markets.map((m: any, index: number) => ({
        id: index + 1,
        market_id: m.market_id,
        title: createTitle(m.query, m.ticker),
        description: m.query,
        ticker: m.ticker,
        marketProbability: Math.round(m.market_score || 50),
        aiTruthScore: Math.round(m.ai_score || 50),
        volume: "$0",  // Not tracked yet
        endDate: formatDeadline(m.deadline),
        category: m.category || "markets",
        lastUpdate: m.last_update,
      }))
      
      setMarkets(transformedMarkets)
      setError(null)
      setLastRefresh(new Date())
    } catch (err) {
      console.error("Failed to fetch markets:", err)
      setError(err instanceof Error ? err.message : "Failed to load markets")
    } finally {
      setLoading(false)
    }
  }

  // Initial load and periodic refresh
  useEffect(() => {
    fetchMarkets()
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchMarkets, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredMarkets = markets.filter((m) => {
    const matchesCategory = activeCategory === "all" || m.category === activeCategory
    const matchesSearch = searchQuery === "" || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading markets from AI...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-400 mb-4">⚠️ {error}</p>
        <button 
          onClick={fetchMarkets}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Active Markets</h2>
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search markets..."
                    autoFocus
                    className="h-9 w-64 rounded-lg border border-white/20 bg-card/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-card/30 text-muted-foreground hover:text-foreground hover:border-white/40 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-card/30 text-muted-foreground hover:text-foreground hover:border-white/40 transition-all"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMarkets}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-card/30 text-muted-foreground hover:text-foreground hover:border-white/40 transition-all"
            title="Refresh markets"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <p className="text-sm text-muted-foreground">{filteredMarkets.length} markets</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
                "border",
                activeCategory === cat.id
                  ? "bg-primary/10 border-primary/50 text-primary"
                  : "bg-card/30 border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {cat.label}
            </button>
          )
        })}
      </div>

      {filteredMarkets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          {markets.length === 0 ? (
            <>
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-cyan-400" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">No markets yet</p>
              <p className="text-sm mb-4">Be the first to create a prediction market!</p>
              <Link
                href="/main/create"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Create Market
              </Link>
            </>
          ) : (
            <>
              <p>No markets found</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMarkets.map((market, index) => (
            <MarketCardAuto 
              key={market.market_id || market.id} 
              market={market} 
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
