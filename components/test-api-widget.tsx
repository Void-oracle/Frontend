"use client"

import { useState } from 'react'
import { getOraclePrediction, checkHealth } from '@/lib/api/oracle'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

export function TestAPIWidget() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<string>('unknown')

  async function testHealth() {
    try {
      const health = await checkHealth()
      setBackendStatus(health.status)
      setError(null)
    } catch (err: any) {
      setBackendStatus('error')
      setError('Backend not responding')
    }
  }

  async function testPrediction() {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const prediction = await getOraclePrediction({
        ticker: 'SOL',
        query: 'Will Solana reach $300 by February 2026?',
        time_range_hours: 24
      })
      
      setResult(prediction)
      setBackendStatus('healthy')
    } catch (err: any) {
      setError(err.message || 'Failed to get prediction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card/30 backdrop-blur-xl border-white/10">
      <h2 className="text-2xl font-bold mb-4">🧪 API Connection Test</h2>
      
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={testHealth}
          variant="outline"
          className="border-white/20"
        >
          Check Backend
        </Button>
        
        <Button 
          onClick={testPrediction}
          disabled={loading}
          className="bg-primary/10 hover:bg-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Test Prediction'
          )}
        </Button>
      </div>

      {/* Backend Status */}
      <div className="mb-4">
        <span className="text-sm text-muted-foreground mr-2">Backend Status:</span>
        <Badge 
          variant={backendStatus === 'healthy' ? 'default' : backendStatus === 'error' ? 'destructive' : 'secondary'}
        >
          {backendStatus}
        </Badge>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
          <p className="text-red-400 text-sm">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure backend is running: <code>cd backend && .\start_local_fixed.ps1</code>
          </p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-muted-foreground mb-1">AI Score</div>
              <div className="text-2xl font-bold text-purple-400">
                {result.ai_score.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-muted-foreground mb-1">Market Score</div>
              <div className="text-2xl font-bold text-cyan-400">
                {result.market_score.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-muted-foreground mb-1">Divergence</div>
              <div className="text-2xl font-bold text-amber-400">
                {result.divergence_index.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-muted-foreground mb-1">Confidence</div>
              <div className="text-2xl font-bold text-green-400">
                {(result.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-sm text-muted-foreground mb-2">📝 AI Summary:</div>
            <p className="text-sm">{result.vocal_summary}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-sm text-muted-foreground mb-2">📊 Data Sources:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Posts analyzed: <span className="font-semibold">{result.data_sources.twitter_posts}</span></div>
              <div>Influencer posts: <span className="font-semibold">{result.data_sources.influencer_posts}</span></div>
              <div>Bot ratio: <span className="font-semibold">{(result.data_sources.bot_ratio * 100).toFixed(1)}%</span></div>
              <div>Processing time: <span className="font-semibold">{result.processing_time_ms?.toFixed(0)}ms</span></div>
            </div>
          </div>

          <details className="p-4 bg-white/5 rounded-lg border border-white/10">
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              🔍 Full Response (JSON)
            </summary>
            <pre className="text-xs overflow-auto mt-2 p-2 bg-black/20 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </Card>
  )
}
