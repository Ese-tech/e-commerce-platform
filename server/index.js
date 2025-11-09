
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration for both development and production
const corsOrigins = [
  process.env.CLIENT_URL || 'https://e-commerce-platform-vert.vercel.app',
  'https://e-commerce-platform-plum.vercel.app',
  'https://e-commerce-platform-btso.vercel.app',
  'https://e-commerce-platform-vert.vercel.app',
  'https://e-commerce-platform-git-main-ese-techs-projects.vercel.app',
  /https:\/\/e-commerce-platform-.*\.vercel\.app$/
];

// Add local development origins if in development mode
if (process.env.NODE_ENV === 'development') {
  corsOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check first - before database connection
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    mongo: !!process.env.MONGODB_URI
  });
});

const uri = process.env.ATLAS_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error('MongoDB URI is missing!');
} else {
  mongoose.connect(uri)
    .then(() => {
      console.log("MongoDB database connection established successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      // Don't exit, let other routes work
    });
}

// Try to load routes - if they fail, provide fallbacks
try {
  const authRoutes = require('./dist/routes/auth');
  const productRoutes = require('./dist/routes/products');
  const cartRoutes = require('./dist/routes/cart');
  const orderRoutes = require('./dist/routes/orders');
  const userRoutes = require('./dist/routes/users');
  const settingsRoutes = require('./dist/routes/settings');
  const paymentRoutes = require('./dist/routes/payments');

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin/settings', settingsRoutes);
  app.use('/api/payments', paymentRoutes);
  
  console.log('All routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error.message);
  
  // Fallback routes
  app.get('/api/admin/settings/public', (req, res) => {
    res.json({
      general: {
        storeName: 'ShopHub',
        storeDescription: 'Your shopping destination',
        contactEmail: 'info@shophub.com',
        phone: '+49 (40) 123-4567',
        address: {
          street: 'Musterstraße 123',
          city: 'Hamburg',
          state: 'Hamburg',
          zipCode: '20095',
          country: 'Deutschland'
        },
        timezone: 'Europe/Berlin',
        currency: 'EUR',
        language: 'de'
      }
    });
  });
  
  app.post('/api/auth/login', (req, res) => {
    res.status(500).json({ message: 'Authentication system loading...' });
  });
  
  app.get('/api/auth/profile', (req, res) => {
    res.status(401).json({ message: 'Not authenticated' });
  });
  
  app.get('/api/products', (req, res) => {
    res.json({ products: [], message: 'Product system loading...' });
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
