/**
 * Middleware to check if the user has the required role.
 * Assumes that the user object is attached to req.user by previous auth middleware.
 *
 * @param {string[]} allowedRoles - Array of allowed role names (e.g., ['SUPER_ADMIN', 'ADMIN'])
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Handle role being an object (with name property) or a string
    const userRole = req.user.role?.name || req.user.role;

    if (
      !userRole ||
      (!allowedRoles.includes(userRole) && userRole !== "SUPER_ADMIN")
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

module.exports = checkRole;
