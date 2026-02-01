const { validationResult } = require('express-validator');
const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');
const { sendInterviewReminder } = require('../utils/emailService');

// @desc    Create interview
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { jobId, type, date, time, meetingLink, location, interviewer, notes } = req.body;

    // Verify job exists and belongs to user
    const job = await JobApplication.findById(jobId);
    if (!job || job.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const interview = await Interview.create({
      jobId,
      userId: req.user._id,
      company: job.company,
      role: job.role,
      type,
      date,
      time,
      meetingLink,
      location,
      interviewer,
      notes
    });

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating interview'
    });
  }
};

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ date: 1 })
      .populate('jobId');

    res.json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interviews'
    });
  }
};

// @desc    Get upcoming interviews
// @route   GET /api/interviews/upcoming
// @access  Private
const getUpcomingInterviews = async (req, res) => {
  try {
    const now = new Date();
    const interviews = await Interview.find({
      userId: req.user._id,
      date: { $gte: now }
    })
      .sort({ date: 1 })
      .limit(10)
      .populate('jobId');

    res.json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    console.error('Get upcoming interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching upcoming interviews'
    });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview'
      });
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating interview'
    });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview'
      });
    }

    await interview.deleteOne();

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting interview'
    });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews
};
