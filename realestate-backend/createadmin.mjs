import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://madiCeesay:DvBkCudkvX3jKcmG@cluster0.ob4jrzc.mongodb.net/?appName=Cluster0';

await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

const hash = await bcrypt.hash('Admin1234', 10);
await User.findOneAndUpdate({ email: 'admin@amc.com' }, { password: hash, role: 'admin' });
console.log('Admin password reset successfully');
process.exit(0);
