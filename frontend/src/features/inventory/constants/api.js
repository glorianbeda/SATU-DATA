/**
 * Inventory API endpoints
 * 
 * Provides methods for inventory management (assets, loans, categories)
 */
import { crud, createResourceApi } from '~/utils/crud';

// Keep backward compatibility with string constants
export const INVENTORY_API = {
  // Categories
  GET_CATEGORIES: "/api/inventory/categories",
  CREATE_CATEGORY: "/api/inventory/categories",
  UPDATE_CATEGORY: (id) => `/api/inventory/categories/${id}`,
  DELETE_CATEGORY: (id) => `/api/inventory/categories/${id}`,

  // Assets
  GET_ASSETS: "/api/inventory/assets",
  GET_ASSET: (id) => `/api/inventory/assets/${id}`,
  CREATE_ASSET: "/api/inventory/assets",
  UPDATE_ASSET: (id) => `/api/inventory/assets/${id}`,
  DELETE_ASSET: (id) => `/api/inventory/assets/${id}`,
  UPLOAD_ASSET_IMAGE: "/api/inventory/assets/upload-image",
  GENERATE_BARCODE: (id) => `/api/inventory/assets/${id}/generate-barcode`,
  REGENERATE_BARCODE: (id) => `/api/inventory/assets/${id}/regenerate-barcode`,
  REGENERATE_QR: (id) => `/api/inventory/assets/${id}/regenerate-qr`,
  GENERATE_LABELS: "/api/inventory/labels/generate",

  // Loans
  GET_LOANS: "/api/inventory/loans",
  GET_LOAN: (id) => `/api/inventory/loans/${id}`,
  CREATE_LOAN: "/api/inventory/loans",
  DELETE_LOAN: (id) => `/api/inventory/loans/${id}`,
  UPDATE_LOAN: (id) => `/api/inventory/loans/${id}`,
  APPROVE_LOAN: (id) => `/api/inventory/loans/${id}/approve`,
  REJECT_LOAN: (id) => `/api/inventory/loans/${id}/reject`,
  BORROW_LOAN: (id) => `/api/inventory/loans/${id}/borrow`,
  RETURN_LOAN: (id) => `/api/inventory/loans/${id}/return`,
  VERIFY_RETURN: (id) => `/api/inventory/loans/${id}/verify`,

  // History
  GET_ASSET_HISTORY: (id) => `/api/inventory/history/asset/${id}`,
  GET_USER_HISTORY: (id) => `/api/inventory/history/user/${id}`,
  GET_HISTORY_USER: "/api/inventory/history/user",
};

// Resource-based APIs for cleaner usage
export const categoriesApi = createResourceApi('/api/inventory/categories');
export const assetsApi = createResourceApi('/api/inventory/assets');
export const loansApi = createResourceApi('/api/inventory/loans');
export const historyApi = createResourceApi('/api/inventory/history');

/**
 * Custom Inventory API methods
 */
export const inventoryApi = {
  // Categories
  categories: categoriesApi,

  // Assets
  assets: assetsApi,

  // Loans
  loans: loansApi,

  // History
  history: historyApi,

  // Custom endpoints
  generateLabels: (data) => crud.post('/api/inventory/labels/generate', data),
  uploadAssetImage: (formData) => crud.upload('/api/inventory/assets/upload-image', formData),
};

export default inventoryApi;
