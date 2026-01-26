"use client"

import { BarChart3, Plus, HelpCircle, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "markets", label: "Markets", icon: BarChart3, href: "/main" },
  { id: "create", label: "Create", icon: Plus, href: "/main/create" },
  { id: "how", label: "How", icon: HelpCircle, href: "/main/how-it-works" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      {/* Top border - thin gradient line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.3) 50%, transparent 100%)",
        }}
      />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === "markets" 
            ? pathname === "/main" 
            : item.id === "home"
              ? pathname === "/"
              : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-cyan-400"
                  : "text-white/40 active:text-white/60"
              )}
            >
              <div className={cn(
                "p-2 rounded-md transition-all duration-200",
                isActive && "bg-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  isActive && "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                )} />
              </div>
              <span className="text-[10px] font-mono">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
