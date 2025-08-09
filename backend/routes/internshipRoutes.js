import { Router } from 'express';
import {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getMyInternships,
} from '../controllers/internshipController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Public route for getting all internships (with search/filters)
router.get('/', getInternships);

// Private route for getting MY internships (MUST be before the dynamic /:id route)
// The order here is CRITICAL to avoid the "Cast to ObjectId failed" error.
router.get('/my-internships', protect, authorizeRoles('company'), getMyInternships);

// Private route for creating a new internship
router.post('/', protect, authorizeRoles('company'), createInternship);

// Dynamic public route for getting a single internship by ID (MUST be placed after specific routes)
router.get('/:id', getInternshipById);

// Dynamic private routes for updating and deleting by ID
router.put('/:id', protect, authorizeRoles('company'), updateInternship);
router.delete('/:id', protect, authorizeRoles('company'), deleteInternship);

export default router;
