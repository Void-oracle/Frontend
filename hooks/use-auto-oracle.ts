import { useEffect, useState, useCallback } from 'react'
import { getOraclePrediction } from '@/lib/api/oracle'

interface OracleResult {
  aiScore: number
  marketScore: number
  divergence: number
  summary: string
  lastUpdated: Date
  confidence: number
}

interface UseAutoOracleOptions {
  ticker: string
  query: string
  timeRangeHours?: number // data collection timeframe
  enabled?: boolean
  updateInterval?: number // in milliseconds
  initialDelay?: number // delay before first fetch
}

export function useAutoOracle({
  ticker,
  query,
  timeRangeHours = 24,
  enabled = true,
  updateInterval = 10 * 60 * 1000, // 10 minutes
  initialDelay = 0,
}: UseAutoOracleOptions) {
  const [result, setResult] = useState<OracleResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrediction = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const prediction = await getOraclePrediction({
        ticker,
        query,
        time_range_hours: timeRangeHours,
      })

      setResult({
        aiScore: prediction.ai_score,
        marketScore: prediction.market_score,
        divergence: prediction.divergence_index,
        summary: prediction.vocal_summary,
        lastUpdated: new Date(),
        confidence: prediction.confidence,
      })
    } catch (err: any) {
      console.error('Oracle prediction failed:', err)
      setError(err.message || 'Failed to get prediction')
    } finally {
      setIsLoading(false)
    }
  }, [ticker, query, enabled])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch with delay
    const initialTimer = setTimeout(() => {
      fetchPrediction()
    }, initialDelay)

    // Set up interval for updates
    const interval = setInterval(() => {
      fetchPrediction()
    }, updateInterval)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [fetchPrediction, enabled, updateInterval, initialDelay])

  // Refetch when timeRangeHours changes
  useEffect(() => {
    if (enabled && result) {
      fetchPrediction()
    }
  }, [timeRangeHours])

  return {
    result,
    isLoading,
    error,
    refetch: fetchPrediction,
  }
}
