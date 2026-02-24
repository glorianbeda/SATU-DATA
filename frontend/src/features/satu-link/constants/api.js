/**
 * Satu Link API endpoints
 * 
 * Provides methods for link shortener and link tree management
 */
import { crud, createResourceApi } from '~/utils/crud';

// Keep backward compatibility with string constants
export const SATU_LINK_API = {
  // Admin - Short Links
  GET_ADMIN_SHORT_LINKS: "/api/satu-link/admin/short-links",
  CREATE_ADMIN_SHORT_LINK: "/api/satu-link/admin/short-links",
  UPDATE_ADMIN_SHORT_LINK: (id) => `/api/satu-link/admin/short-links/${id}`,
  DELETE_ADMIN_SHORT_LINK: (id) => `/api/satu-link/admin/short-links/${id}`,

  // Admin - Link Trees
  GET_ADMIN_LINK_TREES: "/api/satu-link/admin/link-trees",

  // Member - Short Links
  GET_MY_SHORT_LINKS: "/api/satu-link/my/short-links",
  CREATE_MY_SHORT_LINK: "/api/satu-link/my/short-links",
  UPDATE_MY_SHORT_LINK: (id) => `/api/satu-link/my/short-links/${id}`,
  DELETE_MY_SHORT_LINK: (id) => `/api/satu-link/my/short-links/${id}`,

  // Member - Link Tree
  GET_MY_LINK_TREE: "/api/satu-link/my/link-tree",
  FIX_LINK_TREE_TITLE: "/api/satu-link/my/link-tree/fix-title",
  UPDATE_MY_LINK_TREE: "/api/satu-link/my/link-tree",
  GET_MY_LINK_TREE_ITEMS: "/api/satu-link/my/link-tree/items",
  CREATE_MY_LINK_TREE_ITEM: "/api/satu-link/my/link-tree/items",
  UPDATE_MY_LINK_TREE_ITEM: (id) => `/api/satu-link/my/link-tree/items/${id}`,
  DELETE_MY_LINK_TREE_ITEM: (id) => `/api/satu-link/my/link-tree/items/${id}`,
  REORDER_MY_LINK_TREE_ITEMS: "/api/satu-link/my/link-tree/items/reorder",

  // Public
  GET_PUBLIC_LINK_TREE: (username) => `/satu-link/u/${username}`,
  REDIRECT_SHORT_LINK: (code) => `/satu-link/s/${code}`,
};

// Resource-based APIs
export const shortLinksApi = createResourceApi('/api/satu-link/my/short-links');
export const linkTreeItemsApi = createResourceApi('/api/satu-link/my/link-tree/items');

/**
 * Custom Satu Link API methods
 */
export const satuLinkApi = {
  // Short Links (member)
  shortLinks: shortLinksApi,

  // Link Tree Items
  linkTreeItems: linkTreeItemsApi,

  // Link Tree
  getMyLinkTree: () => crud.get('/api/satu-link/my/link-tree'),
  updateMyLinkTree: (data) => crud.put('/api/satu-link/my/link-tree', data),
  fixLinkTreeTitle: (data) => crud.post('/api/satu-link/my/link-tree/fix-title', data),
  reorderLinkTreeItems: (data) => crud.put('/api/satu-link/my/link-tree/items/reorder', data),

  // Admin - Short Links
  getAdminShortLinks: () => crud.get('/api/satu-link/admin/short-links'),
  createAdminShortLink: (data) => crud.post('/api/satu-link/admin/short-links', data),
  updateAdminShortLink: (id, data) => crud.put(`/api/satu-link/admin/short-links/${id}`, data),
  deleteAdminShortLink: (id) => crud.delete(`/api/satu-link/admin/short-links/${id}`),

  // Admin - Link Trees
  getAdminLinkTrees: () => crud.get('/api/satu-link/admin/link-trees'),

  // Public
  getPublicLinkTree: (username) => crud.get(`/satu-link/u/${username}`),
  redirectShortLink: (code) => crud.get(`/satu-link/s/${code}`),
};

export default satuLinkApi;
