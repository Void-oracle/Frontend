/**
 * VOID Oracle API Client
 * Connects frontend to backend API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export interface OraclePredictionRequest {
  ticker: string;
  query: string;
  market_id?: string;
  time_range_hours?: number;
}

export interface OraclePredictionResponse {
  ticker: string;
  ai_score: number;
  market_score: number;
  divergence_index: number;
  vocal_summary: string;
  confidence: number;
  data_sources: {
    twitter_posts: number;
    influencer_posts: number;
    bot_ratio: number;
    total_engagement: number;
    unique_accounts: number;
    time_span_hours: number;
  };
  sentiment_analysis?: {
    sentiment_score: {
      bullish: number;
      bearish: number;
      neutral: number;
      overall: number;
      confidence: number;
    };
    key_phrases: string[];
    trending_topics: string[];
    sentiment_momentum: number;
  };
  bot_detection?: {
    bot_probability: number;
    authentic_ratio: number;
    suspicious_patterns: string[];
    top_influencers: Array<{
      username: string;
      followers: number;
      verified: boolean;
      engagement_rate: number;
      credibility_score: number;
    }>;
  };
  timestamp: string;
  processing_time_ms?: number;
}

export interface HistoryDataPoint {
  id: number;
  market_id: string;
  ticker: string;
  ai_score: number;
  market_score: number;
  divergence_index: number;
  confidence: number;
  vocal_summary: string;
  timestamp: string;
}

/**
 * Get oracle prediction for a market (triggers new analysis)
 */
export async function getOraclePrediction(
  request: OraclePredictionRequest
): Promise<OraclePredictionResponse> {
  const response = await fetch(`${API_BASE}/oracle/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ticker: request.ticker,
      query: request.query,
      market_id: request.market_id,
      time_range_hours: request.time_range_hours || 24,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get prediction history for a market (from database)
 */
export async function getMarketHistory(
  marketId: string,
  options?: {
    limit?: number;
    timeRangeHours?: number;
  }
): Promise<{ market_id: string; count: number; history: HistoryDataPoint[] }> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.timeRangeHours) params.append('time_range_hours', options.timeRangeHours.toString());

  const response = await fetch(`${API_BASE}/oracle/history/${marketId}?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get latest prediction for a market (from database)
 */
export async function getLatestPrediction(
  marketId: string,
  timeRangeHours: number = 24
): Promise<HistoryDataPoint> {
  const response = await fetch(
    `${API_BASE}/oracle/latest/${marketId}?time_range_hours=${timeRangeHours}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch latest prediction: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch('/health');
  
  if (!response.ok) {
    throw new Error('Backend is not responding');
  }
  
  return response.json();
}

/**
 * Get list of all tracked markets
 */
export async function getTrackedMarkets(): Promise<{ count: number; markets: string[] }> {
  const response = await fetch(`${API_BASE}/oracle/markets`);

  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }

  return response.json();
}
