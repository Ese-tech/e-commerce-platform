import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

// Load environment variables
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shophub.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@shophub.com',
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@shophub.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();