import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import adminUserRoutes from './routes/adminUsers';
import analyticsRoutes from './routes/analytics';
import settingsRoutes from './routes/settings';
import paymentRoutes from './routes/payments';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
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
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler - must be last
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

export default app;