import { Router } from 'express';
import {
  applyForInternship,
  getCompanyApplications,
  getStudentApplications,
  getCollegeApplications,
  getInternshipApplicants,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Student-specific routes
router.post('/:internshipId', protect, authorizeRoles('student'), applyForInternship);
router.get('/student/my-applications', protect, authorizeRoles('student'), getStudentApplications);

// Company-specific routes
router.get('/company/my-applications', protect, authorizeRoles('company'), getCompanyApplications);
router.get('/internship/:internshipId', protect, authorizeRoles('company'), getInternshipApplicants);
router.put('/:id/status', protect, authorizeRoles('company'), updateApplicationStatus);

// College-specific routes
router.get('/college/my-applications', protect, authorizeRoles('college'), getCollegeApplications);

export default router;
