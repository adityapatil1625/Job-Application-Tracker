const { Parser } = require('json2csv');
const { Readable } = require('stream');
const JobApplication = require('../models/JobApplication');

const exportJobsToCSV = async (req, res) => {
  try {
    const jobs = await JobApplication.find(
      { userId: req.user._id },
      { sortBy: 'createdAt', order: 'desc' }
    );

    if (jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No jobs to export'
      });
    }

    const fields = ['company', 'role', 'location', 'workMode', 'appliedDate', 'status', 'notes', 'link'];
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

const importJobsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const csv = require('csv-parser');
    const jobs = [];

    Readable.from(req.file.buffer)
      .pipe(csv())
      .on('data', (row) => {
        jobs.push({
          userId: req.user._id,
          company: row.company,
          role: row.role,
          location: row.location,
          workMode: row.workMode || row.work_mode || '',
          appliedDate: row.appliedDate || new Date(),
          status: row.status || 'Applied',
          notes: row.notes || '',
          link: row.link || ''
        });
      })
      .on('end', async () => {
        try {
          const result = await JobApplication.insertMany(jobs);

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
      })
      .on('error', (error) => {
        res.status(400).json({
          success: false,
          message: 'Invalid CSV file',
          error: error.message
        });
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
