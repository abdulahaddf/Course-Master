import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctIndex: {
    type: Number,
    required: true,
    min: 0
  }
});

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [questionSchema],
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

export default mongoose.model('Quiz', quizSchema);