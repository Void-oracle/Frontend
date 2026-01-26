"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  phase: number
}

export function SignalLine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const particleCount = Math.floor(width / 12)
    const particles: Particle[] = []
    const centerY = height / 2

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (i / particleCount) * width + 6,
        phase: Math.random() * Math.PI * 2,
      })
    }

    let animationId: number
    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      time += 0.015

      // Base line
      ctx.strokeStyle = "rgba(99, 150, 241, 0.1)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.stroke()

      particles.forEach((particle) => {
        const twinkle = Math.sin(time + particle.phase) * 0.5 + 0.5
        const opacity = 0.3 + twinkle * 0.7

        // Soft glow - same size for all
        const gradient = ctx.createRadialGradient(particle.x, centerY, 0, particle.x, centerY, 3)
        gradient.addColorStop(0, `rgba(150, 220, 255, ${opacity * 0.9})`)
        gradient.addColorStop(0.6, `rgba(99, 150, 241, ${opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(99, 102, 241, 0)`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(particle.x, centerY, 3, 0, Math.PI * 2)
        ctx.fill()

        // Bright core - same size for all
        ctx.beginPath()
        ctx.fillStyle = `rgba(230, 245, 255, ${opacity})`
        ctx.arc(particle.x, centerY, 1, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="relative h-[2px] w-full overflow-hidden">
      {/* Base line */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Shimmer gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        style={{
          animation: "shimmer 8s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Subtle static gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-indigo-500/20" />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}
