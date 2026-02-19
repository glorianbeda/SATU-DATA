// Reimbursement API endpoints
export const REIMBURSEMENT_API = {
  GET_REIMBURSEMENTS: '/api/reimbursements',
  GET_MY_REIMBURSEMENTS: '/api/reimbursements/my',
  CREATE_REIMBURSEMENT: '/api/reimbursements',
  APPROVE_REIMBURSEMENT: (id) => `/api/reimbursements/${id}/approve`,
  COMPLETE_REIMBURSEMENT: (id) => `/api/reimbursements/${id}/complete`,
  GET_RECEIPT: (id) => `/api/reimbursements/${id}/receipt`,
};
