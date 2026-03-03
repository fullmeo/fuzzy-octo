'use client';

import { useState, useEffect, useCallback } from 'react';
import { FuzzyAPI, HealthResponse, StrategiesResponse, QueryResult } from '@/lib/services/fuzzyAPI';

type ApiError = Error & {
  status?: number;
  details?: any;
};

export default function TentaclesDashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [strategies, setStrategies] = useState<StrategiesResponse | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load health and strategies on mount
  const loadInitialData = useCallback(async () => {
    if (!mounted) return;
    
    try {
      setIsInitialLoading(true);
      setError(null);
      await Promise.all([loadHealthData(), loadStrategies()]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load initial data');
      console.error('Failed to load initial data:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      await Promise.all([loadHealthData(), loadStrategies()]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to refresh data');
      console.error('Failed to refresh data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadHealthData = async () => {
    try {
      const healthData = await FuzzyAPI.getHealth();
      setHealth(healthData);
      return healthData;
    } catch (error) {
      console.error('Failed to load health:', error);
      throw error;
    }
  };

  const loadStrategies = async () => {
    try {
      const strategiesData = await FuzzyAPI.getStrategies();
      setStrategies(strategiesData);
      return strategiesData;
    } catch (error) {
      console.error('Failed to load strategies:', error);
      throw error;
    }
  };

  const handleQuery = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const queryResult = await FuzzyAPI.queryFuzzy(query);
      setResult(queryResult);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.details?.message || apiError.message || 'Failed to process query';
      setError(errorMessage);
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (service: string) => {
    if (service.includes('✅')) return 'text-green-500';
    if (service.includes('❌')) return 'text-red-500';
    return 'text-gray-500';
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
      <p className="text-white text-lg">Loading Fuzzy-Octo...</p>
    </div>
  );

  if (!mounted || isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        {renderLoadingState()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🐙 Fuzzy-Octo Dashboard
          </h1>
          <p className="text-xl text-blue-200">
            8 Tentacles Intelligence System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Health Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">🏥 System Health</h2>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-white/80 hover:text-white transition-colors flex items-center gap-1"
              aria-label="Refresh data"
            >
              {isRefreshing ? (
                <>
                  <span className="inline-block animate-spin mr-1">⟳</span>
                  Refreshing...
                </>
              ) : (
                <>
                  <span>⟳</span>
                  Refresh
                </>
              )}
            </button>
          </div>
          {health ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium text-white">Database</h3>
                <p className={getStatusColor(health.services.database)}>
                  {health.services.database}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium text-white">Redis</h3>
                <p className={getStatusColor(health.services.redis)}>
                  {health.services.redis}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium text-white">OpenAI</h3>
                <p className={getStatusColor(health.services.openai)}>
                  {health.services.openai}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-pulse bg-white/5 rounded-lg h-20"></div>
          )}
        </div>

        {/* Strategies Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🐙 Eight Tentacles Strategies
          </h2>
          {strategies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategies.strategies.map((strategy, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-300/30 hover:border-purple-300/60 transition-all cursor-pointer"
                >
                  <p className="text-white text-sm font-medium">
                    {strategy}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-16"></div>
              ))}
            </div>
          )}
        </div>

        {/* Query Interface */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🚀 Query Fuzzy Engine
          </h2>
          
          <form onSubmit={handleQuery} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the 8 tentacles anything..."
                className="flex-1 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                aria-label="Enter your query"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                aria-label={loading ? 'Processing query' : 'Submit query'}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⟳</span>
                    Thinking...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Query
                  </>
                )}
              </button>
            </div>
            {!query.trim() && (
              <p className="text-sm text-red-300 mt-1">Please enter a query</p>
            )}
          </form>

          {/* Results */}
          {result && (
            <div className="bg-white/5 rounded-lg p-4 border border-green-300/30 animate-fade-in">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-green-300 font-medium">🐙 Fuzzy Result</h3>
                <button
                  onClick={() => setResult(null)}
                  className="text-white/50 hover:text-white"
                  aria-label="Close result"
                >
                  ✕
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-white mb-3">{result.result}</p>
                <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-white/10">
                  {result.strategies_used && result.strategies_used.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-300">Strategies:</span>
                      <div className="flex flex-wrap gap-1">
                        {result.strategies_used.map((strategy, i) => (
                          <span key={i} className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded">
                            {strategy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.confidence !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-purple-300">Confidence:</span>
                      <span className="font-medium">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            {health?.tentacles || '🐙 8 strategies ready'} • 
            Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
}
