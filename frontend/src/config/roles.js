export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  KOORDINATOR_INVENTARIS: "KOORDINATOR_INVENTARIS",
  MEMBER: "MEMBER",
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    isSuperAdmin: true,
    canManageUsers: true,
    canManageFinance: true,
    canSignDocs: true,
    canRequestDocs: true,
    canViewDashboard: true,
    canManageInventory: true,
    canApproveLoans: true,
    canViewAllLoans: true,
    canRequestLoans: true,
  },
  [ROLES.ADMIN]: {
    canManageUsers: false,
    canManageFinance: true,
    canSignDocs: true,
    canRequestDocs: true,
    canViewDashboard: true,
    canManageInventory: true,
    canApproveLoans: true,
    canViewAllLoans: true,
    canRequestLoans: true,
  },
  [ROLES.KOORDINATOR_INVENTARIS]: {
    canManageUsers: false,
    canManageFinance: false,
    canSignDocs: false,
    canRequestDocs: true,
    canViewDashboard: true,
    canManageInventory: true,
    canApproveLoans: true,
    canViewAllLoans: true,
    canRequestLoans: true,
  },
  [ROLES.MEMBER]: {
    canManageUsers: false,
    canManageFinance: false,
    canSignDocs: false,
    canRequestDocs: true,
    canViewDashboard: true,
    canManageInventory: false,
    canApproveLoans: false,
    canViewAllLoans: false,
    canRequestLoans: true,
  },
};

export const hasPermission = (userRole, permission) => {
  const roleName = userRole?.name || userRole;
  if (!roleName || !ROLE_PERMISSIONS[roleName]) return false;
  return ROLE_PERMISSIONS[roleName][permission] || false;
};
