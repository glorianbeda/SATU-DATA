/**
 * Auth API endpoints
 * 
 * Migration Note: These endpoints are NOT standard CRUD operations.
 * They use custom endpoints that don't follow REST conventions.
 * Use the authApi object for cleaner method calls.
 */
import { crud } from '~/utils/crud';

// Keep backward compatibility with string constants
export const LOGIN_API = '/api/login';
export const REGISTER_API = '/api/register';

/**
 * Auth API methods - Use these for authentication operations
 */
export const authApi = {
  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    return crud.post(LOGIN_API, { email, password });
  },

  /**
   * Register new user
   * @param {object} userData - { name, email, password }
   */
  register: async (userData) => {
    return crud.post(REGISTER_API, userData);
  },

  /**
   * Logout current user
   */
  logout: async () => {
    return crud.post('/api/logout');
  }
};

export default authApi;
