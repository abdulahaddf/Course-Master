import axios from 'axios';

const API_URL = '/api/auth';
console.log(API_URL);
const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  login: async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  },

  getMe: async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
  }
};

export default authService;