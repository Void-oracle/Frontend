"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DivergenceHero } from "@/components/divergence-hero"
import { MarketGrid } from "@/components/market-grid"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function AppDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden bg-black">
      {/* Video Background - Cyber Cockpit Effect */}
      <div className="fixed inset-0 z-0">
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030308] via-[#050510] to-[#02020a]" />
        
        {/* Video background - very visible */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90 hidden sm:block"
          style={{ 
            filter: "brightness(0.8) blur(2px)",
          }}
        >
          <source src="/hero-particles.mp4" type="video/mp4" />
        </video>

        {/* Minimal overlay */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Subtle vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Subtle cosmic glow accents */}
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 hidden lg:block"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 hidden lg:block"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Header />
        
        {/* Mobile Navigation */}
        <MobileNav />
        
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
            <DivergenceHero />
            <MarketGrid />
          </main>
        </div>
      </div>
    </div>
  )
}
