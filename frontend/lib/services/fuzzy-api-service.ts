// lib/services/fuzzyAPI.ts
const API_BASE_URL = 'http://localhost:8000';

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

export interface StrategiesResponse {
  strategies: string[];
  status: string;
  tentacles: string;
}

export class FuzzyAPI {
  // Health Check
  static async getHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Get Strategies (8 tentacles)
  static async getStrategies(): Promise<StrategiesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fuzzy/strategies`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Strategies fetch failed:', error);
      // Fallback response when API is down
      return {
        strategies: [
          "🎯 Strategy 1: Focused Analysis",
          "🔍 Strategy 2: Deep Research", 
          "🚀 Strategy 3: Innovation Mode",
          "🎨 Strategy 4: Creative Synthesis",
          "⚡ Strategy 5: Quick Response",
          "🧠 Strategy 6: Logic Processing",
          "💡 Strategy 7: Insight Generation",
          "🐙 Strategy 8: Full Tentacle Mode"
        ],
        status: "fallback",
        tentacles: "🐙 8 strategies (offline mode)"
      };
    }
  }

  // Query Fuzzy Engine
  static async queryFuzzy(query: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fuzzy/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fuzzy query failed:', error);
      // Fallback response
      return {
        result: `🐙 Fuzzy analysis for: "${query}"`,
        strategies_used: ["🎯", "🔍", "🚀"],
        confidence: 0.85,
        status: "fallback"
      };
    }
  }
}