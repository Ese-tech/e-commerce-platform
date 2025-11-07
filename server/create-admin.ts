import { connect, disconnect } from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://esemongo:Te0Pb56NYgQBYkMG@cluster0.tiarth9.mongodb.net/ecommerce';
    await connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@ecommerce.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      isAdmin: true,
      preferences: {
        notifications: true,
        currency: 'USD',
        language: 'en',
        theme: 'system'
      }
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await disconnect();
    console.log('Database connection closed');
  }
};

createAdminUser();