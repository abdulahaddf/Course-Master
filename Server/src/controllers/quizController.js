import Quiz from '../models/Quiz.js';
import { quizSubmissionSchema } from '../validators/authValidator.js';

export const submitQuiz = async (req, res, next) => {
  try {
    const validatedData = quizSubmissionSchema.parse(req.body);
    
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    if (validatedData.answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: 'All questions must be answered' });
    }
    
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (validatedData.answers[index] === question.correctIndex) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    res.json({
      score,
      total: quiz.questions.length,
      correctAnswers,
      passed: score >= quiz.passingScore
    });
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate('course', 'title');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const quizWithoutAnswers = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      course: quiz.course,
      questions: quiz.questions.map(q => ({
        text: q.text,
        options: q.options
      }))
    };
    
    res.json(quizWithoutAnswers);
  } catch (error) {
    next(error);
  }
};