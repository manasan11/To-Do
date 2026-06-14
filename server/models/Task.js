const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'education', 'finance', 'social', 'shopping', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'archived'],
    default: 'todo'
  },
  dueDate: Date,
  reminder: Date,
  completedAt: Date,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'weekdays', 'weekends'],
    default: null
  },
  estimatedMinutes: {
    type: Number,
    default: 25,
    min: 1
  },
  actualMinutes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  order: {
    type: Number,
    default: 0
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  next();
});

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
