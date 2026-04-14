// Role-Based Access Control (RBAC) middleware
// Usage: authorize("admin") or authorize("student", "admin")
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // auth middleware must run before this — req.user should exist
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized for this resource. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
