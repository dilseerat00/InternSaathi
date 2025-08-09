import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from the token payload to the request object, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, user not found');
      }

      next(); // Move to the next middleware/route handler
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token');
  }
});

// Middleware to check user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(`User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this route`);
    }
    next();
  };
};

export { protect, authorizeRoles };
