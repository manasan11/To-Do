import React, { useState } from 'react';
import { FiCpu, FiZap, FiCheck } from 'react-icons/fi';
import { aiAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AITaskBreakdown() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleBreakdown = async () => {
    if (!title.trim()) return toast.error('Please enter a task title');
    setLoading(true);
    try {
      const { data } = await aiAPI.breakdown({ title, description, category });
      setResult(data);
      toast.success(data.message);
    } catch { /* handled */ }
    finally { setLoading(false) }
  };

  const handleSuggest = async (context) => {
    setLoading(true);
    try {
      const { data } = await aiAPI.suggest({ context });
      if (data.suggestions?.length) {
        toast.success(`${data.suggestions.length} suggestions generated!`);
        setResult({ suggestions: data.suggestions });
      }
    } catch { /* handled */ }
    finally { setLoading(false) }
  };

  return (
    <div className="ai-page">
      <div className="page-header">
        <h1>AI Task Breakdown</h1>
        <p>Convert large goals into smaller actionable subtasks</p>
      </div>

      <div className="ai-input-card">
        <h2><FiCpu size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} /> AI-Powered Breakdown</h2>
        <p>Describe your task or goal and let AI break it down into manageable steps</p>
        <div className="form-group">
          <input className="form-input" style={{ background: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: 12 }}
            placeholder="Enter your task title (e.g., Build a portfolio website)"
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <textarea className="form-textarea" style={{ background: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.2)', color: 'white', minHeight: 80 }}
            placeholder="Add more context or details (optional)"
            value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
          <select className="form-select" style={{ background: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.2)', color: 'white', width: 'auto' }}
            value={category} onChange={e => setCategory(e.target.value)}>
            {['work', 'personal', 'health', 'education', 'finance', 'social', 'shopping', 'other'].map(c => (
              <option key={c} value={c} style={{ color: '#000' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <button className="btn" style={{ background: 'white', color: 'var(--accent)' }} onClick={handleBreakdown} disabled={loading}>
            <FiZap size={16} /> {loading ? 'Breaking Down...' : 'Break Down Task'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => handleSuggest('morning')} disabled={loading}>
          ☀️ Morning Suggestions
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => handleSuggest('afternoon')} disabled={loading}>
          🌤️ Afternoon Suggestions
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => handleSuggest('evening')} disabled={loading}>
          🌙 Evening Suggestions
        </button>
      </div>

      {result && (
        <>
          {result.parentTask?.subtasks?.length > 0 && (
            <div className="card" style={{ marginBottom: 24, animation: 'fadeIn 0.4s ease' }}>
              <div className="card-header">
                <div className="card-title">📋 {result.parentTask.title}</div>
              </div>
              <div className="subtask-list">
                {result.parentTask.subtasks.map((s, i) => (
                  <div key={i} className="subtask-item">
                    <div className="subtask-num">{i + 1}</div>
                    <div className="subtask-text">{s.title}</div>
                    <FiCheck size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div className="card" style={{ animation: 'fadeIn 0.4s ease' }}>
              <div className="card-header">
                <div className="card-title">💡 Suggested Tasks</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.suggestions.map((s, i) => (
                  <div key={i} className="subtask-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="subtask-num" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>✓</div>
                    <div className="subtask-text">{s.title}</div>
                    <span className="task-badge category" style={{ marginLeft: 'auto' }}>{s.category}</span>
                    <span className="task-badge priority" style={{ color: s.priority === 'high' ? '#f97316' : s.priority === 'medium' ? '#eab308' : '#22c55e', background: 'transparent' }}>{s.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!result && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>Ready to break down some tasks?</h3>
          <p>Enter a task above and let AI create a step-by-step plan for you</p>
        </div>
      )}
    </div>
  );
}
