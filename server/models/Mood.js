const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['energetic', 'happy', 'neutral', 'tired', 'stressed', 'sad', 'focused', 'creative'],
    required: true
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  note: {
    type: String,
    maxlength: 500,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

moodSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);
