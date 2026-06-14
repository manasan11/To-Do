import React, { useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { useTasks } from '../../context/TaskContext';
import { formatTime, getCategoryColor, getPriorityColor } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function DayView() {
  const { tasks, fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= today && d < tomorrow;
  });

  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  const getTasksForHour = (hour) => {
    return todayTasks.filter(t => {
      if (!t.dueDate) return false;
      const h = new Date(t.dueDate).getHours();
      return h === hour;
    });
  };

  return (
    <div className="day-view">
      <div className="page-header">
        <h1>Day View</h1>
        <p>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/week')}>Week View</button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/calendar')}>Month View</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(123,196,168,0.12)', color: 'var(--accent)' }}><FiClock /></div>
          <div className="stat-info">
            <div className="stat-label">Today's Tasks</div>
            <div className="stat-value">{todayTasks.filter(t => t.status !== 'completed').length} active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>✓</div>
          <div className="stat-info">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{todayTasks.filter(t => t.status === 'completed').length}</div>
          </div>
        </div>
      </div>

      {hours.map(hour => {
        const hourTasks = getTasksForHour(hour);
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        return (
          <div key={hour} className="time-slot">
            <div className="time">{timeStr}</div>
            <div className="slot-content">
              {hourTasks.map(t => (
                <div key={t._id} className="task-card" style={{ marginBottom: 4 }}>
                  <div className={`task-checkbox ${t.status === 'completed' ? 'checked' : ''}`} style={{ marginTop: 0 }} />
                  <div className="task-content">
                    <div className="task-title" style={{ fontSize: '0.85rem' }}>{t.title}</div>
                    <div className="task-meta">
                      <span className="task-badge priority" style={{ color: getPriorityColor(t.priority), background: `${getPriorityColor(t.priority)}15` }}>{t.priority}</span>
                      <span className="task-badge category" style={{ background: `${getCategoryColor(t.category)}15`, color: getCategoryColor(t.category) }}>{t.category}</span>
                      {t.dueDate && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatTime(t.dueDate)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
