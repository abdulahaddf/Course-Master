import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: String,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  feedback: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date
}, {
  timestamps: true
});

assignmentSchema.index({ course: 1, student: 1 });
assignmentSchema.index({ student: 1 });

export default mongoose.model('Assignment', assignmentSchema);