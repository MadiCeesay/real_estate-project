import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, {
      // These options prevent deprecation warnings and ensure stable connections
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    });

    console.log(`  MongoDB connected: ${conn.connection.host}`);

    // ── Graceful shutdown hooks ──────────────────────────────────────────────
    // When Render shuts down your container, close the DB connection cleanly
    // instead of leaving orphaned connections open in the Atlas pool.
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed (SIGINT)');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed (SIGTERM)');
      process.exit(0);
    });
  } catch (error) {
    console.error('  MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ── Connection event listeners (useful in dev for debugging) ─────────────────
mongoose.connection.on('disconnected', () => {
  console.warn('  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log(' MongoDB reconnected');
});
