
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');
const paymentRoutes = require('./routes/payments');

const app = express();
const port = process.env.PORT || 5000;

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

const uri = process.env.ATLAS_URI || process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MongoDB URI is required');
}

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

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
