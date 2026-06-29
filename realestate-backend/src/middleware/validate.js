import { ZodError } from 'zod';

// ── validate(schema) — wraps a Zod schema into Express middleware ─────────────
// Usage: router.post('/register', validate(registerSchema), authController.register)
//
// By default validates req.body. Pass { params: schema } or { query: schema }
// to validate URL params or query strings instead.

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = source === 'params' ? req.params
                 : source === 'query'  ? req.query
                 : req.body;

      // parse() throws ZodError on failure, returns cleaned data on success.
      // We reassign back to req so the controller gets the sanitized version.
      const parsed = schema.parse(data);

      if (source === 'params') req.params = parsed;
      else if (source === 'query') req.query = parsed;
      else req.body = parsed;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors,
        });
      }
      next(error);
    }
  };
};
