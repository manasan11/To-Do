import React from 'react';
import { FiCalendar, FiAward, FiCheckCircle } from 'react-icons/fi';

export default function ProductivityScore({ score, streak, longestStreak, totalCompleted }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  const getScoreMessage = () => {
    if (score >= 90) return 'Exceptional! You are a productivity legend!';
    if (score >= 70) return 'Great job! Keep up the momentum!';
    if (score >= 50) return 'Good progress! Room to improve.';
    if (score >= 30) return 'Getting started. Small steps count!';
    return 'Start your productivity journey today!';
  };

  const getScoreEmoji = () => {
    if (score >= 90) return '🌟';
    if (score >= 70) return '🚀';
    if (score >= 50) return '📈';
    if (score >= 30) return '💪';
    return '🌱';
  };

  return (
    <div className="productivity-score">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7bc4a8" />
            <stop offset="100%" stopColor="#f2b5c5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="score-ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle className="score-bg" cx="50" cy="50" r="42" />
          <circle className="score-fill" cx="50" cy="50" r="42"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
        </svg>
        <div className="score-text">{getScoreEmoji()}</div>
      </div>
      <div className="score-info">
        <h3>Smart Productivity Score</h3>
        <p>{getScoreMessage()}</p>
        <div className="score-streak">
          <span><FiCalendar size={14} /> {streak} day streak</span>
          <span><FiAward size={14} /> Best: {longestStreak} days</span>
          <span><FiCheckCircle size={14} /> {totalCompleted} done</span>
        </div>
      </div>
    </div>
  );
}
