import { config } from '../config/env.js';

// ── Custom error class ───────────────────────────────────────────────────────
// Throw this anywhere in the app for a clean, structured error response.
// Example: throw new AppError('Property not found', 404)
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks known/expected errors vs bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Not Found handler — catches requests to undefined routes ─────────────────
export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// ── Global error handler — last middleware in chain ──────────────────────────
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose: bad ObjectId (e.g. /property/not-an-id) ───────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: duplicate key (e.g. email already registered) ─────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // ── Mongoose: validation error ───────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // ── JWT errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired.';
  }

  // ── CORS error ────────────────────────────────────────────────────────────
  if (err.message?.startsWith('CORS blocked')) {
    statusCode = 403;
    message = err.message;
  }

  // ── Multer: file too large ────────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 10MB.';
  }

  // ── Log unexpected errors (not operational) ───────────────────────────────
  if (!err.isOperational) {
    console.error('🔴  Unexpected error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development — never in production
    ...(config.isDev && { stack: err.stack }),
  });
};
