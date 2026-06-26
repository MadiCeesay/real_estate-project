// ── Standardized API response helpers ────────────────────────────────────────
// All controllers use these instead of calling res.json() directly.
// This guarantees every response has the same shape: { success, message, data }

export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = (res, data = {}, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

export const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1,
    },
  });
};

export const sendError = (res, message = 'Something went wrong', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// ── Async handler wrapper ─────────────────────────────────────────────────────
// Wraps async controller functions so we don't need try/catch in every one.
// Uncaught errors are passed to the global error handler automatically.
// Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
