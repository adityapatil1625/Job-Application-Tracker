const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createInterview,
  getInterviews,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const interviewValidation = [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('type').isIn(['Phone Screen', 'Technical', 'Onsite', 'System Design', 'HR', 'Other']),
  body('date').isISO8601().withMessage('Valid date is required')
];

router.use(protect);

// Specific routes MUST come before parameterized routes
router.get('/upcoming', getUpcomingInterviews);

router.route('/')
  .get(getInterviews)
  .post(interviewValidation, createInterview);

router.route('/:id')
  .put(interviewValidation, updateInterview)
  .delete(deleteInterview);

module.exports = router;
