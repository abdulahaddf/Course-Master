import axios from "axios";
import { getApiUrl } from '../config/api.js';

export const API_URL = getApiUrl('api/quizzes');

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const createQuiz = async (quizData, token) => {
  const res = await axios.post(API_URL, quizData, authHeader(token));
  return res.data;
};

const getQuizById = async (quizId, token) => {
  const res = await axios.get(`${API_URL}/${quizId}`, authHeader(token));
  return res.data;
};

const getQuizByCourseModule = async (courseId, module, token) => {
  const url = `${API_URL}/course/${courseId}?module=${encodeURIComponent(
    module
  )}`;
  const res = await axios.get(url, authHeader(token));
  return res.data;
};

const submitQuiz = async (quizId, answers, token) => {
  const res = await axios.post(
    `${API_URL}/${quizId}/submit`,
    { answers },
    authHeader(token)
  );
  return res.data;
};

export default {
  createQuiz,
  getQuizById,
  getQuizByCourseModule,
  submitQuiz,
  API_URL,
};
