/**
 * Reimbursement API endpoints
 * 
 * Provides methods for reimbursement management
 */
import { crud, createResourceApi } from '~/utils/crud';

// Keep backward compatibility with string constants
export const REIMBURSEMENT_API = {
  GET_REIMBURSEMENTS: '/api/reimbursements',
  GET_MY_REIMBURSEMENTS: '/api/reimbursements/my',
  CREATE_REIMBURSEMENT: '/api/reimbursements',
  APPROVE_REIMBURSEMENT: (id) => `/api/reimbursements/${id}/approve`,
  COMPLETE_REIMBURSEMENT: (id) => `/api/reimbursements/${id}/complete`,
  GET_RECEIPT: (id) => `/api/reimbursements/${id}/receipt`,
};

// Resource-based API
export const reimbursementsApi = createResourceApi('/api/reimbursements');

/**
 * Custom Reimbursement API methods
 */
export const reimbursementApi = {
  ...reimbursementsApi,

  // Custom endpoints
  getMyReimbursements: () => crud.get('/api/reimbursements/my'),
  approve: (id, data) => crud.put(`/api/reimbursements/${id}/approve`, data),
  complete: (id, data) => crud.put(`/api/reimbursements/${id}/complete`, data),
  getReceipt: (id) => crud.get(`/api/reimbursements/${id}/receipt`),
};

export default reimbursementApi;
