const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobApplication',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Phone Screen', 'Technical', 'Onsite', 'System Design', 'HR', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    default: ''
  },
  meetingLink: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  interviewer: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: '',
    maxlength: 1000
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
interviewSchema.index({ userId: 1, date: 1 });
interviewSchema.index({ date: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
