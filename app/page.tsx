import { Header } from "@/components/landing/header"
import { HeroContent } from "@/components/landing/hero-content"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-black">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030308] via-[#0a0a15] to-[#05050a]" />
        
        {/* Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            filter: "brightness(0.6)",
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20">
        <Header />
        <HeroContent />
      </div>
    </main>
  )
}
