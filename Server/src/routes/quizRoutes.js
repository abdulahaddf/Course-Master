import express from "express";
import {
  createQuiz,
  getQuiz,
  getQuizByCourseModule,
  submitQuiz,
} from "../controllers/quizController.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createQuiz);
router.get("/course/:courseId", authMiddleware, getQuizByCourseModule);
router.get("/:quizId", authMiddleware, getQuiz);
router.post("/:quizId/submit", authMiddleware, submitQuiz);

export default router;
