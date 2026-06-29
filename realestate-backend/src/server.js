// ── Config loads first — validates all env vars before anything else ──────────
import './config/env.js';

import app from './app.js';
import { connectDB } from './config/database.js';
import { config } from './config/env.js';

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas first
    await connectDB();

    // 2. Start Express only after DB is ready
    const server = app.listen(config.port, () => {
      console.log(`\n  Server running in ${config.env} mode`);
      console.log(`  Listening on port ${config.port}`);
      console.log(`  Health check: http://localhost:${config.port}/health\n`);
    });

    // ── Unhandled promise rejections ─────────────────────────────────────────
    // Catches async errors that weren't caught anywhere else.
    // Logs the error and shuts down gracefully instead of leaving the server
    // in an unknown state.
    process.on('unhandledRejection', (reason, promise) => {
      console.error(' Unhandled Promise Rejection:', reason);
      server.close(() => process.exit(1));
    });

    // ── Uncaught synchronous exceptions ─────────────────────────────────────
    process.on('uncaughtException', (error) => {
      console.error('  Uncaught Exception:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
