const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const { status, category, priority, search, dueDate, tags, sort } = req.query;
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (tags) query.tags = { $in: tags.split(',') };
    if (dueDate) {
      const date = new Date(dueDate);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };
    if (sort === 'createdAt') sortOption = { createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    const tasks = await Task.find(query).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const taskData = { ...req.body, user: req.user._id };

    if (req.body.parentTask) {
      taskData.isAIGenerated = true;
    }

    const lastTask = await Task.findOne({ user: req.user._id }).sort({ order: -1 });
    taskData.order = (lastTask?.order || 0) + 1;

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
      await task.save();
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.deleteMany({ parentTask: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    const bulkOps = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id, user: req.user._id },
        update: { order: index }
      }
    }));
    await Task.bulkWrite(bulkOps);
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { taskIds, updates } = req.body;
    await Task.updateMany(
      { _id: { $in: taskIds }, user: req.user._id },
      { ...updates, updatedAt: Date.now() }
    );
    res.json({ message: 'Tasks updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const tasks = await Task.find({
      user: req.user._id,
      dueDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    subtask.completed = !subtask.completed;
    subtask.completedAt = subtask.completed ? new Date() : null;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.subtasks.push({ title: req.body.title });
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
