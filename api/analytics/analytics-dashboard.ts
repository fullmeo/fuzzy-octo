'use client';

import { useState, useEffect } from 'react';
import { FuzzyAPI } from '@/lib/services/fuzzyAPI';

interface AnalyticsData {
  tentacleUsage: { [key: string]: number };
  responseTimeMs: number;
  totalQueries: number;
  successRate: number;
  topStrategies: string[];
  realTimeMetrics: {
    activeUsers: number;
    queriesPerMinute: number;
    avgConfidence: number;
  };
  gameMetrics: {
    activePlayers: number;
    totalGames: number;
    tokenCirculation: number;
    topPlayer: string;
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    loadAnalytics();
    
    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      if (isLive) {
        loadAnalytics();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const loadAnalytics = async () => {
    try {
      // Simulate analytics data (replace with real API calls)
      const data: AnalyticsData = {
        tentacleUsage: {
          '🎯': 45,
          '🔍': 38,
          '🚀': 62,
          '🎨': 29,
          '⚡': 71,
          '🧠': 33,
          '💡': 41,
          '🐙': 18
        },
        responseTimeMs: 234,
        totalQueries: 1847,
        successRate: 94.2,
        topStrategies: ['⚡ Quick Response', '🚀 Innovation Mode', '🎯 Focused Analysis'],
        realTimeMetrics: {
          activeUsers: 23,
          queriesPerMinute: 8.4,
          avgConfidence: 0.87
        },
        gameMetrics: {
          activePlayers: 156,
          totalGames: 2341,
          tokenCirculation: 485720,
          topPlayer: 'SeaExplorer_42'
        }
      };
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const getTentacleColor = (tentacle: string) => {
    const colors: { [key: string]: string } = {
      '🎯': 'bg-blue-500',
      '🔍': 'bg-green-500',
      '🚀': 'bg-purple-500',
      '🎨': 'bg-pink-500',
      '⚡': 'bg-yellow-500',
      '🧠': 'bg-indigo-500',
      '💡': 'bg-orange-500',
      '🐙': 'bg-red-500'
    };
    return colors[tentacle] || 'bg-gray-500';
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">📊 Loading Analytics...</div>
      </div>
    );
  }

  const maxUsage = Math.max(...Object.values(analytics.tentacleUsage));

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            📊 Fuzzy-Octo Analytics
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isLive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isLive ? '🔴 Live' : '⏸️ Paused'}
            </button>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Active Users</div>
            <div className="text-3xl font-bold text-green-400">
              {analytics.realTimeMetrics.activeUsers}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Queries/Min</div>
            <div className="text-3xl font-bold text-blue-400">
              {analytics.realTimeMetrics.queriesPerMinute}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Avg Confidence</div>
            <div className="text-3xl font-bold text-purple-400">
              {(analytics.realTimeMetrics.avgConfidence * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Response Time</div>
            <div className="text-3xl font-bold text-orange-400">
              {analytics.responseTimeMs}ms
            </div>
          </div>
        </div>

        {/* Tentacle Usage Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            🐙 Tentacle Usage Distribution
          </h2>
          <div className="space-y-4">
            {Object.entries(analytics.tentacleUsage).map(([tentacle, usage]) => (
              <div key={tentacle} className="flex items-center gap-4">
                <div className="w-8 text-center">{tentacle}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Strategy {tentacle}</span>
                    <span>{usage} uses</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getTentacleColor(tentacle)} transition-all duration-500`}
                      style={{ width: `${(usage / maxUsage) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Metrics & System Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sea-Quest Game Metrics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              🎮 Sea-Quest Metrics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Players</span>
                <span className="text-white font-medium">{analytics.gameMetrics.activePlayers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Games</span>
                <span className="text-white font-medium">{analytics.gameMetrics.totalGames.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token Circulation</span>
                <span className="text-green-400 font-medium">{analytics.gameMetrics.tokenCirculation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Top Player</span>
                <span className="text-blue-400 font-medium">{analytics.gameMetrics.topPlayer}</span>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              ⚡ System Performance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Queries</span>
                <span className="text-white font-medium">{analytics.totalQueries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-green-400 font-medium">{analytics.successRate}%</span>
              </div>
              <div>
                <div className="text-gray-400 mb-2">Top Strategies</div>
                <div className="space-y-1">
                  {analytics.topStrategies.map((strategy, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      {index + 1}. {strategy}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleTimeString()} • 
            {isLive ? ' 🔴 Live monitoring active' : ' ⏸️ Monitoring paused'}
          </p>
        </div>
      </div>
    </div>
  );
}