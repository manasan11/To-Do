const Achievement = require('../models/Achievement');

const achievements = [
  // Tasks
  { name: 'First Steps', description: 'Complete your first task', icon: '🌱', category: 'tasks', criteria: { type: 'tasks_completed', value: 1 }, points: 10, tier: 'bronze' },
  { name: 'Getting Things Done', description: 'Complete 10 tasks', icon: '📋', category: 'tasks', criteria: { type: 'tasks_completed', value: 10 }, points: 25, tier: 'bronze' },
  { name: 'Productivity Apprentice', description: 'Complete 50 tasks', icon: '⚡', category: 'tasks', criteria: { type: 'tasks_completed', value: 50 }, points: 50, tier: 'silver' },
  { name: 'Task Master', description: 'Complete 100 tasks', icon: '🏆', category: 'tasks', criteria: { type: 'tasks_completed', value: 100 }, points: 100, tier: 'silver' },
  { name: 'Productivity Guru', description: 'Complete 500 tasks', icon: '🌟', category: 'tasks', criteria: { type: 'tasks_completed', value: 500 }, points: 200, tier: 'gold' },
  { name: 'Legendary Producer', description: 'Complete 1000 tasks', icon: '👑', category: 'tasks', criteria: { type: 'tasks_completed', value: 1000 }, points: 500, tier: 'platinum' },

  // Streaks
  { name: 'Getting Started', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streaks', criteria: { type: 'streak_days', value: 3 }, points: 15, tier: 'bronze' },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '💪', category: 'streaks', criteria: { type: 'streak_days', value: 7 }, points: 30, tier: 'bronze' },
  { name: 'Unstoppable', description: 'Maintain a 14-day streak', icon: '⚡', category: 'streaks', criteria: { type: 'streak_days', value: 14 }, points: 60, tier: 'silver' },
  { name: 'Monthly Momentum', description: 'Maintain a 30-day streak', icon: '📅', category: 'streaks', criteria: { type: 'streak_days', value: 30 }, points: 120, tier: 'gold' },
  { name: 'Quarterly Quest', description: 'Maintain a 90-day streak', icon: '🎯', category: 'streaks', criteria: { type: 'streak_days', value: 90 }, points: 300, tier: 'platinum' },
  { name: 'Year-Long Legend', description: 'Maintain a 365-day streak', icon: '💎', category: 'streaks', criteria: { type: 'streak_days', value: 365 }, points: 1000, tier: 'diamond' },

  // Focus
  { name: 'Deep Focus', description: 'Accumulate 60 focus minutes', icon: '🧘', category: 'focus', criteria: { type: 'focus_minutes', value: 60 }, points: 20, tier: 'bronze' },
  { name: 'Focused Mind', description: 'Accumulate 300 focus minutes', icon: '🎯', category: 'focus', criteria: { type: 'focus_minutes', value: 300 }, points: 50, tier: 'silver' },
  { name: 'Concentration King', description: 'Accumulate 1000 focus minutes', icon: '🧠', category: 'focus', criteria: { type: 'focus_minutes', value: 1000 }, points: 150, tier: 'gold' },
  { name: 'Zen Master', description: 'Complete 10 Pomodoro sessions', icon: '🍅', category: 'focus', criteria: { type: 'pomodoro_sessions', value: 10 }, points: 25, tier: 'bronze' },
  { name: 'Pomodoro Pro', description: 'Complete 50 Pomodoro sessions', icon: '⏰', category: 'focus', criteria: { type: 'pomodoro_sessions', value: 50 }, points: 75, tier: 'silver' },
  { name: 'Time Wizard', description: 'Complete 200 Pomodoro sessions', icon: '⚗️', category: 'focus', criteria: { type: 'pomodoro_sessions', value: 200 }, points: 250, tier: 'platinum' },

  // Daily
  { name: 'Daily Doer', description: 'Complete 3 tasks in a day', icon: '🌞', category: 'milestone', criteria: { type: 'tasks_daily', value: 3 }, points: 15, tier: 'bronze' },
  { name: 'Power Hour', description: 'Complete 5 tasks in a day', icon: '🚀', category: 'milestone', criteria: { type: 'tasks_daily', value: 5 }, points: 40, tier: 'silver' },
  { name: 'Superhuman Day', description: 'Complete 10 tasks in a day', icon: '💥', category: 'milestone', criteria: { type: 'tasks_daily', value: 10 }, points: 100, tier: 'gold' },

  // Categories
  { name: 'Well-Rounded', description: 'Complete tasks in 3 different categories', icon: '🎨', category: 'special', criteria: { type: 'categories_mastered', value: 3 }, points: 30, tier: 'bronze' },
  { name: 'Versatile', description: 'Complete tasks in 5 different categories', icon: '🌈', category: 'special', criteria: { type: 'categories_mastered', value: 5 }, points: 60, tier: 'silver' },
  { name: 'Renaissance Soul', description: 'Complete tasks in all categories', icon: '🌍', category: 'special', criteria: { type: 'categories_mastered', value: 8 }, points: 150, tier: 'gold' },

  // Weekly
  { name: 'Consistent', description: 'Maintain a 3-week streak', icon: '📊', category: 'streaks', criteria: { type: 'streak_weekly', value: 21 }, points: 80, tier: 'silver' },
  { name: 'Habit Hero', description: 'Maintain a 8-week streak', icon: '🦸', category: 'streaks', criteria: { type: 'streak_weekly', value: 56 }, points: 200, tier: 'gold' },
];

const seedAchievements = async () => {
  try {
    await Achievement.deleteMany({});
    await Achievement.insertMany(achievements);
    console.log(`${achievements.length} achievements seeded successfully`);
  } catch (error) {
    console.error('Error seeding achievements:', error.message);
  }
};

module.exports = { seedAchievements };
