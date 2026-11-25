const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify Bearer token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'caregrid_fallback_secret_key_2026'
    );

    // Try finding user in database; if DB offline or not found, attach decoded payload
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    } else {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        name: decoded.name
      };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

// Grant access to specific roles (Role-Based Access Control)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this route.`
      });
    }
    next();
  };
};

