const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: '',
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  notes: {
    type: String,
    trim: true,
    default: '',
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
jobApplicationSchema.index({ userId: 1, createdAt: -1 });
jobApplicationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
