import express from 'express';
import { createEnrollment, getMyEnrollments, getCourseStudents, completeLesson } from '../controllers/enrollmentController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createEnrollment);
router.get('/me', authMiddleware, getMyEnrollments);
router.get('/course/:courseId/students', authMiddleware, adminMiddleware, getCourseStudents);
router.post('/:enrollmentId/lessons/:lessonId/complete', authMiddleware, completeLesson);

export default router;