import express from 'express';
import { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.put('/:id', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);

export default router;