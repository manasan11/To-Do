import React, { useState, useEffect } from 'react';
import { FiSend, FiBarChart2 } from 'react-icons/fi';
import { moodAPI } from '../../utils/api';
import { useTasks } from '../../context/TaskContext';
import { getMoodEmoji, getMoodLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const moods = [
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'stressed', emoji: '😰', label: 'Stressed' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'focused', emoji: '🎯', label: 'Focused' },
  { id: 'creative', emoji: '💡', label: 'Creative' },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [note, setNote] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { tasks } = useTasks();

  useEffect(() => {
    moodAPI.getHistory(7).then(r => setHistory(r.data)).catch(() => {});
  }, []);

  const handleLogMood = async () => {
    if (!selectedMood) return toast.error('Please select a mood');
    setLoading(true);
    try {
      await moodAPI.log({ mood: selectedMood, energyLevel, note });
      toast.success('Mood logged!');
      const res = await moodAPI.getSuggestions({ mood: selectedMood, energyLevel });
      setSuggestions(res.data);
      const hist = await moodAPI.getHistory(7);
      setHistory(hist.data);
    } catch { /* handled */ }
    finally { setLoading(false) }
  };

  return (
    <div className="mood-page">
      <div className="page-header">
        <h1>Mood Tracker</h1>
        <p>Log your mood and get personalized task suggestions</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(123,196,168,0.12)', color: 'var(--accent)' }}>😊</div>
          <div className="stat-info">
            <div className="stat-label">Today's Mood</div>
            <div className="stat-value">{selectedMood ? getMoodEmoji(selectedMood) + ' ' + getMoodLabel(selectedMood) : 'Not set'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}><FiBarChart2 /></div>
          <div className="stat-info">
            <div className="stat-label">Energy Level</div>
            <div className="stat-value">{energyLevel}/10</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>📊</div>
          <div className="stat-info">
            <div className="stat-label">Logged Days</div>
            <div className="stat-value">{history.length}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><div className="card-title">How are you feeling?</div></div>
        <div className="mood-grid">
          {moods.map(m => (
            <div key={m.id} className={`mood-card ${selectedMood === m.id ? 'selected' : ''}`}
              onClick={() => setSelectedMood(m.id)}>
              <div className="mood-emoji">{m.emoji}</div>
              <div className="mood-name">{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Energy Level: {energyLevel}</label>
          <input type="range" min={1} max={10} value={energyLevel}
            onChange={e => setEnergyLevel(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Low</span><span>High</span>
          </div>
        </div>
        <div className="form-group">
          <textarea className="form-textarea" placeholder="Add a note (optional)..."
            value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleLogMood} disabled={loading}>
          <FiSend size={16} /> {loading ? 'Logging...' : 'Log Mood & Get Suggestions'}
        </button>
      </div>

      {suggestions && (
        <div className="card" style={{ marginBottom: 24, animation: 'fadeIn 0.4s ease' }}>
          <div className="card-header"><div className="card-title">💡 {suggestions.encouragement}</div></div>
          {suggestions.suggestions?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestions.suggestions.map(t => (
                <div key={t._id} className="task-card" style={{ margin: 0, cursor: 'default' }}>
                  <div className={`task-checkbox ${t.status === 'completed' ? 'checked' : ''}`} />
                  <div className="task-content">
                    <div className="task-title" style={{ fontSize: '0.85rem' }}>{t.title}</div>
                    <div className="task-meta">
                      <span className="task-badge category">{t.category}</span>
                      {t.dueDate && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(t.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No matching tasks found. Try creating some tasks first!</p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Mood History</div></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {history.map(h => (
              <div key={h._id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                <span>{getMoodEmoji(h.mood)}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span style={{ color: 'var(--text-muted)' }}>⚡{h.energyLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
