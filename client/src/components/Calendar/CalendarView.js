import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTasks } from '../../context/TaskContext';
import { getCategoryColor, getPriorityColor } from '../../utils/helpers';

export default function CalendarView() {
  const { tasks, fetchTasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTasksForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return [];
    const date = new Date(year, month, day);
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const td = new Date(t.dueDate);
      return td.getDate() === day && td.getMonth() === month && td.getFullYear() === year;
    });
  };

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push({ day: prevMonthDays - startDay + i + 1, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false });
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-container">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>View your tasks by month</p>
      </div>

      <div className="calendar-header">
        <h2>{monthName}</h2>
        <div className="calendar-nav">
          <button onClick={prevMonth}><FiChevronLeft size={18} /></button>
          <button onClick={() => setCurrentDate(new Date())}>Today</button>
          <button onClick={nextMonth}><FiChevronRight size={18} /></button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-day-header">{d}</div>
        ))}
        {days.map((d, i) => {
          const dayTasks = d.current ? getTasksForDay(d.day, true) : [];
          const isToday = d.current && d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`calendar-day ${d.current ? '' : 'other-month'} ${isToday ? 'today' : ''}`}>
              <div className="day-number">{d.day}</div>
              {dayTasks.slice(0, 3).map(t => (
                <div key={t._id} className="calendar-task" style={{ background: getCategoryColor(t.category) }}>
                  {t.title}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '2px 6px' }}>
                  +{dayTasks.length - 3} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
