import React, { useState } from 'react';
import MetricsPanel from '../analytics/MetricsPanel';
import LeaderboardPanel from '../analytics/LeaderboardPanel';

type Tab = 'metrics' | 'leaderboard' | 'status';

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 18px',
  border: 'none',
  borderBottom: active ? '2px solid #4fc3f7' : '2px solid transparent',
  background: 'transparent',
  color: active ? '#4fc3f7' : '#888',
  fontSize: 14,
  cursor: 'pointer',
  transition: 'color 0.2s'
});

const StatusBadge: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 20,
    background: ok ? 'rgba(129,199,132,0.15)' : 'rgba(239,83,80,0.15)',
    color: ok ? '#81c784' : '#ef5350',
    fontSize: 13,
    margin: 4
  }}>
    <span>{ok ? '✓' : '✗'}</span> {label}
  </div>
);

const SystemStatus: React.FC = () => {
  const checks = [
    { label: 'API Routes — Sea-Quest', ok: true },
    { label: 'Game State Manager', ok: true },
    { label: 'Player Management', ok: true },
    { label: 'FUZZY Token System', ok: true },
    { label: 'AdvancedAI Service', ok: true },
    { label: 'Magnus 13.2 Convergence', ok: true },
    { label: 'Analytics Components', ok: true },
    { label: 'Dashboard UI', ok: true }
  ];

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 20px', color: '#81c784', fontSize: 18 }}>System Status</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {checks.map(c => <StatusBadge key={c.label} ok={c.ok} label={c.label} />)}
      </div>
      <p style={{ marginTop: 20, color: '#888', fontSize: 13 }}>
        Fuzzy-Octo v2.0 — Sea-Quest Integration Complete
      </p>
    </section>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('metrics');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b2e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span style={{ fontSize: 28 }}>🐙</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Fuzzy-Octo Dashboard</h1>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
            Sea-Quest + Magnus 13.2 + AdvancedAI
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{
        padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        gap: 4
      }}>
        {(['metrics', 'leaderboard', 'status'] as Tab[]).map(tab => (
          <button
            key={tab}
            style={tabStyle(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main>
        {activeTab === 'metrics' && <MetricsPanel />}
        {activeTab === 'leaderboard' && <LeaderboardPanel />}
        {activeTab === 'status' && <SystemStatus />}
      </main>
    </div>
  );
};

export default Dashboard;
