import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';

// ── Token generation helpers ─────────────────────────────────────────────────
// Centralized here so token logic never scatters across the codebase.

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn } // Default: 15 minutes
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } // Default: 7 days
  );
};

// ── protect() — verifies JWT and attaches user to req ───────────────────────
// Usage: router.get('/me', protect, controller)
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.accessSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please refresh your session.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    // 3. Verify user still exists in DB (handles deleted/banned accounts)
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated.',
      });
    }

    // 4. Attach user to request for downstream use
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

// ── authorize(...roles) — role-based access control ─────────────────────────
// Usage: router.delete('/property/:id', protect, authorize('admin', 'agent'), controller)
// Roles: 'buyer' | 'agent' | 'admin'
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' does not have permission to access this resource.`,
      });
    }

    next();
  };
};

// ── optionalAuth — attaches user if token present, continues if not ──────────
// Used for public routes that behave differently for logged-in users
// e.g. property listings show a heart icon only if user is logged in
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
};
