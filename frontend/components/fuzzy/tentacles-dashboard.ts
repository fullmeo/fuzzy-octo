'use client';

import { useState, useEffect } from 'react';
import { FuzzyAPI, HealthResponse, StrategiesResponse } from '@/lib/services/fuzzyAPI';

export default function TentaclesDashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [strategies, setStrategies] = useState<StrategiesResponse | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load health and strategies on mount
  useEffect(() => {
    if (mounted) {
      loadHealthData();
      loadStrategies();
    }
  }, [mounted]);

  const loadHealthData = async () => {
    try {
      const healthData = await FuzzyAPI.getHealth();
      setHealth(healthData);
    } catch (error) {
      console.error('Failed to load health:', error);
    }
  };

  const loadStrategies = async () => {
    try {
      const strategiesData = await FuzzyAPI.getStrategies();
      setStrategies(strategiesData);
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const queryResult = await FuzzyAPI.queryFuzzy(query);
      setResult(queryResult);
    } catch (error) {
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">🐙 Loading Fuzzy-Octo...</div>
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

        {/* Health Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">🏥 System Health</h2>
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
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              placeholder="Ask the 8 tentacles anything..."
              className="flex-1 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleQuery}
              disabled={loading || !query.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-all"
            >
              {loading ? '🐙 Thinking...' : '🚀 Query'}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white/5 rounded-lg p-4 border border-green-300/30">
              <h3 className="text-green-300 font-medium mb-2">🐙 Fuzzy Result:</h3>
              <p className="text-white mb-2">{result.result}</p>
              {result.strategies_used && (
                <p className="text-blue-300 text-sm">
                  Strategies used: {result.strategies_used.join(' ')}
                </p>
              )}
              {result.confidence && (
                <p className="text-purple-300 text-sm">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              )}
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