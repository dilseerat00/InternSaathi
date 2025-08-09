import { Router } from 'express';
import { registerUser, loginUser, updateUserProfile, getCollegeStudents } from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.get('/college/students', protect, authorizeRoles('college'), getCollegeStudents);

export default router;
