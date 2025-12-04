import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  syllabus: z.array(z.object({
    title: z.string().min(1, 'Module title is required'),
    description: z.string().optional(),
    lessons: z.array(z.object({
      title: z.string().min(1, 'Lesson title is required'),
      description: z.string().optional(),
      videoUrl: z.string().optional(),
      duration: z.number().optional(),
      order: z.number().min(0)
    })),
    order: z.number().min(0)
  })),
  batches: z.array(z.object({
    name: z.string().min(1, 'Batch name is required'),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date'
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date'
    })
  }))
});

export const enrollmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  batch: z.string().min(1, 'Batch is required')
});

export const assignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  module: z.string().min(1, 'Module is required'),
  submission: z.string().min(1, 'Submission is required')
});

export const assignmentReviewSchema = z.object({
  grade: z.number().min(0).max(100),
  feedback: z.string().optional()
});

export const quizSubmissionSchema = z.object({
  answers: z.array(z.number().min(0))
});