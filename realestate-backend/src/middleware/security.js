import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

// ── 1. Helmet — sets secure HTTP headers ────────────────────────────────────
// Prevents clickjacking, XSS, MIME sniffing, and more with a single call.
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'res.cloudinary.com', '*.googleapis.com'],
      connectSrc: ["'self'", "https://realestate-backend-jauj.onrender.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Needed for Google Maps embeds
});

// ── 2. CORS — only your Vercel frontend can call this API ────────────────────
// In development: http://localhost:3000 is allowed.
// In production: only FRONTEND_URL is allowed. Any other origin gets blocked.
const allowedOrigins = [
  config.cors.frontendUrl,
  'https://euphonious-flan-2cefd1.netlify.app',
  'https://amc-real-estate-project.netlify.app',
  ...(config.isDev ? ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5508'] : []),
];


export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow server-to-server calls (no origin header) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    }
  },
  credentials: true, // Allow cookies (used for refresh tokens)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// ── 3. General rate limiter — applied to all routes ──────────────────────────
// 100 requests per 15 minutes per IP by default (configurable in .env).
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  skip: (req) => config.isDev, // Skip rate limiting in development
});

// ── 4. Auth-specific rate limiter — stricter, applied to /auth routes only ──
// 10 login/register attempts per 15 minutes prevents brute force attacks.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
  },
});

// ── 5. Upload-specific rate limiter ──────────────────────────────────────────
// 20 uploads per hour prevents abuse of Cloudinary quota.
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Upload limit reached. Please wait before uploading more images.',
  },
});
