import axios from "axios";

const API_URL = "/api/assignments";

const createAssignment = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getCourseAssignments = async (courseId, token) => {
  const res = await axios.get(`${API_URL}/course/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const reviewAssignment = async (id, reviewData, token) => {
  const res = await axios.put(`${API_URL}/${id}/review`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default {
  createAssignment,
  getCourseAssignments,
  reviewAssignment,
};
