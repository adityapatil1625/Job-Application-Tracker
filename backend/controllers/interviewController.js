const { validationResult } = require('express-validator');
const Interview = require('../models/Interview');
const JobApplication = require('../models/JobApplication');

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
    const job = await JobApplication.findById(jobId);

    if (!job || job.userId !== String(req.user._id)) {
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

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findByUser(req.user._id);

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

const getUpcomingInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findByUser(req.user._id, {
      upcoming: true,
      limit: 10
    });

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

const updateInterview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const existingInterview = await Interview.findById(req.params.id);

    if (!existingInterview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (existingInterview.userId !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview'
      });
    }

    const updates = { ...req.body };

    if (updates.jobId) {
      const job = await JobApplication.findById(updates.jobId);

      if (!job || job.userId !== String(req.user._id)) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      updates.company = job.company;
      updates.role = job.role;
    }

    const interview = await Interview.findByIdAndUpdate(req.params.id, updates);

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

const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview'
      });
    }

    await Interview.deleteById(req.params.id);

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
