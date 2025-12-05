import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5001";
const API_URL = `${API_BASE.replace(/\/$/, "")}/api/assignments`;

const createAssignment = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getStudentAssignment = async (courseId, module, token) => {
  try {
    const res = await axios.get(
      `${API_URL}/student/submission?courseId=${courseId}&module=${encodeURIComponent(
        module
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null; // No assignment submitted yet
    }
    throw err;
  }
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
  getStudentAssignment,
  getCourseAssignments,
  reviewAssignment,
  API_URL,
};
