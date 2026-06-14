const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Task = require('../models/Task');

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ points: 1 });
    const user = await User.findById(req.user._id);

    const achievementsWithStatus = achievements.map(a => ({
      ...a.toObject(),
      earned: user.badges.some(b => b.badgeId && b.badgeId.toString() === a._id.toString()),
      earnedAt: user.badges.find(b => b.badgeId && b.badgeId.toString() === a._id.toString())?.earnedAt || null
    }));

    res.json(achievementsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const achievements = await Achievement.find();
    const tasks = await Task.find({ user: req.user._id });
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const newAchievements = [];

    for (const achievement of achievements) {
      if (user.badges.some(b => b.badgeId && b.badgeId.toString() === achievement._id.toString())) {
        continue;
      }

      let earned = false;

      switch (achievement.criteria.type) {
        case 'tasks_completed':
          earned = user.stats.totalTasksCompleted >= achievement.criteria.value;
          break;
        case 'streak_days':
          earned = user.stats.currentStreak >= achievement.criteria.value;
          break;
        case 'focus_minutes':
          earned = user.stats.totalFocusMinutes >= achievement.criteria.value;
          break;
        case 'pomodoro_sessions':
          earned = user.stats.pomodoroSessions >= achievement.criteria.value;
          break;
        case 'tasks_daily': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const todayTasks = completedTasks.filter(t =>
            t.completedAt && t.completedAt >= today && t.completedAt < tomorrow
          );
          earned = todayTasks.length >= achievement.criteria.value;
          break;
        }
        case 'categories_mastered': {
          const categories = new Set(tasks.filter(t => t.status === 'completed').map(t => t.category));
          earned = categories.size >= achievement.criteria.value;
          break;
        }
        case 'streak_weekly':
          earned = user.stats.currentStreak >= achievement.criteria.value;
          break;
        default:
          break;
      }

      if (earned) {
        user.badges.push({ badgeId: achievement._id, earnedAt: new Date() });
        newAchievements.push(achievement);
      }
    }

    if (newAchievements.length > 0) {
      await user.save();
    }

    res.json({ newAchievements, total: user.badges.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
