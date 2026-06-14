const Mood = require('../models/Mood');
const Task = require('../models/Task');

exports.logMood = async (req, res) => {
  try {
    const { mood, energyLevel, note } = req.body;
    const moodEntry = await Mood.create({
      user: req.user._id,
      mood,
      energyLevel,
      note
    });
    res.status(201).json(moodEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const { days } = req.query;
    const limit = parseInt(days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - limit);

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: since }
    }).sort({ date: -1 });

    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMoodSuggestions = async (req, res) => {
  try {
    const { mood, energyLevel } = req.query;

    const latestMood = mood;
    const latestEnergy = parseInt(energyLevel) || 5;

    let suggestedCategories = [];
    let suggestedPriorities = [];
    let suggestedMaxTasks = 5;

    if (latestEnergy >= 8) {
      suggestedCategories = ['work', 'education', 'finance'];
      suggestedPriorities = ['high', 'urgent'];
      suggestedMaxTasks = 7;
    } else if (latestEnergy >= 6) {
      suggestedCategories = ['work', 'personal', 'health'];
      suggestedPriorities = ['medium', 'high'];
      suggestedMaxTasks = 5;
    } else if (latestEnergy >= 4) {
      suggestedCategories = ['personal', 'health', 'social'];
      suggestedPriorities = ['low', 'medium'];
      suggestedMaxTasks = 3;
    } else {
      suggestedCategories = ['health', 'personal', 'social'];
      suggestedPriorities = ['low'];
      suggestedMaxTasks = 2;
    }

    if (['tired', 'sad', 'stressed'].includes(latestMood)) {
      suggestedCategories = ['health', 'personal', 'social'];
      suggestedPriorities = ['low'];
      suggestedMaxTasks = Math.min(suggestedMaxTasks, 3);
    }

    if (['creative', 'focused'].includes(latestMood)) {
      suggestedCategories = ['work', 'education', 'finance'];
      suggestedPriorities = ['high', 'urgent'];
    }

    const suggestions = await Task.find({
      user: req.user._id,
      status: 'todo',
      category: { $in: suggestedCategories },
      priority: { $in: suggestedPriorities }
    })
      .sort({ dueDate: 1, priority: -1 })
      .limit(suggestedMaxTasks);

    const encouragement = getEncouragement(latestMood, latestEnergy);

    res.json({
      suggestions,
      encouragement,
      energyLevel: latestEnergy,
      suggestedCategories,
      suggestedMaxTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function getEncouragement(mood, energy) {
  const messages = {
    energetic: 'High energy mode! Tackle your most challenging tasks now!',
    happy: 'Great mood! You will be super productive today!',
    neutral: 'Steady as she goes. Pick a task that feels right.',
    tired: 'Take it easy. Focus on small, meaningful tasks.',
    stressed: 'Breathe. Start with something simple and build momentum.',
    sad: 'Be kind to yourself. Small wins matter today.',
    focused: 'You are in the zone! Deep work time.',
    creative: 'Creative energy flowing! Work on something inspiring.'
  };
  return messages[mood] || 'Ready to make progress today!';
}
