"use client"

import { TestAPIWidget } from "@/components/test-api-widget"

export default function TestAPIPage() {
  return (
    <div className="min-h-screen bg-[#050508] p-8">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">API Integration Test</h1>
          <p className="text-muted-foreground">
            Test connection between frontend and backend
          </p>
        </div>

        <TestAPIWidget />

        <div className="mt-8 p-6 bg-card/30 backdrop-blur-xl border border-white/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">📡 Connection Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">API Docs:</span>{' '}
              <a 
                href="/api/v1/docs" 
                target="_blank"
                className="text-primary hover:underline"
              >
                /api/v1/docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
