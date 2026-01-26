"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Plus, HelpCircle, FileText, ChevronLeft, ChevronRight, Activity, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

const navItems = [
  { id: "markets", label: "Markets", icon: BarChart3, href: "/main", external: false },
  { id: "create", label: "Create Market", icon: Plus, href: "/main/create", external: false },
  { id: "how", label: "How it Works", icon: HelpCircle, href: "/main/how-it-works", external: false },
  { id: "docs", label: "Documentation", icon: FileText, href: "https://docs.void.oracle", external: true },
]

const socialLinks = [
  { icon: XIcon, href: "https://x.com", label: "X" },
  { icon: TelegramIcon, href: "https://t.me", label: "Telegram" },
  { icon: GitHubIcon, href: "https://github.com", label: "GitHub" },
]

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [ping, setPing] = useState(42)
  const pathname = usePathname()

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 30) + 30)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative hidden lg:block shrink-0">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              "sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden m-0 backdrop-blur-xl transition-all duration-300",
              // Ultra-thin border with glow
              "border-r",
              isHovering
                ? "border-cyan-500/30 bg-white/[0.02]"
                : "border-white/[0.08] bg-transparent",
            )}
            style={{
              boxShadow: isHovering 
                ? "1px 0 20px rgba(6, 182, 212, 0.1), inset -1px 0 20px rgba(6, 182, 212, 0.02)" 
                : "none",
            }}
          >
            {onToggle && (
              <button
                onClick={onToggle}
                className="absolute top-3 right-3 z-20 flex h-5 w-5 items-center justify-center rounded-md border border-white/10 bg-white/5 backdrop-blur-md text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
            )}

            <div className="w-[240px] p-4 pt-10 relative">
              <nav className="space-y-0.5 relative z-10">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === "markets" ? pathname === "/main" : pathname?.startsWith(item.href)

                  if (item.external) {
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200",
                          "text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10",
                          "border border-transparent hover:border-cyan-500/20",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-40" />
                      </a>
                    )
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200",
                        "border",
                        isActive
                          ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "text-white/40 hover:text-cyan-400 hover:bg-cyan-500/5 border-transparent hover:border-cyan-500/20",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive && "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]")} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Oracle Status Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.05]">
              <div className="relative z-10">
                {/* Latency Display - Terminal Style */}
                <div className="mb-4 rounded-md bg-white/[0.02] border border-cyan-500/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/60">Oracle Latency</span>
                    <motion.div
                      className="flex items-center gap-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="h-3 w-3 text-cyan-400" />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Ping indicator with pulse */}
                    <div className="relative">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-cyan-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 h-2 w-2 rounded-full bg-cyan-400"
                        animate={{
                          scale: [1, 2.5, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <span className="text-lg font-mono font-semibold text-cyan-300 tabular-nums">{ping}ms</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.02] text-white/30 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-200"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isOpen && onToggle && (
        <button
          onClick={onToggle}
          className="fixed top-20 left-0 z-20 flex h-8 w-5 items-center justify-center rounded-r-md border-r border-t border-b border-white/10 bg-white/5 backdrop-blur-md text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-200"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
