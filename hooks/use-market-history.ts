import { useEffect, useState, useCallback } from 'react'
import { getOraclePrediction } from '@/lib/api/oracle'

interface DataPoint {
  timestamp: Date
  market: number
  ai: number
  divergence: number
  summary: string
}

interface UseMarketHistoryOptions {
  ticker: string
  query: string
  timeRangeHours: number
  updateInterval?: number // in milliseconds
  enabled?: boolean
}

export function useMarketHistory({
  ticker,
  query,
  timeRangeHours,
  updateInterval = 10 * 60 * 1000, // 10 minutes
  enabled = true,
}: UseMarketHistoryOptions) {
  const [history, setHistory] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchAndAppend = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const prediction = await getOraclePrediction({
        ticker,
        query,
        time_range_hours: timeRangeHours,
      })

      const newDataPoint: DataPoint = {
        timestamp: new Date(),
        market: prediction.market_score,
        ai: prediction.ai_score,
        divergence: prediction.divergence_index,
        summary: prediction.vocal_summary,
      }

      // Append to history (don't replace, accumulate!)
      setHistory((prev) => [...prev, newDataPoint])
      setLastUpdate(new Date())
    } catch (err: any) {
      console.error('Failed to fetch market data:', err)
      setError(err.message || 'Failed to fetch prediction')
    } finally {
      setIsLoading(false)
    }
  }, [ticker, query, timeRangeHours, enabled])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchAndAppend()

    // Set up interval for updates
    const interval = setInterval(() => {
      fetchAndAppend()
    }, updateInterval)

    return () => clearInterval(interval)
  }, [fetchAndAppend, enabled, updateInterval])

  // Refetch when timeRangeHours changes
  useEffect(() => {
    if (enabled && history.length > 0) {
      fetchAndAppend()
    }
  }, [timeRangeHours])

  const currentData = history.length > 0 ? history[history.length - 1] : null

  return {
    history,
    currentData,
    isLoading,
    error,
    lastUpdate,
    refetch: fetchAndAppend,
  }
}
