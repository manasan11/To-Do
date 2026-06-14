const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  preferences: {
    defaultView: { type: String, enum: ['list', 'board', 'calendar', 'day', 'week'], default: 'list' },
    weeklyGoal: { type: Number, default: 10 },
    dailyGoal: { type: Number, default: 5 },
    pomodoroDuration: { type: Number, default: 25 },
    breakDuration: { type: Number, default: 5 },
    longBreakDuration: { type: Number, default: 15 },
    notificationsEnabled: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: false },
    soundEnabled: { type: Boolean, default: true }
  },
  stats: {
    totalTasksCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 },
    totalFocusMinutes: { type: Number, default: 0 },
    pomodoroSessions: { type: Number, default: 0 }
  },
  badges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    earnedAt: { type: Date, default: Date.now }
  }],
  completedDates: [Date],
  lastActiveDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
