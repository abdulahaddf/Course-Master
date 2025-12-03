import express from 'express';
import { submitQuiz, getQuiz } from '../controllers/quizController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:quizId', authMiddleware, getQuiz);
router.post('/:quizId/submit', authMiddleware, submitQuiz);

export default router;