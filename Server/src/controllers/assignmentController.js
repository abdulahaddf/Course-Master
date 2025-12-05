import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";
import {
  assignmentReviewSchema,
  assignmentSchema,
} from "../validators/authValidator.js";

export const createAssignment = async (req, res, next) => {
  try {
    console.log("Assignment request body:", req.body);
    const validatedData = assignmentSchema.parse(req.body);

    const course = await Course.findById(validatedData.courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const existingAssignment = await Assignment.findOne({
      course: validatedData.courseId,
      module: validatedData.module,
      student: req.user._id,
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "Assignment already submitted for this module" });
    }

    const assignment = new Assignment({
      course: validatedData.courseId,
      module: validatedData.module,
      student: req.user._id,
      submission: validatedData.submission,
    });

    await assignment.save();
    await assignment.populate("course", "title");

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Assignment creation error:", error.message);
    next(error);
  }
};

export const getCourseAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const assignments = await Assignment.find({ course: courseId })
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ submittedAt: -1 });

    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

export const getStudentAssignment = async (req, res, next) => {
  try {
    const { courseId, module } = req.query;

    if (!courseId || !module) {
      return res
        .status(400)
        .json({ error: "courseId and module are required" });
    }

    const assignment = await Assignment.findOne({
      course: courseId,
      module: module,
      student: req.user._id,
    })
      .populate("course", "title")
      .populate("student", "name email");

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

export const reviewAssignment = async (req, res, next) => {
  try {
    const validatedData = assignmentReviewSchema.parse(req.body);

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    assignment.grade = validatedData.grade;
    assignment.feedback = validatedData.feedback;
    assignment.reviewedAt = new Date();

    await assignment.save();
    await assignment.populate("student", "name email");
    await assignment.populate("course", "title");

    res.json(assignment);
  } catch (error) {
    next(error);
  }
};
