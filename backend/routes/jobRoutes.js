const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');
const {
  exportJobsToCSV,
  importJobsFromCSV
} = require('../controllers/csvController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

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
router.get('/export/csv', exportJobsToCSV);
router.post('/import/csv', upload.single('file'), importJobsFromCSV);

router.route('/:id')
  .get(getJob)
  .put(jobValidation, updateJob)
  .delete(deleteJob);

module.exports = router;
