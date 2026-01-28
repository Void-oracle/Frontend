/**
 * VOID Oracle API Client
 * Connects frontend to backend API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// ==================== Market Types ====================

export interface CreateMarketRequest {
  ticker: string;
  query: string;
  description?: string;
  category?: string;
  deadline?: string;
  check_interval_minutes?: number;
  external_market_url?: string;
}

export interface Market {
  id: number;
  market_id: string;
  ticker: string;
  query: string;
  description: string | null;
  category: string;
  deadline: string | null;
  target_tweets: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  created_by: string;
  monitoring_active: number;
  check_interval_minutes: number;
  external_market_url: string | null;
  // AI prediction data
  ai_score?: number;
  market_score?: number;
  divergence_index?: number;
  confidence?: number;
  vocal_summary?: string;
  last_prediction?: string;
}

export interface CreateMarketResponse {
  success: boolean;
  message: string;
  market: Market;
}

export interface ListMarketsResponse {
  count: number;
  markets: Market[];
}

// ==================== Oracle Types ====================

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
 * Get list of all tracked markets (legacy - oracle endpoint)
 */
export async function getTrackedMarkets(): Promise<{ count: number; markets: string[] }> {
  const response = await fetch(`${API_BASE}/oracle/markets`);

  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }

  return response.json();
}

// ==================== Markets Management ====================

/**
 * Create a new prediction market
 */
export async function createMarket(request: CreateMarketRequest): Promise<CreateMarketResponse> {
  const response = await fetch(`${API_BASE}/markets/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get list of all markets
 */
export async function listMarkets(options?: {
  status?: string;
  category?: string;
  monitoring_active?: boolean;
}): Promise<ListMarketsResponse> {
  const params = new URLSearchParams();
  if (options?.status) params.append('status', options.status);
  if (options?.category) params.append('category', options.category);
  if (options?.monitoring_active !== undefined) {
    params.append('monitoring_active', options.monitoring_active.toString());
  }

  const url = params.toString() 
    ? `${API_BASE}/markets/list?${params}` 
    : `${API_BASE}/markets/list`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch markets');
  }

  return response.json();
}

/**
 * Get market details by ID
 */
export async function getMarket(marketId: string): Promise<Market> {
  const response = await fetch(`${API_BASE}/markets/${marketId}`);

  if (!response.ok) {
    throw new Error(`Market ${marketId} not found`);
  }

  return response.json();
}

/**
 * Delete a market
 */
export async function deleteMarket(marketId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/markets/${marketId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete market ${marketId}`);
  }

  return response.json();
}
