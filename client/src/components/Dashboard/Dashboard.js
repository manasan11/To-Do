import React, { useEffect, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiClock, FiTrendingUp, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { analyticsAPI } from '../../utils/api';
import ProductivityScore from './ProductivityScore';
import { getCategoryColor } from '../../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, w, t] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getWeekly(),
          analyticsAPI.getTrend()
        ]);
        setStats(s.data);
        setWeeklyData(w.data);
        setTrendData(t.data);
      } catch { /* handled */ }
      finally { setLoading(false) }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" /></div>;

  const statCards = [
    { icon: <FiCheckCircle />, label: 'Total Tasks', value: stats?.total || 0, color: '#5bc0a0', bg: 'rgba(91,192,160,0.12)' },
    { icon: <FiZap />, label: 'Completed', value: stats?.completed || 0, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { icon: <FiClock />, label: 'In Progress', value: stats?.inProgress || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { icon: <FiTrendingUp />, label: 'Productivity', value: `${stats?.productivityScore || 0}%`, color: '#f2aec0', bg: 'rgba(242,174,192,0.15)' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your productivity overview at a glance</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
              {card.label === 'Completed' && <div className="stat-change" style={{ color: 'var(--text-muted)' }}>{stats?.todayCompleted || 0} done today</div>}
              {card.label === 'Productivity' && <div className="stat-change" style={{ color: '#22c55e' }}>🔥 {stats?.streak || 0} day streak</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <ProductivityScore score={stats?.productivityScore || 0} streak={stats?.streak || 0} longestStreak={stats?.longestStreak || 0} totalCompleted={stats?.completed || 0} />
          
          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">Weekly Completion</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">30-Day Productivity Trend</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickFormatter={v => v?.slice(5) || ''} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="count" stroke="var(--accent)" fill="url(#trendGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">Quick Stats</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Overdue Tasks', value: stats?.overdue || 0, color: '#ef4444' },
                { label: 'Upcoming (7d)', value: stats?.upcoming || 0, color: '#22c55e' },
                { label: 'Month Completed', value: stats?.monthCompleted || 0, color: '#3b82f6' },
                { label: 'Longest Streak', value: `${stats?.longestStreak || 0} days`, color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'New Task', path: '/tasks', icon: '📝' },
                { label: 'Focus Mode', path: '/focus', icon: '🎯' },
                { label: 'Log Mood', path: '/mood', icon: '😊' },
                { label: 'AI Breakdown', path: '/ai-breakdown', icon: '🤖' },
              ].map((a, i) => (
                <button key={i} className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: 12 }} onClick={() => navigate(a.path)}>
                  <span>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
