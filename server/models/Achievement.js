const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['tasks', 'streaks', 'focus', 'speed', 'milestone', 'special'],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['tasks_completed', 'streak_days', 'focus_minutes', 'pomodoro_sessions', 'tasks_daily', 'early_bird', 'night_owl', 'categories_mastered', 'tasks_urgent', 'streak_weekly'],
      required: true
    },
    value: { type: Number, required: true }
  },
  points: {
    type: Number,
    default: 10
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achievement', achievementSchema);
