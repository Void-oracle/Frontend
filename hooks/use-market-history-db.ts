import { useEffect, useState } from 'react'
import { getMarketHistory, getLatestPrediction, type HistoryDataPoint } from '@/lib/api/oracle'

interface UseMarketHistoryDBOptions {
  marketId: string
  timeRangeHours?: number
  refreshInterval?: number // in milliseconds
  enabled?: boolean
}

export function useMarketHistoryDB({
  marketId,
  timeRangeHours = 24,
  refreshInterval = 30000, // 30 seconds by default
  enabled = true,
}: UseMarketHistoryDBOptions) {
  const [history, setHistory] = useState<HistoryDataPoint[]>([])
  const [currentData, setCurrentData] = useState<HistoryDataPoint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchHistory = async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch history from database
      const result = await getMarketHistory(marketId, {
        limit: 100,
        timeRangeHours,
      })

      // Reverse to show oldest first
      const sortedHistory = [...result.history].reverse()
      setHistory(sortedHistory)

      // Get latest prediction
      if (sortedHistory.length > 0) {
        setCurrentData(sortedHistory[sortedHistory.length - 1])
      }

      setLastUpdate(new Date())
    } catch (err: any) {
      console.error('Failed to fetch market history:', err)
      setError(err.message || 'Failed to fetch history')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchHistory()

    // Set up polling
    const interval = setInterval(() => {
      fetchHistory()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [marketId, timeRangeHours, enabled, refreshInterval])

  return {
    history,
    currentData,
    isLoading,
    error,
    lastUpdate,
    refetch: fetchHistory,
  }
}
