/**
 * Profile API endpoints
 * 
 * Provides methods for user profile management
 */
import { crud } from '~/utils/crud';

// Keep backward compatibility with string constants
export const PROFILE_API = '/api/profile';
export const PROFILE_PASSWORD_API = '/api/profile/password';

/**
 * Profile API methods
 */
export const profileApi = {
  /**
   * Get current user's profile
   */
  getProfile: async () => {
    return crud.get(PROFILE_API);
  },

  /**
   * Update current user's profile
   * @param {FormData} formData - FormData with profile fields (name, profilePicture, sign)
   */
  updateProfile: async (formData) => {
    return crud.put(PROFILE_API, formData, {
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    });
  },

  /**
   * Change password
   * @param {string} oldPassword 
   * @param {string} newPassword 
   */
  changePassword: async (oldPassword, newPassword) => {
    return crud.put(PROFILE_PASSWORD_API, { oldPassword, newPassword });
  }
};

export default profileApi;
