const Task = require('../models/Task');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tasks = await Task.find({ user: req.user._id });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;

    const todayCompleted = tasks.filter(t =>
      t.status === 'completed' && t.completedAt && new Date(t.completedAt) >= today
    ).length;

    const weekCompleted = tasks.filter(t =>
      t.status === 'completed' && t.completedAt && new Date(t.completedAt) >= weekStart
    ).length;

    const monthCompleted = tasks.filter(t =>
      t.status === 'completed' && t.completedAt && new Date(t.completedAt) >= monthStart
    ).length;

    const overdue = tasks.filter(t =>
      t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < today
    ).length;

    const upcoming = tasks.filter(t =>
      t.status !== 'completed' && t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;

    const byPriority = {
      urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
      high: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
      medium: tasks.filter(t => t.priority === 'medium' && t.status !== 'completed').length,
      low: tasks.filter(t => t.priority === 'low' && t.status !== 'completed').length
    };

    const byCategory = {};
    tasks.filter(t => t.status !== 'archived').forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });

    const todayData = {
      completed: todayCompleted,
      total: tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d >= today && d < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      }).length
    };

    const productivityScore = calculateProductivityScore(user, completed, todayCompleted, total);
    user.stats.productivityScore = productivityScore;
    await user.save();

    res.json({
      total,
      completed,
      inProgress,
      todo,
      todayCompleted,
      weekCompleted,
      monthCompleted,
      overdue,
      upcoming,
      byPriority,
      byCategory,
      todayData,
      productivityScore,
      streak: user.stats.currentStreak,
      longestStreak: user.stats.longestStreak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeeklyData = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id, status: 'completed' });
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const count = tasks.filter(t =>
        t.completedAt && new Date(t.completedAt) >= dayStart && new Date(t.completedAt) < dayEnd
      ).length;

      weekData.push({
        date: day.toISOString().split('T')[0],
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }

    res.json(weekData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyData = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    const targetMonth = parseInt(month) || new Date().getMonth();

    const tasks = await Task.find({ user: req.user._id, status: 'completed' });
    const monthData = [];

    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(targetYear, targetMonth, day);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const count = tasks.filter(t =>
        t.completedAt && new Date(t.completedAt) >= dayStart && new Date(t.completedAt) < dayEnd
      ).length;

      monthData.push({ date: day, count });
    }

    res.json(monthData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id, status: 'completed' });
    const categoryData = {};

    tasks.forEach(t => {
      categoryData[t.category] = (categoryData[t.category] || 0) + 1;
    });

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductivityTrend = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id, status: 'completed' });
    const today = new Date();
    const trend = [];

    for (let i = 29; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const count = tasks.filter(t =>
        t.completedAt && new Date(t.completedAt) >= dayStart && new Date(t.completedAt) < dayEnd
      ).length;

      trend.push({
        date: day.toISOString().split('T')[0],
        count
      });
    }

    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateProductivityScore(user, totalCompleted, todayCompleted, totalTasks) {
  const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 40 : 0;
  const streakBonus = Math.min(user.stats.currentStreak * 5, 30);
  const todayBonus = Math.min(todayCompleted * 5, 20);
  const consistencyBonus = Math.min(user.stats.longestStreak * 2, 10);

  return Math.round(Math.min(completionRate + streakBonus + todayBonus + consistencyBonus, 100));
}
