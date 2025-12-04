import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseBySlug,
  getCourses,
  updateCourse,
} from "../controllers/courseController.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/id/:id", getCourseById);
router.get("/:slug", getCourseBySlug);
router.post("/", authMiddleware, adminMiddleware, createCourse);
router.put("/:id", authMiddleware, adminMiddleware, updateCourse);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourse);

export default router;
