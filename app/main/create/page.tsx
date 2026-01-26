"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CosmicBackground } from "@/components/cosmic-background"
import { Calendar, Clock, DollarSign, FileText, AlertCircle } from "lucide-react"

const categories = [
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "news", label: "News", emoji: "📰" },
  { id: "markets", label: "Markets", emoji: "📈" },
  { id: "other", label: "Other", emoji: "🔮" },
]

export default function CreateMarketPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    endDate: "",
    endTime: "",
    initialLiquidity: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating market:", formData)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <Header />
      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Market</h1>
            <p className="text-muted-foreground mb-8">Create a new prediction market for the community</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Market Question</label>
                <input
                  type="text"
                  placeholder="Will Bitcoin reach $100k by end of 2026?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </label>
                <textarea
                  placeholder="Provide additional context and resolution criteria..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <div className="grid grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                        formData.category === cat.id
                          ? "bg-cyan-500/10 border-cyan-500/50 text-foreground"
                          : "bg-card/30 border-white/10 text-muted-foreground hover:border-white/30"
                      }`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date
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
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Initial Liquidity (SOL)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.initialLiquidity}
                  onChange={(e) => setFormData({ ...formData, initialLiquidity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-card/30 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    Markets are reviewed before going live. Initial liquidity helps bootstrap trading activity and earns
                    you trading fees.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Create Market
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
