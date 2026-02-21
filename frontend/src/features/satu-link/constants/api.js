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
