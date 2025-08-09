import express from 'express';
import User from '../models/User.js'; // We query the same User model
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all companies with filtering
// @route   GET /api/companies
// @access  Private/College
router.get('/', protect, authorizeRoles('college'), async (req, res) => {
  try {
    const { keyword } = req.query;

    // Base query targets users with the role 'company'
    const query = { role: 'company' };

    // If a keyword is provided, search the companyName or companyDescription
    if (keyword) {
      query.$or = [
        { companyName: { $regex: keyword, $options: 'i' } },
        { companyDescription: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Find company users and select the fields needed by the frontend
    // The fix is here: Added 'companyLogo' to the list of selected fields.
    const companies = await User.find(query).select(
      'companyName companyDescription email companyLogo'
    );
    
    // The data is already in a good format, so we can send it directly
    res.json(companies);

  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
