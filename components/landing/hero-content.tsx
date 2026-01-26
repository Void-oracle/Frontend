"use client"

import { motion } from "framer-motion"
import Link from "next/link"

// Animation configuration
const baseDelay = 1.3 // Sync with video particles forming
const staggerDelay = 0.2

// Spring animation settings - soft and smooth
const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
}

// Fade up animation variant
const fadeUpVariant = {
  hidden: { 
    opacity: 0, 
    y: 25 
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...springTransition,
      delay: baseDelay + delay,
    },
  }),
}

export function HeroContent() {
  return (
    <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 text-center">
      {/* Main Title - First to appear */}
      <motion.h1
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        custom={0}
        className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
      >
        <motion.span 
          className="text-foreground"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Vocal Oracle
        </motion.span>
        <br />
        <motion.span 
          className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          custom={staggerDelay * 0.5}
        >
          of Intelligent Data
        </motion.span>
      </motion.h1>

      {/* Subtitle - Second to appear */}
      <motion.p
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        custom={staggerDelay * 2}
        className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl"
      >
        Uncover market inefficiencies with AI-powered sentiment.
        <br className="hidden sm:block" />
        See beyond the noise. Trade with clarity.
      </motion.p>

      {/* CTA Button - Third to appear */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        custom={staggerDelay * 4}
        className="mt-10"
      >
        <Link
          href="/main"
          className="group relative inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold transition-all duration-300 border"
          style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
            borderColor: "rgba(6, 182, 212, 0.5)",
            color: "rgb(6, 182, 212)",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 30px rgba(6, 182, 212, 0.6), inset 0 0 30px rgba(6, 182, 212, 0.2)"
            e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.8)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
            e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.5)"
          }}
        >
          <span className="relative z-10">Launch App</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          {/* Inner glow effect */}
          <div 
            className="absolute inset-0 rounded-lg opacity-50"
            style={{
              background: "radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.4), transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        </Link>
      </motion.div>

      {/* Stats - Last to appear */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        custom={staggerDelay * 6}
        className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
      >
        {[
          { value: "$2.4B+", label: "Trading Volume", delay: 0 },
          { value: "98.7%", label: "Accuracy Rate", delay: 0.1 },
          { value: "50ms", label: "Latency", delay: 0.2 },
        ].map((stat, index) => (
          <motion.div 
            key={index} 
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            custom={staggerDelay * 6 + stat.delay}
            className="text-center"
          >
            <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
