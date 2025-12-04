import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { courseSchema } from "../validators/authValidator.js";

export const getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { q, category, tags, sort } = req.query;

    let filter = { isPublished: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    let sortOptions = {};
    if (sort === "price_asc") {
      sortOptions.price = 1;
    } else if (sort === "price_desc") {
      sortOptions.price = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Add enrollment count to each course
    const coursesWithEnrollments = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({
          course: course._id,
        });
        return {
          ...course.toObject(),
          enrollments: enrollmentCount,
        };
      })
    );

    const total = await Course.countDocuments(filter);

    res.json({
      data: coursesWithEnrollments,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Add enrollment count
    const enrollmentCount = await Enrollment.countDocuments({
      course: course._id,
    });
    const courseData = {
      ...course.toObject(),
      enrollments: enrollmentCount,
    };

    res.json(courseData);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const validatedData = courseSchema.parse(req.body);

    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res
        .status(400)
        .json({ error: "Course with similar title already exists" });
    }

    const course = new Course({
      ...validatedData,
      slug,
      instructor: req.user._id,
    });

    await course.save();
    await course.populate("instructor", "name email");

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const validatedData = courseSchema.parse(req.body);

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this course" });
    }

    Object.assign(course, validatedData);
    await course.save();
    await course.populate("instructor", "name email");

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
