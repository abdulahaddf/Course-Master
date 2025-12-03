import express from 'express';
import { createAssignment, getCourseAssignments, reviewAssignment } from '../controllers/assignmentController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createAssignment);
router.get('/course/:courseId', authMiddleware, adminMiddleware, getCourseAssignments);
router.put('/:id/review', authMiddleware, adminMiddleware, reviewAssignment);

export default router;