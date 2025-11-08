import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Product from '../src/models/Product';
import User from '../src/models/User';
import Order from '../src/models/Order';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.ATLAS_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI is required');
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and superior sound quality.',
    price: 299.99,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Wireless Headphones' }
    ],
    stock: 50,
    tags: ['wireless', 'audio', 'premium'],
    isActive: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and waterproof design.',
    price: 199.99,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Fitness Watch' }
    ],
    stock: 75,
    tags: ['fitness', 'smartwatch', 'health'],
    isActive: true
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 29.99,
    category: 'clothing',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Cotton T-Shirt' }
    ],
    stock: 100,
    tags: ['organic', 'cotton', 'sustainable'],
    isActive: true
  },
  {
    name: 'Professional Camera Lens',
    description: '50mm f/1.8 lens perfect for portrait photography with sharp image quality.',
    price: 449.99,
    category: 'electronics',
    images: [
      { url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64b?w=500', alt: 'Camera Lens' }
    ],
    stock: 25,
    tags: ['photography', 'lens', 'professional'],
    isActive: true
  },
  {
    name: 'Eco-Friendly Water Bottle',
    description: 'Stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    category: 'home',
    images: [
      { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', alt: 'Water Bottle' }
    ],
    stock: 80,
    tags: ['eco-friendly', 'stainless steel', 'insulated'],
    isActive: true
  },
  {
    name: 'Bestselling Novel Collection',
    description: 'A collection of three bestselling novels from award-winning authors.',
    price: 39.99,
    category: 'books',
    images: [
      { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', alt: 'Book Collection' }
    ],
    stock: 60,
    tags: ['fiction', 'bestseller', 'collection'],
    isActive: true
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning for comfortable practice.',
    price: 49.99,
    category: 'sports',
    images: [
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', alt: 'Yoga Mat' }
    ],
    stock: 45,
    tags: ['yoga', 'fitness', 'premium'],
    isActive: true
  },
  {
    name: 'Natural Face Cream',
    description: 'Moisturizing face cream with natural ingredients for all skin types.',
    price: 24.99,
    category: 'beauty',
    images: [
      { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', alt: 'Face Cream' }
    ],
    stock: 90,
    tags: ['skincare', 'natural', 'moisturizer'],
    isActive: true
  }
];

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    isActive: true,
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    isActive: true,
    phone: '+1987654321',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    isAdmin: false,
    isActive: true,
    phone: '+1555123456',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    }
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    isAdmin: false,
    isActive: false,
    phone: '+1444987654',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    // Don't delete users as we want to keep the admin user
    
    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    // Create sample users
    console.log('Creating users...');
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        await User.create({
          ...userData,
          password: hashedPassword
        });
      }
    }
    console.log('Created sample users');

    // Get users for creating orders
    const users = await User.find({ isAdmin: false }).limit(3);
    
    if (users.length > 0 && createdProducts.length > 0) {
      console.log('Creating sample orders...');
      
      const sampleOrders = [
        {
          user: users[0]._id,
          orderNumber: 'ORD-' + Date.now().toString().slice(-8) + '-1',
          items: [
            {
              product: createdProducts[0]._id.toString(),
              name: createdProducts[0].name,
              price: createdProducts[0].price,
              quantity: 1,
              image: createdProducts[0].images[0].url
            },
            {
              product: createdProducts[1]._id.toString(),
              name: createdProducts[1].name,
              price: createdProducts[1].price,
              quantity: 2,
              image: createdProducts[1].images[0].url
            }
          ],
          shippingAddress: {
            street: users[0].address?.street || '123 Main St',
            city: users[0].address?.city || 'New York',
            state: users[0].address?.state || 'NY',
            zipCode: users[0].address?.zipCode || '10001',
            country: users[0].address?.country || 'USA'
          },
          paymentMethod: 'stripe' as const,
          subtotal: createdProducts[0].price + (createdProducts[1].price * 2),
          tax: 50,
          shipping: 15,
          total: createdProducts[0].price + (createdProducts[1].price * 2) + 50 + 15,
          status: 'delivered' as const
        },
        {
          user: users[1]._id,
          orderNumber: 'ORD-' + Date.now().toString().slice(-8) + '-2',
          items: [
            {
              product: createdProducts[2]._id.toString(),
              name: createdProducts[2].name,
              price: createdProducts[2].price,
              quantity: 3,
              image: createdProducts[2].images[0].url
            }
          ],
          shippingAddress: {
            street: users[1].address?.street || '456 Oak Ave',
            city: users[1].address?.city || 'Los Angeles',
            state: users[1].address?.state || 'CA',
            zipCode: users[1].address?.zipCode || '90210',
            country: users[1].address?.country || 'USA'
          },
          paymentMethod: 'stripe' as const,
          subtotal: createdProducts[2].price * 3,
          tax: 8,
          shipping: 10,
          total: (createdProducts[2].price * 3) + 8 + 10,
          status: 'shipped' as const,
          trackingNumber: 'TRK123456789'
        },
        {
          user: users[2]._id,
          orderNumber: 'ORD-' + Date.now().toString().slice(-8) + '-3',
          items: [
            {
              product: createdProducts[3]._id.toString(),
              name: createdProducts[3].name,
              price: createdProducts[3].price,
              quantity: 1,
              image: createdProducts[3].images[0].url
            },
            {
              product: createdProducts[4]._id.toString(),
              name: createdProducts[4].name,
              price: createdProducts[4].price,
              quantity: 1,
              image: createdProducts[4].images[0].url
            }
          ],
          shippingAddress: {
            street: users[2].address?.street || '789 Pine Rd',
            city: users[2].address?.city || 'Chicago',
            state: users[2].address?.state || 'IL',
            zipCode: users[2].address?.zipCode || '60601',
            country: users[2].address?.country || 'USA'
          },
          paymentMethod: 'stripe' as const,
          subtotal: createdProducts[3].price + createdProducts[4].price,
          tax: 25,
          shipping: 12,
          total: createdProducts[3].price + createdProducts[4].price + 25 + 12,
          status: 'processing' as const
        }
      ];

      await Order.insertMany(sampleOrders);
      console.log(`Created ${sampleOrders.length} sample orders`);
    }

    console.log('Seed data creation completed!');
    console.log('Dashboard should now show real data:');
    console.log(`- Total Products: ${createdProducts.length}`);
    console.log(`- Total Users: ${await User.countDocuments()}`);
    console.log(`- Total Orders: ${await Order.countDocuments()}`);
    console.log(`- Total Revenue: $${await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]).then(result => result[0]?.total || 0)}`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();