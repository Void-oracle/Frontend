"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CosmicBackground } from "@/components/cosmic-background"
import { Brain, TrendingUp, Users, Zap, Shield, BarChart3 } from "lucide-react"

const steps = [
  {
    icon: Users,
    title: "Create or Join Markets",
    description: "Browse prediction markets or create your own on any topic - sports, politics, crypto, and more.",
  },
  {
    icon: Brain,
    title: "AI Truth Oracle",
    description:
      "Our AI analyzes real-time data from multiple sources to generate probability predictions independent of market sentiment.",
  },
  {
    icon: TrendingUp,
    title: "Divergence Detection",
    description:
      "When market prices diverge significantly from AI predictions, we highlight potential opportunities for informed traders.",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    description:
      "Monitor how AI predictions compare to market consensus over time. Use this data to inform your trading strategy.",
  },
]

const features = [
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "AI predictions update continuously as new information becomes available.",
  },
  {
    icon: Shield,
    title: "Transparent Methodology",
    description: "All AI predictions come with confidence scores and source citations.",
  },
]

export default function HowItWorksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      <Header />
      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                How{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  VOID
                </span>{" "}
                Works
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                VOID combines prediction markets with AI-powered truth detection to surface information asymmetries and
                help you make better decisions.
              </p>
            </div>

            <div className="space-y-6 mb-16">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 p-6 rounded-2xl bg-card/20 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 shrink-0">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                          Step {index + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 border border-white/10">
              <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Divergence</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What is Divergence?</h4>
                  <p className="text-sm text-muted-foreground">
                    Divergence measures the difference between what the market believes (price) and what our AI predicts
                    based on data analysis. High divergence suggests the market may be mispricing an outcome.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Why Does it Matter?</h4>
                  <p className="text-sm text-muted-foreground">
                    Markets can be slow to incorporate new information or be influenced by sentiment. The AI provides an
                    independent, data-driven perspective to help identify potential opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-card/20 border border-white/10"
                  >
                    <Icon className="h-8 w-8 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
