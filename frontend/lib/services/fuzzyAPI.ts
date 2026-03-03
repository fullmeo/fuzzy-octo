// lib/services/fuzzyAPI.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiError extends Error {
  status?: number;
  details?: any;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    database: string;
    redis: string;
    openai: string;
  };
  tentacles: string;
}

export interface QueryResult {
  result: string;
  strategies_used?: string[];
  confidence?: number;
  [key: string]: any;
}

export interface StrategiesResponse {
  strategies: string[];
  status: string;
  tentacles: string;
}

export class FuzzyAPI {
  // Health Check
  static async getHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const error: ApiError = new Error(data.message || 'Health check failed');
        error.status = response.status;
        error.details = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      const apiError = error as ApiError;
      if (!apiError.status) {
        apiError.message = 'Network error: Unable to connect to the server';
      }
      throw apiError;
    }
  }

  // Get Strategies (8 tentacles)
  static async getStrategies(): Promise<StrategiesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fuzzy/strategies`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const error: ApiError = new Error(data.message || 'Failed to fetch strategies');
        error.status = response.status;
        error.details = data;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Strategies fetch failed:', error);
      const apiError = error as ApiError;
      
      // Only provide fallback for network errors, not for API errors
      if (apiError.message.includes('Failed to fetch') || !apiError.status) {
        console.warn('Using fallback strategies due to network error');
        return {
          strategies: [
            "🎯 Strategy 1: Focused Analysis",
            "🔍 Strategy 2: Deep Research", 
            "🚀 Strategy 3: Innovation Mode",
            "🎨 Strategy 4: Creative Synthesis",
            "⚡ Strategy 5: Quick Response",
            "🧠 Strategy 6: Logic Processing",
            "🔮 Strategy 7: Predictive Analysis",
            "🤖 Strategy 8: AI Integration"
          ],
          status: "fallback",
          tentacles: "8"
        };
      }
      throw apiError;
    }
  }

  // Query the fuzzy engine
  static async queryFuzzy(query: string): Promise<QueryResult> {
    if (!query.trim()) {
      throw new Error('Query cannot be empty');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/fuzzy/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = new Error(data.message || 'Query failed');
        error.status = response.status;
        error.details = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Query failed:', error);
      const apiError = error as ApiError;
      
      if (!apiError.status) {
        apiError.message = 'Network error: Unable to connect to the server';
      }
      
      throw apiError;
    }
  }
}
