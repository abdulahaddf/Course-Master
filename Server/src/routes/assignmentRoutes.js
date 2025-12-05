import express from "express";
import {
  createAssignment,
  getCourseAssignments,
  getStudentAssignment,
  reviewAssignment,
} from "../controllers/assignmentController.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAssignment);
router.get("/student/submission", authMiddleware, getStudentAssignment);
router.get(
  "/course/:courseId",
  authMiddleware,
  adminMiddleware,
  getCourseAssignments
);
router.put("/:id/review", authMiddleware, adminMiddleware, reviewAssignment);

export default router;
