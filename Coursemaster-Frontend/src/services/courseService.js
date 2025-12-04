import axios from "axios";

const API_URL = "/api/courses";

const courseService = {
  getCourses: async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getCourseBySlug: async (slug) => {
    const response = await axios.get(`${API_URL}/${slug}`);
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await axios.get(`${API_URL}/id/${id}`);
    return response.data;
  },

  createCourse: async (courseData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(API_URL, courseData, config);
    return response.data;
  },

  updateCourse: async (id, courseData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/${id}`, courseData, config);
    return response.data;
  },

  deleteCourse: async (id, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  },
};

export default courseService;
