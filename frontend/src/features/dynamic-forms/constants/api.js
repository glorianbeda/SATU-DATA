/**
 * Dynamic Forms API endpoints
 * 
 * Provides methods for form management
 */
import { crud, createResourceApi } from '~/utils/crud';

// Resource-based API
export const formsApi = createResourceApi('/api/forms');

/**
 * Custom Forms API methods
 */
export const dynamicFormsApi = {
  ...formsApi,

  // Config
  getConfig: () => crud.get('/api/config'),

  // Import
  importForm: (data) => crud.post('/api/forms/import', data),

  // Responses
  getResponses: (formId) => crud.get(`/api/forms/${formId}/responses`),
  submitResponse: (formId, data) => crud.post(`/api/forms/${formId}/submit`, data),

  // Public forms
  getPublicForm: (slug) => crud.get(`/api/forms/public/${slug}`),
};

export default dynamicFormsApi;
