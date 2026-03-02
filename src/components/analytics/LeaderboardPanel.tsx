import React, { useEffect, useState, useCallback } from 'react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  highScore: number;
  level: number;
  gamesPlayed: number;
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const LeaderboardPanel: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch10 = useCallback(async () => {
    try {
      const res = await fetch('/api/seaquest/leaderboard?limit=10');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setEntries(json.data?.entries || []);
      setTotal(json.data?.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch10();
    const id = setInterval(fetch10, 60_000);
    return () => clearInterval(id);
  }, [fetch10]);

  if (loading) return <div style={{ padding: 24, color: '#aaa' }}>Loading leaderboard...</div>;
  if (error) return <div style={{ padding: 24, color: '#ef5350' }}>Error: {error}</div>;

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 16px', color: '#ffd54f', fontSize: 18 }}>
        Sea-Quest Leaderboard
        <span style={{ marginLeft: 12, fontSize: 13, color: '#888', fontWeight: 400 }}>
          {total} players
        </span>
      </h2>

      {entries.length === 0 ? (
        <p style={{ color: '#888' }}>No players yet — be the first to dive in! 🌊</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ color: '#888', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px' }}>#</th>
              <th style={{ padding: '6px 8px' }}>Player</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>High Score</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Level</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Games</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr
                key={e.userId}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  color: e.rank <= 3 ? '#ffd54f' : '#ccc'
                }}
              >
                <td style={{ padding: '8px 8px' }}>{MEDAL[e.rank] || e.rank}</td>
                <td style={{ padding: '8px 8px' }}>
                  <span style={{ marginRight: 6 }}>{e.avatar}</span>{e.name}
                </td>
                <td style={{ padding: '8px 8px', textAlign: 'right', fontWeight: 700 }}>
                  {e.highScore.toLocaleString()}
                </td>
                <td style={{ padding: '8px 8px', textAlign: 'right' }}>Lv {e.level}</td>
                <td style={{ padding: '8px 8px', textAlign: 'right', color: '#888' }}>
                  {e.gamesPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default LeaderboardPanel;
