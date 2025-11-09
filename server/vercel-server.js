const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://e-commerce-platform-plum.vercel.app',
    'https://e-commerce-platform-btso.vercel.app',
    'https://e-commerce-platform-vert.vercel.app',
    'https://e-commerce-platform-git-main-ese-techs-projects.vercel.app',
    /https:\/\/e-commerce-platform-.*\.vercel\.app$/
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
    mongo: !!process.env.MONGODB_URI
  });
});

// Basic endpoints for initial testing
app.get('/api/admin/settings/public', (req, res) => {
  res.json({
    general: {
      storeName: process.env.STORE_NAME || 'ShopHub',
      storeDescription: 'Your shopping destination',
      contactEmail: process.env.CONTACT_EMAIL || 'info@shophub.com',
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

// Basic auth endpoints
app.post('/api/auth/login', (req, res) => {
  res.status(501).json({ 
    message: 'Authentication system currently unavailable in production. Please try again later.',
    debug: 'Module loading issue'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.status(501).json({ 
    message: 'Registration system currently unavailable in production. Please try again later.',
    debug: 'Module loading issue'
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

// Basic product endpoints
app.get('/api/products', (req, res) => {
  res.json({ 
    products: [], 
    message: 'Product system currently unavailable in production',
    debug: 'Module loading issue'
  });
});

// Catch all for API routes
app.all('/api/*', (req, res) => {
  res.status(503).json({
    message: 'Service temporarily unavailable',
    endpoint: req.path,
    method: req.method,
    debug: 'Full system loading in progress'
  });
});

// Connect to MongoDB (optional, don't block startup)
const uri = process.env.ATLAS_URI || process.env.MONGODB_URI;
if (uri) {
  mongoose.connect(uri)
    .then(() => {
      console.log("MongoDB database connection established successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      // Don't exit, let API work without DB for now
    });
} else {
  console.log("MongoDB URI not configured, running without database");
}

// Export for Vercel
module.exports = app;