const TokenService = require("../utils/tokenService");
const { AuthenticationError, AuthorizationError } = require("../utils/errors");
const logger = require("../utils/logger");

// Authentication middleware - verifies JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new AuthenticationError("No token provided");
    }

    const decoded = TokenService.verifyAccessToken(token);
    if (!decoded) {
      throw new AuthenticationError("Invalid or expired token");
    }

    // In production, fetch user from DB to ensure account still exists
    // For now, attach decoded data to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
      code: "AUTH_ERROR",
    });
  }
};

// Authorization middleware - checks user roles
const authorize = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_ERROR",
      });
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by user ${req.user.id} to ${req.path}`,
      );
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        code: "PERMISSION_ERROR",
      });
    }

    next();
  };
};

// Permission-based authorization (fine-grained)
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_ERROR",
      });
    }

    // Map roles to permissions
    const rolePermissions = {
      admin: ["*"], // Admin has all permissions
      user: ["order:read", "book:read", "review:write", "profile:update"],
      guest: ["book:read"],
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    const hasPermission =
      userPermissions.includes("*") || userPermissions.includes(permission);

    if (!hasPermission) {
      logger.warn(`Permission denied for user ${req.user.id}: ${permission}`);
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${permission}`,
        code: "PERMISSION_ERROR",
      });
    }

    next();
  };
};

// Optional authentication - doesn't require token but loads user if present
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = TokenService.verifyAccessToken(token);
      if (decoded) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
  } catch (error) {
    logger.debug(`Optional auth skipped: ${error.message}`);
  }

  next();
};

// Extract token from Authorization header or cookies
const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

module.exports = {
  authenticate,
  authorize,
  requirePermission,
  optionalAuth,
  extractToken,
};
