import axios from 'axios';
import { getApiUrl } from '../config/api.js';

const API_URL = getApiUrl('api/enrollments');

const enrollmentService = {
  createEnrollment: async (enrollmentData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.post(API_URL, enrollmentData, config);
    return response.data;
  },

  getMyEnrollments: async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
  },

  completeLesson: async (enrollmentId, lessonId, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.post(
      `${API_URL}/${enrollmentId}/lessons/${lessonId}/complete`,
      {},
      config
    );
    return response.data;
  }
};

export default enrollmentService;