const { validationResult } = require('express-validator');
const JobApplication = require('../models/JobApplication');

// @desc    Create new job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    // Validate request
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

// @desc    Get all job applications for user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search by company or role
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const jobs = await JobApplication.find(query).sort(sortOptions);

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

// @desc    Get single job application
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    // Make sure user owns this job application
    if (job.userId.toString() !== req.user._id.toString()) {
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

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    // Make sure user owns this job application
    if (job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job application'
      });
    }

    job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

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

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    // Make sure user owns this job application
    if (job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job application'
      });
    }

    await job.deleteOne();

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

// @desc    Get job application statistics
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = async (req, res) => {
  try {
    const stats = await JobApplication.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform to object format
    const statsObject = {
      total: 0,
      Applied: 0,
      OA: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    stats.forEach(stat => {
      statsObject[stat._id] = stat.count;
      statsObject.total += stat.count;
    });

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
