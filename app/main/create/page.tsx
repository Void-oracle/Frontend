"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CosmicBackground } from "@/components/cosmic-background"
import { Calendar, Clock, Tag, FileText, AlertCircle, Loader2, CheckCircle2, Sparkles, Link2 } from "lucide-react"
import { createMarket } from "@/lib/api/oracle"
import Link from "next/link"

const categories = [
  { id: "crypto", label: "Crypto", emoji: "₿" },
  { id: "tech", label: "Tech", emoji: "🤖" },
  { id: "politics", label: "Politics", emoji: "🏛️" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "other", label: "Other", emoji: "🔮" },
]

type FormStatus = "idle" | "loading" | "success" | "error"

export default function CreateMarketPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [createdMarket, setCreatedMarket] = useState<{ market_id: string; ticker: string } | null>(null)
  
  const [formData, setFormData] = useState({
    ticker: "",
    query: "",
    description: "",
    category: "crypto",
    endDate: "",
    endTime: "",
    externalMarketUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.ticker.trim()) {
      setErrorMessage("Please enter a ticker symbol")
      setStatus("error")
      return
    }
    if (!formData.query.trim()) {
      setErrorMessage("Please enter a market question")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      // Build deadline if date is provided
      let deadline: string | undefined
      if (formData.endDate) {
        const time = formData.endTime || "23:59:59"
        deadline = `${formData.endDate}T${time}`
      }

      const response = await createMarket({
        ticker: formData.ticker.toUpperCase(),
        query: formData.query,
        description: formData.description || undefined,
        category: formData.category,
        deadline,
        external_market_url: formData.externalMarketUrl || undefined,
      })

      setCreatedMarket({
        market_id: response.market.market_id,
        ticker: response.market.ticker,
      })
      setStatus("success")
      
      // Reset form
      setFormData({
        ticker: "",
        query: "",
        description: "",
        category: "crypto",
        endDate: "",
        endTime: "",
        externalMarketUrl: "",
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create market")
      setStatus("error")
    }
  }

  const resetForm = () => {
    setStatus("idle")
    setCreatedMarket(null)
    setErrorMessage("")
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <Header />
      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold text-foreground">Create Test Market</h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Create a prediction market to test our AI oracle. Markets are monitored automatically.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" && createdMarket ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6"
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-2">Market Created!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your market <span className="text-cyan-400 font-mono">{createdMarket.ticker}</span> is now being monitored by our AI oracle.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href={`/main/market/${createdMarket.market_id}`}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      View Market
                    </Link>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground font-semibold hover:border-white/30 transition-colors"
                    >
                      Create Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Ticker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Ticker Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="BTC-200K, ETH-10K, SOL-ETF..."
                      value={formData.ticker}
                      onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                      maxLength={20}
                    />
                    <p className="text-xs text-muted-foreground">Short identifier for your market (e.g., BTC-200K)</p>
                  </div>

                  {/* Market Question */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Market Question</label>
                    <input
                      type="text"
                      placeholder="Will Bitcoin reach $200,000 by end of 2026?"
                      value={formData.query}
                      onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">The question your market will answer (Yes/No format works best)</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                      <span className="text-xs text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      placeholder="Provide additional context and resolution criteria..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    />
                  </div>

                  {/* External Market URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      External Market URL
                      <span className="text-xs text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://polymarket.com/event/... or https://predictfun.com/..."
                      value={formData.externalMarketUrl}
                      onChange={(e) => setFormData({ ...formData, externalMarketUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">
                      Link to existing market on Polymarket, PredictFun, or other prediction markets. 
                      If provided, we'll track real market probability.
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <div className="grid grid-cols-5 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                            formData.category === cat.id
                              ? "bg-cyan-500/10 border-cyan-500/50 text-foreground"
                              : "bg-card/30 border-white/10 text-muted-foreground hover:border-white/30"
                          }`}
                        >
                          <span className="text-xl">{cat.emoji}</span>
                          <span className="text-[10px] font-medium">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Deadline Date
                        <span className="text-xs text-muted-foreground">(optional)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Deadline Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        disabled={!formData.endDate}
                        className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                    <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Test Mode:</strong> Markets are created instantly and monitored by our AI oracle. 
                        The AI will analyze sentiment from various sources and provide probability predictions.
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {status === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                      <p className="text-sm text-red-400">{errorMessage}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Market...
                      </>
                    ) : (
                      "Create Market"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
