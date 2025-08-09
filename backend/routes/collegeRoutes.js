import express from 'express';
import User from '../models/User.js'; 
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all colleges with filtering
// @route   GET /api/colleges
// @access  Private/Company
router.get('/', protect, authorizeRoles('company'), async (req, res) => {
  try {
    const { keyword, location } = req.query;

    const queryConditions = { role: 'college' };
    const andClause = [];

    if (keyword) {
      andClause.push({
        $or: [
          { collegeName: { $regex: keyword, $options: 'i' } },
          { collegeLocation: { $regex: keyword, $options: 'i' } },
        ],
      });
    }

    if (location) {
      andClause.push({
        collegeLocation: { $regex: location, $options: 'i' },
      });
    }

    if (andClause.length > 0) {
      queryConditions.$and = andClause;
    }

    // --- THE FIX IS HERE ---
    // We now fetch the whole user object (minus the password) to avoid errors.
    const colleges = await User.find(queryConditions).select('-password');
    
    // Map the results to the format the frontend expects, with fallbacks for safety.
    const formattedColleges = colleges.map(collegeUser => ({
        _id: collegeUser._id,
        name: collegeUser.collegeName,
        email: collegeUser.email, 
        collegeLogo: collegeUser.collegeLogo || '', // Use a fallback
        location: {
            city: collegeUser.collegeLocation || 'N/A', // Use a fallback
            state: ''
        },
        domains: [] 
    }));

    res.json(formattedColleges);

  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
