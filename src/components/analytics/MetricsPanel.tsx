import React, { useEffect, useState, useCallback } from 'react';

interface Metrics {
  totalProcessed: number;
  avgComplexity: number;
  avgClarity: number;
  aiStats: {
    anthropicCalls: number;
    openaiCalls: number;
    fallbackCalls: number;
    errors: number;
    total: number;
    primaryProvider: string;
    anthropicAvailable: boolean;
    openaiAvailable: boolean;
  };
  learningStats: {
    totalQueries: number;
    topPatterns: Array<{ pattern: string; count: number }>;
  };
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub, color = '#4fc3f7' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${color}33`,
    borderRadius: 12,
    padding: '16px 20px',
    minWidth: 140
  }}>
    <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{sub}</div>}
  </div>
);

const MetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/metrics');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMetrics(json.data || json);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div style={{ padding: 24, color: '#aaa', textAlign: 'center' }}>
        Loading metrics...
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div style={{ padding: 24, color: '#ef5350', textAlign: 'center' }}>
        Failed to load metrics: {error}
        <br />
        <button onClick={fetchMetrics} style={{ marginTop: 8, cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  const { aiStats, learningStats } = metrics;
  const successRate = aiStats.total > 0
    ? (((aiStats.total - aiStats.errors) / aiStats.total) * 100).toFixed(1)
    : '—';

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 20px', color: '#4fc3f7', fontSize: 18 }}>
        Analytics — Magnus 13.2 Engine
      </h2>

      {/* Primary metrics */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <MetricCard label="Total Queries" value={metrics.totalProcessed} color="#4fc3f7" />
        <MetricCard
          label="Avg Complexity"
          value={`${metrics.avgComplexity.toFixed(0)}%`}
          color="#ba68c8"
        />
        <MetricCard
          label="Avg Clarity"
          value={`${metrics.avgClarity.toFixed(0)}%`}
          color="#81c784"
        />
        <MetricCard
          label="Success Rate"
          value={`${successRate}%`}
          sub={`${aiStats.errors} errors`}
          color="#ffb74d"
        />
      </div>

      {/* Provider breakdown */}
      <h3 style={{ color: '#aaa', fontSize: 14, marginBottom: 12 }}>Provider Breakdown</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <MetricCard
          label="Anthropic"
          value={aiStats.anthropicCalls}
          sub={aiStats.anthropicAvailable ? 'active' : 'unavailable'}
          color={aiStats.anthropicAvailable ? '#81c784' : '#ef5350'}
        />
        <MetricCard
          label="OpenAI"
          value={aiStats.openaiCalls}
          sub={aiStats.openaiAvailable ? 'active' : 'unavailable'}
          color={aiStats.openaiAvailable ? '#4fc3f7' : '#ef5350'}
        />
        <MetricCard label="Fallback" value={aiStats.fallbackCalls} color="#ffb74d" />
      </div>

      {/* Top patterns */}
      {learningStats.topPatterns.length > 0 && (
        <>
          <h3 style={{ color: '#aaa', fontSize: 14, marginBottom: 12 }}>Top Query Patterns</h3>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            {learningStats.topPatterns.map(({ pattern, count }) => (
              <div key={pattern} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#ccc' }}>{pattern}</span>
                <span style={{ color: '#4fc3f7', fontWeight: 600 }}>{count}x</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default MetricsPanel;
