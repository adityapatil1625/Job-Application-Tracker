const { isDbConnected } = require('../config/db');

const requireDatabase = (req, res, next) => {
  if (isDbConnected()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'Database is temporarily unavailable. Please try again shortly.'
  });
};

module.exports = { requireDatabase };
