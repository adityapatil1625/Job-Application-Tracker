const { validationResult } = require('express-validator');
const JobApplication = require('../models/JobApplication');

const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { company, role, link, location, appliedDate, status, notes } = req.body;

    const job = await JobApplication.create({
      userId: req.user._id,
      company,
      role,
      link,
      location,
      appliedDate,
      status,
      notes
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating job application'
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const jobs = await JobApplication.find(
      { userId: req.user._id, status, search },
      { sortBy, order }
    );

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching job applications'
    });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    if (job.userId !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this job application'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching job application'
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const existingJob = await JobApplication.findById(req.params.id);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    if (existingJob.userId !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job application'
      });
    }

    const job = await JobApplication.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating job application'
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    if (job.userId !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job application'
      });
    }

    await JobApplication.deleteById(req.params.id);

    res.json({
      success: true,
      message: 'Job application deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting job application'
    });
  }
};

const getJobStats = async (req, res) => {
  try {
    const statsObject = await JobApplication.getStatsByUser(req.user._id);

    res.json({
      success: true,
      data: statsObject
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobStats
};
