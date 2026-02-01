const { Parser } = require('json2csv');
const JobApplication = require('../models/JobApplication');

// @desc    Export jobs to CSV
// @route   GET /api/jobs/export/csv
// @access  Private
const exportJobsToCSV = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.user._id });

    if (jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No jobs to export'
      });
    }

    const fields = ['company', 'role', 'location', 'appliedDate', 'status', 'notes', 'link'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(jobs);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="job-applications.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error exporting jobs'
    });
  }
};

// @desc    Import jobs from CSV
// @route   POST /api/jobs/import/csv
// @access  Private
const importJobsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const csv = require('csv-parser');
    const fs = require('fs');
    const jobs = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        jobs.push({
          userId: req.user._id,
          company: row.company,
          role: row.role,
          location: row.location,
          appliedDate: row.appliedDate || new Date(),
          status: row.status || 'Applied',
          notes: row.notes || '',
          link: row.link || ''
        });
      })
      .on('end', async () => {
        try {
          const result = await JobApplication.insertMany(jobs);
          fs.unlinkSync(req.file.path); // Delete temp file
          
          res.status(201).json({
            success: true,
            message: `Imported ${result.length} job applications`,
            data: result
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Error importing jobs',
            error: error.message
          });
        }
      });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error importing jobs'
    });
  }
};

module.exports = {
  exportJobsToCSV,
  importJobsFromCSV
};
