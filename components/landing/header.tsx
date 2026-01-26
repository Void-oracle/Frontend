"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// Sync with hero animation timing
const baseDelay = 0.8 // Header appears slightly before hero content

const fadeDownVariant = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: baseDelay,
    },
  },
}

export function Header() {
  return (
    <motion.header
      variants={fadeDownVariant}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20, 
              delay: baseDelay + 0.1 
            }}
          >
            <Image 
              src="/images/logo.png" 
              alt="VOID Logo" 
              width={44} 
              height={44} 
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
            />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20, 
              delay: baseDelay + 0.2 
            }}
            className="font-bold text-xl sm:text-2xl tracking-[0.15em] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg"
          >
            VOID
          </motion.span>
        </Link>

        {/* Navigation links for desktop */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: baseDelay + 0.4, duration: 0.5 }}
          className="hidden md:flex items-center gap-6"
        >
          <Link 
            href="/main" 
            className="text-sm text-white/70 hover:text-cyan-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/main/how-it-works" 
            className="text-sm text-white/70 hover:text-cyan-400 transition-colors"
          >
            How it Works
          </Link>
        </motion.nav>
      </div>
    </motion.header>
  )
}
