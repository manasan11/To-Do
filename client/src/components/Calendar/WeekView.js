import React, { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { getCategoryColor, getPriorityColor, truncate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function WeekView() {
  const { tasks, fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const getTasksForDay = (date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= dayStart && d < dayEnd;
    });
  };

  return (
    <div className="week-view">
      <div className="page-header">
        <h1>Week View</h1>
        <p>{weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/day')}>Day View</button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/calendar')}>Month View</button>
      </div>

      <div className="week-grid">
        {weekDays.map((day, i) => {
          const dayTasks = getTasksForDay(day);
          const isToday = day.toDateString() === today.toDateString();
          return (
            <div key={i} className={`week-day ${isToday ? 'today' : ''}`}>
              <div className="week-day-header">
                <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="day-num">{day.getDate()}</div>
              </div>
              {dayTasks.slice(0, 5).map(t => (
                <div key={t._id} className="calendar-task" style={{ background: getCategoryColor(t.category), marginBottom: 4, fontSize: '0.75rem', padding: '3px 6px' }}>
                  {truncate(t.title, 20)}
                </div>
              ))}
              {dayTasks.length > 5 && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                  +{dayTasks.length - 5} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
