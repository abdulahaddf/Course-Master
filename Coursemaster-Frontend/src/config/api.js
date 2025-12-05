// Centralized API configuration
const API_BASE = import.meta.env.VITE_API_URL || 
  "https://course-master-server-production.up.railway.app";

// Remove trailing slash if present
export const API_BASE_URL = API_BASE.replace(/\/$/, "");

// Helper to create full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default API_BASE_URL;

