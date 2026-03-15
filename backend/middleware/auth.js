const User = require('../models/User');

const getOrCreateFixedUser = async () => {
  const fixedUserEmail = process.env.FIXED_USER_EMAIL || 'guest@jobtracker.local';
  const fixedUserName = process.env.FIXED_USER_NAME || 'Default User';
  const fixedUserPassword = process.env.FIXED_USER_PASSWORD || process.env.JWT_SECRET || 'fixed-user-password-123';

  let user = await User.findOne({ email: fixedUserEmail });

  if (!user) {
    user = await User.create({
      name: fixedUserName,
      email: fixedUserEmail,
      password: fixedUserPassword
    });
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
