/**
 * Global CRUD utility for API requests.
 * 
 * This provides a consistent way to handle CRUD operations across all features.
 * Uses the centralized api client from '~/utils/api'.
 * 
 * Usage:
 *   import { crud } from '~/utils/crud';
 *   
 *   // Get all items
 *   const users = await crud.get('/api/users');
 *   
 *   // Get single item
 *   const user = await crud.get('/api/users', { id: 1 });
 *   
 *   // Create item
 *   const newUser = await crud.post('/api/users', { name: 'John' });
 *   
 *   // Update item
 *   const updated = await crud.put('/api/users', { id: 1, name: 'Jane' });
 *   
 *   // Delete item
 *   await crud.delete('/api/users', { id: 1 });
 * 
 * Or use the resource-based approach:
 *   import { createResourceApi } from '~/utils/crud';
 *   
 *   const usersApi = createResourceApi('/api/users');
 *   const users = await usersApi.getAll();
 *   const user = await usersApi.get(1);
 *   const newUser = await usersApi.create({ name: 'John' });
 *   const updated = await usersApi.update(1, { name: 'Jane' });
 *   await usersApi.delete(1);
 */

import api from './api';

/**
 * Replace :id placeholder in URL with actual ID
 */
const replaceIdParam = (url, id) => {
  if (id !== undefined && id !== null) {
    return url.replace(/:id/g, String(id));
  }
  return url;
};

/**
 * CRUD operations
 */
export const crud = {
  /**
   * GET request - fetch data
   * @param {string} endpoint - API endpoint (e.g., '/api/users' or '/api/users/:id')
   * @param {object} options - Request options
   * @param {string|number} options.id - ID for single item fetch (replaces :id in endpoint)
   * @param {object} options.params - Query parameters
   * @param {object} options.config - Additional axios config
   */
  get: async (endpoint, options = {}) => {
    const { id, params = {}, config = {} } = options;
    const url = replaceIdParam(endpoint, id);
    const response = await api.get(url, { ...config, params });
    return response.data;
  },

  /**
   * POST request - create new item
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional axios config
   */
  post: async (endpoint, data, config = {}) => {
    const response = await api.post(endpoint, data, config);
    return response.data;
  },

  /**
   * PUT request - update existing item
   * @param {string} endpoint - API endpoint (e.g., '/api/users/:id')
   * @param {object} data - Request body data (should include id)
   * @param {object} options - Request options
   * @param {string|number} options.id - ID for the item to update
   * @param {object} options.config - Additional axios config
   */
  put: async (endpoint, data, options = {}) => {
    const { id, config = {} } = options;
    const url = replaceIdParam(endpoint, id);
    const response = await api.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request - partial update
   * @param {string} endpoint - API endpoint (e.g., '/api/users/:id')
   * @param {object} data - Request body data
   * @param {object} options - Request options
   * @param {string|number} options.id - ID for the item to update
   * @param {object} options.config - Additional axios config
   */
  patch: async (endpoint, data, options = {}) => {
    const { id, config = {} } = options;
    const url = replaceIdParam(endpoint, id);
    const response = await api.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request - remove item
   * @param {string} endpoint - API endpoint (e.g., '/api/users/:id')
   * @param {object} options - Request options
   * @param {string|number} options.id - ID for the item to delete
   * @param {object} options.config - Additional axios config
   */
  delete: async (endpoint, options = {}) => {
    const { id, config = {} } = options;
    const url = replaceIdParam(endpoint, id);
    const response = await api.delete(url, config);
    return response.data;
  },

  /**
   * Upload file(s) with multipart form data
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - FormData object with files
   * @param {function} onProgress - Progress callback
   */
  upload: async (endpoint, formData, onProgress) => {
    const config = onProgress ? {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    } : {};
    
    const response = await api.post(endpoint, formData, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

/**
 * Create a resource-specific API wrapper
 * @param {string} baseEndpoint - Base API endpoint (e.g., '/api/users')
 * @returns {object} Resource API with getAll, get, create, update, delete methods
 */
export const createResourceApi = (baseEndpoint) => {
  // Handle endpoints that end with / or don't have / prefix
  const base = baseEndpoint.startsWith('/') ? baseEndpoint : `/${baseEndpoint}`;
  
  return {
    /**
     * Get all items
     * @param {object} params - Query parameters
     */
    getAll: (params = {}) => crud.get(base, { params }),
    
    /**
     * Get single item by ID
     * @param {string|number} id - Item ID
     * @param {object} params - Query parameters
     */
    get: (id, params = {}) => crud.get(base, { id, params }),
    
    /**
     * Create new item
     * @param {object} data - Item data
     * @param {object} config - Axios config
     */
    create: (data, config = {}) => crud.post(base, data, config),
    
    /**
     * Update item by ID
     * @param {string|number} id - Item ID
     * @param {object} data - Updated data
     * @param {object} config - Axios config
     */
    update: (id, data, config = {}) => crud.put(base, data, { id, config }),
    
    /**
     * Patch item by ID (partial update)
     * @param {string|number} id - Item ID
     * @param {object} data - Partial data
     * @param {object} config - Axios config
     */
    patch: (id, data, config = {}) => crud.patch(base, data, { id, config }),
    
    /**
     * Delete item by ID
     * @param {string|number} id - Item ID
     * @param {object} config - Axios config
     */
    delete: (id, config = {}) => crud.delete(base, { id, config }),
    
    /**
     * Upload file for this resource
     * @param {FormData} formData - FormData with file
     * @param {function} onProgress - Progress callback
     */
    upload: (formData, onProgress) => crud.upload(base, formData, onProgress)
  };
};

/**
 * Create a custom API wrapper with specific endpoints
 * @param {object} endpoints - Custom endpoints mapping
 * @param {string} endpoints.list - GET list endpoint
 * @param {string} endpoints.get - GET single endpoint (use :id for ID placeholder)
 * @param {string} endpoints.create - POST create endpoint
 * @param {string} endpoints.update - PUT update endpoint
 * @param {string} endpoints.delete - DELETE endpoint
 * @returns {object} Custom API with defined methods
 */
export const createCustomApi = (endpoints) => {
  return {
    list: (params) => crud.get(endpoints.list, { params }),
    get: (id, params) => crud.get(endpoints.get, { id, params }),
    create: (data, config) => crud.post(endpoints.create, data, config),
    update: (id, data, config) => crud.put(endpoints.update, data, { id, config }),
    patch: (id, data, config) => crud.patch(endpoints.patch, data, { id, config }),
    delete: (id, config) => crud.delete(endpoints.delete, { id, config }),
  };
};

export default crud;
