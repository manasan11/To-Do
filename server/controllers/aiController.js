const Task = require('../models/Task');

exports.breakdownTask = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const subtasks = generateSubtasks(title, description, category);

    const parentTask = await Task.create({
      user: req.user._id,
      title,
      description,
      category: category || 'work',
      priority: 'medium',
      isAIGenerated: true,
      subtasks: subtasks.map(s => ({ title: s, completed: false }))
    });

    res.status(201).json({
      parentTask,
      subtasks,
      message: `Task broken down into ${subtasks.length} actionable subtasks`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.suggestTasks = async (req, res) => {
  try {
    const { context } = req.body;
    const suggestions = generateAISuggestions(context);

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function generateSubtasks(title, description, category) {
  const templates = {
    work: [
      `Research and gather requirements for "${title}"`,
      `Create a detailed plan/outline for ${title}`,
      `Draft the initial version of ${title}`,
      `Review and refine ${title}`,
      `Get feedback on ${title}`,
      `Finalize and submit ${title}`
    ],
    education: [
      `Review prerequisites for ${title}`,
      `Study core concepts of ${title}`,
      `Take notes on ${title}`,
      `Complete practice exercises for ${title}`,
      `Summarize key learnings from ${title}`,
      `Test knowledge on ${title}`
    ],
    personal: [
      `List out what needs to be done for ${title}`,
      `Gather necessary items/tools for ${title}`,
      `Dedicate 30 minutes to ${title}`,
      `Complete the main part of ${title}`,
      `Review and finalize ${title}`
    ],
    health: [
      `Plan ${title} activities for the week`,
      `Prepare necessary equipment/supplies`,
      `Complete session 1 of ${title}`,
      `Track progress and adjust ${title}`,
      `Celebrate completing ${title}`
    ],
    default: [
      `Break down "${title}" into smaller pieces`,
      `Identify the first actionable step for ${title}`,
      `Set a timer and work on ${title} for 25 minutes`,
      `Review progress on ${title}`,
      `Complete remaining work on ${title}`,
      `Final review of ${title}`
    ]
  };

  const pattern = templates[category] || templates.default;
  const steps = pattern.map(s => s);

  if (title.toLowerCase().includes('project') || title.toLowerCase().includes('plan')) {
    steps.push(`Create a timeline for ${title}`);
    steps.push(`Share progress on ${title} with stakeholders`);
  }

  if (description && description.length > 50) {
    steps.push(`Refer to notes: ${description.substring(0, 100)}...`);
  }

  return steps.slice(0, 8);
}

function generateAISuggestions(context) {
  const suggestions = [];

  if (context === 'morning') {
    suggestions.push(
      { title: 'Plan your top 3 priorities for today', category: 'work', priority: 'high' },
      { title: 'Review yesterday accomplishments', category: 'personal', priority: 'medium' },
      { title: 'Morning meditation or exercise', category: 'health', priority: 'medium' },
      { title: 'Check and respond to important messages', category: 'work', priority: 'high' }
    );
  } else if (context === 'afternoon') {
    suggestions.push(
      { title: 'Tackle your most challenging task', category: 'work', priority: 'high' },
      { title: 'Take a 15-minute break', category: 'health', priority: 'low' },
      { title: 'Review and adjust tomorrow schedule', category: 'personal', priority: 'medium' }
    );
  } else if (context === 'evening') {
    suggestions.push(
      { title: 'Complete any remaining urgent tasks', category: 'work', priority: 'high' },
      { title: 'Plan for tomorrow', category: 'personal', priority: 'medium' },
      { title: 'Evening wind-down routine', category: 'health', priority: 'low' },
      { title: 'Journal about today achievements', category: 'personal', priority: 'low' }
    );
  } else {
    suggestions.push(
      { title: `Organize ${context || 'your'} tasks by priority`, category: 'work', priority: 'high' },
      { title: 'Set achievable goals for this session', category: 'personal', priority: 'medium' },
      { title: 'Take regular breaks to stay fresh', category: 'health', priority: 'low' }
    );
  }

  return suggestions;
}
