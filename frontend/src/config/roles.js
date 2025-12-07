export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    canManageUsers: true,
    canManageFinance: true,
    canSignDocs: true,
    canRequestDocs: true,
    canViewDashboard: true,
  },
  [ROLES.ADMIN]: {
    canManageUsers: false,
    canManageFinance: true,
    canSignDocs: true,
    canRequestDocs: true,
    canViewDashboard: true,
  },
  [ROLES.MEMBER]: {
    canManageUsers: false,
    canManageFinance: false,
    canSignDocs: false,
    canRequestDocs: true,
    canViewDashboard: true,
  },
};

export const hasPermission = (userRole, permission) => {
  const roleName = userRole?.name || userRole;
  if (!roleName || !ROLE_PERMISSIONS[roleName]) return false;
  return ROLE_PERMISSIONS[roleName][permission] || false;
};
