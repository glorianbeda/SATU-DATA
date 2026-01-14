export const INVENTORY_API = {
  // Categories
  GET_CATEGORIES: "/api/inventory/categories",
  CREATE_CATEGORY: "/api/inventory/categories",
  DELETE_CATEGORY: (id) => `/api/inventory/categories/${id}`,

  // Assets
  GET_ASSETS: "/api/inventory/assets",
  GET_ASSET: (id) => `/api/inventory/assets/${id}`,
  CREATE_ASSET: "/api/inventory/assets",
  UPDATE_ASSET: (id) => `/api/inventory/assets/${id}`,
  DELETE_ASSET: (id) => `/api/inventory/assets/${id}`,
  GENERATE_BARCODE: (id) => `/api/inventory/assets/${id}/generate-barcode`,
};
