import React from 'react';
import { FiPlay, FiPause, FiRefreshCw, FiTarget, FiClock, FiAward, FiZap } from 'react-icons/fi';
import { usePomodoro } from '../../hooks/usePomodoro';

export default function FocusMode() {
  const timer = usePomodoro(25);

  const displayTime = `${timer.minutes.toString().padStart(2, '0')}:${timer.seconds.toString().padStart(2, '0')}`;
  const circumference = 2 * Math.PI * 130;
  const offset = circumference - (timer.progress / 100) * circumference;

  const modeLabels = {
    focus: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };

  return (
    <div className="focus-page">
      <div className="page-header" style={{ textAlign: 'center', width: '100%' }}>
        <h1>Focus Mode</h1>
        <p>Stay in the zone with the Pomodoro Technique</p>
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5bc0a0" />
            <stop offset="100%" stopColor="#f2aec0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="focus-container">
        <div className="focus-modes">
          {['focus', 'shortBreak', 'longBreak'].map(mode => (
            <button key={mode} className={`focus-mode-btn ${timer.mode === mode ? 'active' : ''}`}
              onClick={() => timer.switchMode(mode)}>
              {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        <div className="focus-timer">
          <svg width="320" height="320" viewBox="0 0 300 300">
            <circle className="timer-bg" cx="150" cy="150" r="130" />
            <circle className="timer-progress" cx="150" cy="150" r="130"
              strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <div className="timer-center">
            <div className="timer-display">{displayTime}</div>
            <div className="timer-label">{modeLabels[timer.mode]}</div>
          </div>
        </div>

        <div className="focus-controls">
          <button className="focus-btn-secondary" onClick={timer.reset}>
            <FiRefreshCw size={20} />
          </button>
          <button className="focus-btn-primary" onClick={timer.toggle}>
            {timer.isActive ? <FiPause size={28} /> : <FiPlay size={28} />}
          </button>
          <button className="focus-btn-secondary" onClick={() => {
            const m = prompt('Set minutes:', timer.minutes);
            if (m && !isNaN(m)) timer.setMinutes(parseInt(m));
          }}>
            <FiClock size={20} />
          </button>
        </div>

        <div className="focus-stats">
          <div className="focus-stat">
            <div className="focus-stat-value"><FiTarget size={18} style={{ color: 'var(--accent)' }} /></div>
            <div className="focus-stat-label">{timer.sessions} sessions</div>
          </div>
          <div className="focus-stat">
            <div className="focus-stat-value"><FiClock size={18} style={{ color: '#22c55e' }} /></div>
            <div className="focus-stat-label">{timer.totalMinutes} min</div>
          </div>
          <div className="focus-stat">
            <div className="focus-stat-value"><FiAward size={18} style={{ color: '#f59e0b' }} /></div>
            <div className="focus-stat-label">{Math.floor(timer.sessions / 4)} cycles</div>
          </div>
        </div>
      </div>
    </div>
  );
}
