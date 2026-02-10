import axios from 'axios';

// Axios base instance with sensible defaults
export const api = axios.create({
  // Default to deployed backend if env not provided
  baseURL: (import.meta?.env?.VITE_API_URL || 'http://3.238.155.37:5000/api').replace(/\/+$/, ''),
  timeout: 15000,
});

// Attach token if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export default api;
