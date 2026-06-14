import React, { useEffect, useState } from 'react';
import { FiLock, FiAward, FiStar } from 'react-icons/fi';
import { achievementAPI } from '../../utils/api';

const tierColors = {
  bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700',
  platinum: '#e5e4e2', diamond: '#b9f2ff'
};

export default function AchievementList() {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ earned: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await achievementAPI.getAll();
        await achievementAPI.check();
        setAchievements(data);
        setStats({ earned: data.filter(a => a.earned).length, total: data.length });
      } catch { /* handled */ }
      finally { setLoading(false) }
    };
    fetch();
  }, []);

  const earned = achievements.filter(a => a.earned);
  const locked = achievements.filter(a => !a.earned);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div className="achievement-page">
      <div className="page-header">
        <h1>Achievements</h1>
        <p>Earn badges and track your milestones</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(123,196,168,0.12)', color: 'var(--accent)' }}><FiAward /></div>
          <div className="stat-info">
            <div className="stat-label">Earned</div>
            <div className="stat-value">{stats.earned}/{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}><FiStar /></div>
          <div className="stat-info">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0}%</div>
          </div>
        </div>
      </div>

      {earned.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, marginTop: 8 }}>🏆 Earned</h2>
          <div className="achievement-grid" style={{ marginBottom: 32 }}>
            {earned.map(a => (
              <div key={a._id} className={`achievement-card earned`}>
                <div className="achievement-icon">{a.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">{a.name}</div>
                  <div className="achievement-desc">{a.description}</div>
                  <div className="achievement-points">+{a.points} pts</div>
                </div>
                <div className="achievement-badge" style={{ background: tierColors[a.tier] || 'var(--accent)' }}>
                  {a.tier === 'diamond' ? '💎' : a.tier === 'platinum' ? '⭐' : a.tier === 'gold' ? '🥇' : a.tier === 'silver' ? '🥈' : '🥉'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>🔒 Locked</h2>
      <div className="achievement-grid">
        {locked.map(a => (
          <div key={a._id} className="achievement-card">
            <div className="achievement-icon">{a.icon}</div>
            <div className="achievement-info">
              <div className="achievement-name">{a.name}</div>
              <div className="achievement-desc">{a.description}</div>
              <div className="achievement-points">+{a.points} pts</div>
            </div>
            <div className="achievement-badge locked"><FiLock size={14} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
