import express from 'express';
import morgan from 'morgan';
import { helmetMiddleware, corsMiddleware, generalLimiter } from './middleware/security.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { config } from './config/env.js';

import authRoutes     from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import bookingRoutes  from './routes/booking.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import uploadRoutes   from './routes/upload.routes.js';
import agentRoutes    from './routes/agent.routes.js';

const app = express();

// ─── Middleware stack (ORDER MATTERS) ────────────────────────────────────────
app.use(helmetMiddleware);                             // 1. Security headers
app.use(corsMiddleware);                               // 2. CORS
if (config.env !== 'test') {                           // 3. Request logging
  app.use(morgan(config.isDev ? 'dev' : 'combined'));
}
app.use(express.json({ limit: '10mb' }));             // 4. Body parsers
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);                              // 5. Rate limiting

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real Estate API is running',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/v1/auth',       authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/bookings',   bookingRoutes);
app.use('/api/v1/favorites',  favoriteRoutes);
app.use('/api/v1/upload',     uploadRoutes);
app.use('/api/v1/agent',      agentRoutes);

// ─── Error handling (always last) ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
