"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Reduced particles for mobile
    const starCount = isMobile ? 40 : 80
    const dustCount = isMobile ? 60 : 150

    // Refined Starfield
    const stars: Array<{ 
      x: number; 
      y: number; 
      size: number; 
      baseOpacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }> = []

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        baseOpacity: Math.random() * 0.4 + 0.2,
        twinkleSpeed: Math.random() * 0.002 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }

    // Data Dust
    const dustParticles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }> = []

    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * Math.max(canvas.width, canvas.height)
      dustParticles.push({
        x: canvas.width / 2 + Math.cos(angle) * distance,
        y: canvas.height / 2 + Math.sin(angle) * distance,
        size: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.15 + 0.05,
      })
    }

    let time = 0
    let animationId: number

    const animate = () => {
      ctx.fillStyle = "rgba(5, 5, 10, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 1

      // Draw stars (simplified for mobile)
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
        const opacity = star.baseOpacity * twinkle

        if (isMobile) {
          // Simple stars on mobile
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Glowing stars on desktop
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          )
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(0.3, `rgba(200, 210, 255, ${opacity * 0.4})`)
          gradient.addColorStop(1, "transparent")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw dust (skip complex gradients on mobile)
      if (!isMobile) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        dustParticles.forEach((dust) => {
          const dx = centerX - dust.x
          const dy = centerY - dust.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 50) {
            dust.x += (dx / distance) * dust.speed
            dust.y += (dy / distance) * dust.speed
          } else {
            const angle = Math.random() * Math.PI * 2
            const newDistance = Math.max(canvas.width, canvas.height) * 0.7
            dust.x = centerX + Math.cos(angle) * newDistance
            dust.y = centerY + Math.sin(angle) * newDistance
          }

          const fadeFactor = Math.min(distance / 300, 1)
          const currentOpacity = dust.opacity * fadeFactor

          const dustGradient = ctx.createRadialGradient(
            dust.x, dust.y, 0,
            dust.x, dust.y, dust.size * 3
          )
          dustGradient.addColorStop(0, `rgba(139, 92, 246, ${currentOpacity})`)
          dustGradient.addColorStop(0.5, `rgba(99, 102, 241, ${currentOpacity * 0.5})`)
          dustGradient.addColorStop(1, "transparent")

          ctx.fillStyle = dustGradient
          ctx.beginPath()
          ctx.arc(dust.x, dust.y, dust.size * 3, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Deep space base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#06050f] via-[#050508] to-[#0a0812]" />

      {/* Living Nebula - reduced on mobile */}
      
      {/* Primary Violet Nebula */}
      <motion.div
        className="absolute w-[100vw] h-[100vh] rounded-full hidden sm:block"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, rgba(79, 70, 229, 0.06) 40%, transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{
          x: ["-30%", "10%", "-20%", "-30%"],
          y: ["-20%", "10%", "-30%", "-20%"],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mobile-only simplified nebula */}
      <div 
        className="absolute inset-0 sm:hidden"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Secondary Indigo Nebula - desktop only */}
      <motion.div
        className="absolute w-[90vw] h-[90vh] rounded-full hidden sm:block"
        style={{
          background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, rgba(67, 56, 202, 0.05) 50%, transparent 75%)",
          filter: "blur(140px)",
        }}
        animate={{
          x: ["60%", "20%", "50%", "60%"],
          y: ["50%", "10%", "40%", "50%"],
          scale: [1.1, 0.85, 1.15, 1.1],
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tertiary Cyan Accent - desktop only */}
      <motion.div
        className="absolute w-[60vw] h-[60vh] rounded-full hidden md:block"
        style={{
          background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.08) 0%, rgba(34, 211, 238, 0.04) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: ["10%", "40%", "-10%", "10%"],
          y: ["30%", "-10%", "20%", "30%"],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Deep Purple Atmosphere - desktop only */}
      <motion.div
        className="absolute w-[120vw] h-[120vh] -left-[10vw] -top-[10vh] rounded-full hidden lg:block"
        style={{
          background: "radial-gradient(ellipse at center, rgba(88, 28, 135, 0.08) 0%, rgba(55, 48, 163, 0.04) 50%, transparent 80%)",
          filter: "blur(150px)",
        }}
        animate={{
          scale: [1, 1.08, 0.95, 1],
          opacity: [0.6, 0.8, 0.5, 0.6],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Central glow - desktop only */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] rounded-full opacity-30 hidden sm:block"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  )
}
