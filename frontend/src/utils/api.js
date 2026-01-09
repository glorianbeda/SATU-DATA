/**
 * Centralized API client with pre-configured settings.
 * Use this instead of importing axios directly.
 *
 * Features:
 * - Pre-configured baseURL from environment
 * - Credentials automatically included (cookies)
 * - Consistent timeout settings
 *
 * Usage:
 *   import api from '~/utils/api';
 *   api.get('/api/profile');
 *   api.post('/api/documents/upload', formData);
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

// Response interceptor for error handling (optional enhancement)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      // Optionally redirect to login or clear session
      console.warn("Unauthorized - session may have expired");
    }
    return Promise.reject(error);
  }
);

export default api;
