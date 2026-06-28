import './src/config/db.js';
import bcrypt from 'bcryptjs';
import User from './src/models/user.model.js';
setTimeout(async () => {
  const hash = await bcrypt.hash('Admin1234', 10);
  await User.create({ firstName: 'Admin', lastName: 'User', email: 'admin@amc.com', password: hash, role: 'admin' });
  console.log('Admin created successfully');
  process.exit(0);
}, 3000);
