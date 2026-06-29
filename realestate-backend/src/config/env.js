import dotenv from 'dotenv';

dotenv.config();

// ── Validate all required env vars are present ──────────────────────────────
// This runs at startup. If anything is missing, the server refuses to start.
// This prevents silent failures where a missing key causes a runtime crash later.

const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GOOGLE_MAPS_API_KEY',
  'ANTHROPIC_API_KEY',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'FRONTEND_URL',
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('\n  Missing required environment variables:');
  missing.forEach((key) => console.error(`   • ${key}`));
  console.error('\n   Copy .env.example → .env and fill in all values.\n');
  process.exit(1);
}

// ── Export typed config object ───────────────────────────────────────────────
// All env access goes through here — no raw process.env scattered in the codebase.

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  isDev: process.env.NODE_ENV !== 'production',

  db: {
    uri: process.env.MONGODB_URI,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '5m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '4d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },

   anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};
