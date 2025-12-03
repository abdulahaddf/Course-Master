import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { enrollmentSchema } from '../validators/authValidator.js';

export const createEnrollment = async (req, res, next) => {
  try {
    const validatedData = enrollmentSchema.parse(req.body);
    
    const course = await Course.findById(validatedData.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: validatedData.courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    const enrollment = new Enrollment({
      student: req.user._id,
      course: validatedData.courseId,
      batch: validatedData.batch
    });
    
    await enrollment.save();
    await enrollment.populate('course', 'title description price');
    
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title description price instructor')
      .populate('course.instructor', 'name email')
      .sort({ enrolledAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const getCourseStudents = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { batch } = req.query;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let filter = { course: courseId };
    if (batch) {
      filter.batch = batch;
    }
    
    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { enrollmentId, lessonId } = req.params;
    
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const alreadyCompleted = enrollment.lessonsCompleted.some(
      lesson => lesson.lessonId === lessonId
    );
    
    if (!alreadyCompleted) {
      enrollment.lessonsCompleted.push({ lessonId });
      
      const course = await Course.findById(enrollment.course);
      const totalLessons = course.syllabus.reduce((total, module) => total + module.lessons.length, 0);
      
      enrollment.progress = Math.round((enrollment.lessonsCompleted.length / totalLessons) * 100);
      
      await enrollment.save();
    }
    
    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};