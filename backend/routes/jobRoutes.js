const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

// Validation middleware
const jobValidation = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('status')
    .optional()
    .isIn(['Applied', 'OA', 'Interview', 'Offer', 'Rejected'])
    .withMessage('Invalid status')
];

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getJobs)
  .post(jobValidation, createJob);

router.get('/stats', getJobStats);

router.route('/:id')
  .get(getJob)
  .put(jobValidation, updateJob)
  .delete(deleteJob);

module.exports = router;
