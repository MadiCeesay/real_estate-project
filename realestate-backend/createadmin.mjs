import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import User from './src/models/User.js';

const email = process.argv[2] || 'admin@amc.com';
const password = process.argv[3] || 'Admin1234';

try {
  await mongoose.connect(config.mongodb.uri);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    process.exit(0);
  }

  await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email,
    password,
    role: 'admin',
  });

  console.log(`Admin created successfully: ${email}`);
  process.exit(0);
} catch (err) {
  console.error('Failed to create admin:', err.message);
  process.exit(1);
}
