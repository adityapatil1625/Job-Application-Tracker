const User = require('../models/User');

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const getOrCreateFixedUser = async () => {
  const configuredEmail = (process.env.FIXED_USER_EMAIL || '').trim();
  const fixedUserEmail = EMAIL_REGEX.test(configuredEmail)
    ? configuredEmail
    : 'fixed.user@jobtracker.com';
  const fixedUserName = process.env.FIXED_USER_NAME || 'Default User';
  let fixedUserPassword = process.env.FIXED_USER_PASSWORD || process.env.JWT_SECRET || 'fixed-user-password-123';

  if (typeof fixedUserPassword !== 'string' || fixedUserPassword.length < 6) {
    fixedUserPassword = 'fixed-user-password-123';
  }

  let user = await User.findOne({ email: fixedUserEmail });

  if (!user) {
    try {
      user = await User.create({
        name: fixedUserName,
        email: fixedUserEmail,
        password: fixedUserPassword
      });
    } catch (error) {
      // Handle concurrent requests racing to create the same fixed user.
      if (error && error.code === 11000) {
        user = await User.findOne({ email: fixedUserEmail });
      } else {
        throw error;
      }
    }
  }

  return user;
};

const protect = async (req, res, next) => {
  try {
    req.user = await getOrCreateFixedUser();
    return next();
  } catch (error) {
    console.error('Fixed user auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to initialize fixed user'
    });
  }
};

module.exports = { protect };
