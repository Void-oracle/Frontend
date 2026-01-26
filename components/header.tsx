"use client"

import { Plus } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/20">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo */}
        <Link href="/main" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group">
          <Image 
            src="/images/logo.png" 
            alt="VOID Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all" 
          />
          <span className="font-bold text-lg tracking-[0.2em] bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            VOID
          </span>
        </Link>

        {/* Right side - Create Market + Connect Wallet */}
        <div className="flex items-center gap-3">
          {/* Create Market Button */}
          <Link
            href="/main/create"
            className={cn(
              "relative h-9 px-4 rounded-md text-[13px] font-medium transition-all duration-300",
              "hidden sm:flex items-center gap-2",
              "bg-transparent",
              "border border-white/10 hover:border-cyan-500/40",
              "text-white/50 hover:text-cyan-400",
              "hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Create Market</span>
          </Link>

          <WalletConnectButton />
        </div>
      </div>

      {/* Ultra-thin gradient divider */}
      <div 
        className="h-[1px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.3) 20%, rgba(99, 102, 241, 0.3) 50%, rgba(6, 182, 212, 0.3) 80%, transparent 100%)",
        }}
      />
    </header>
  )
}
