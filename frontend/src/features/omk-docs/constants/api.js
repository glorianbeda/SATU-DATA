/**
 * OMK Docs (Document Management) API endpoints
 * 
 * Provides methods for document signing and management
 */
import { crud, createResourceApi } from '~/utils/crud';

// Resource-based APIs
export const documentsApi = createResourceApi('/api/documents');

/**
 * Custom OMK Docs API methods
 */
export const omkDocsApi = {
  ...documentsApi,

  // Document requests (inbox)
  getRequests: () => crud.get('/api/documents/requests'),

  // Document actions
  upload: (formData) => crud.upload('/api/documents/upload', formData),
  validateUpload: (data) => crud.post('/api/documents/validate-upload', data),
  requestSign: (data) => crud.post('/api/documents/request-sign', data),
  sign: (data) => crud.post('/api/documents/sign', data),
  signBatch: (data) => crud.post('/api/documents/sign-batch', data),
  reject: (data) => crud.post('/api/documents/reject', data),

  // Admin
  getAdminDocuments: () => crud.get('/api/documents/admin'),

  // Validation
  validateDocument: (checksum) => crud.get(`/api/documents/validate-${checksum}`),

  // Users (for signers)
  getUsers: (params) => crud.get('/api/users', { params }),
};

export default omkDocsApi;
