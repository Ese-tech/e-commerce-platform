const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const uri = process.env.MONGODB_URI || process.env.ATLAS_URI;
    if (!uri) {
      console.log('No MongoDB URI provided');
      return;
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid re-compilation error
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Parse request body
const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
};

module.exports = async (req, res) => {
  // CORS headers - be specific about origin for credentials
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://e-commerce-platform-vert.vercel.app',
    'https://e-commerce-platform-plum.vercel.app',
    'https://e-commerce-platform-btso.vercel.app',
    'https://e-commerce-platform-git-main-ese-techs-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  if (allowedOrigins.includes(origin) || origin?.includes('e-commerce-platform') && origin?.includes('vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';
  
  // Connect to database for all endpoints except health
  if (!url.includes('/health')) {
    await connectDB();
  }
  
  // Health check
  if (url === '/api/health' || url.endsWith('/health')) {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      url: url,
      method: req.method,
      database: isConnected
    });
  }

  // Settings
  if (url.includes('/api/admin/settings/public')) {
    return res.status(200).json({
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
  }

  // Auth Login
  if (url.includes('/api/auth/login') && req.method === 'POST') {
    try {
      const { email, password } = await parseBody(req);
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '7d' }
      );

      // Set cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`);

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === 'admin'
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error during login' });
    }
  }

  // Auth Register
  if (url.includes('/api/auth/register') && req.method === 'POST') {
    try {
      const { name, email, password, isAdmin } = await parseBody(req);
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
      }

      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Check if this is the first user or explicitly requested admin
      const userCount = await User.countDocuments();
      const role = userCount === 0 || isAdmin === true ? 'admin' : 'user';
      
      const user = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        role,
        wishlist: []
      });
      await user.save();

      return res.status(201).json({ 
        message: 'User created successfully',
        role: role,
        isAdmin: role === 'admin'
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  }

  // Auth Profile
  if (url.includes('/api/auth/profile') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  // Auth Logout
  if (url.includes('/api/auth/logout') && req.method === 'POST') {
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // Users/Wishlist endpoints
  if (url.includes('/api/users/wishlist') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      const user = await User.findById(decoded.userId).populate('wishlist');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.status(200).json(user.wishlist || []);
    } catch (error) {
      console.error('Wishlist error:', error);
      return res.status(500).json({ message: 'Error fetching wishlist' });
    }
  }

  // Cart endpoints
  if (url.includes('/api/cart') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      let cart = await Cart.findOne({ userId: decoded.userId }).populate('items.productId');
      
      if (!cart) {
        // Create empty cart if it doesn't exist
        cart = new Cart({ userId: decoded.userId, items: [], total: 0 });
        await cart.save();
      }

      return res.status(200).json({
        items: cart.items || [],
        total: cart.total || 0,
        itemCount: cart.items ? cart.items.length : 0
      });
    } catch (error) {
      console.error('Cart error:', error);
      return res.status(500).json({ message: 'Error fetching cart' });
    }
  }

  // Orders endpoints
  if (url.includes('/api/orders') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      const orders = await Order.find({ userId: decoded.userId })
        .populate('items.productId')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        orders: orders || [],
        pagination: {
          page: 1,
          limit: 10,
          total: orders ? orders.length : 0,
          pages: orders ? Math.ceil(orders.length / 10) : 0
        }
      });
    } catch (error) {
      console.error('Orders error:', error);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
  }

  // Admin Analytics
  if (url.includes('/api/admin/analytics') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      // Check if user is admin
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      // Calculate analytics
      const orders = await Order.find();
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyOrders = orders.filter(order => order.createdAt >= thisMonth);
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

      return res.status(200).json({
        totalRevenue,
        monthlyRevenue,
        totalOrders,
        monthlyOrders: monthlyOrders.length,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      });
    } catch (error) {
      console.error('Analytics error:', error);
      return res.status(500).json({ message: 'Error fetching analytics' });
    }
  }

  // Admin Users Stats
  if (url.includes('/api/admin/users/stats') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      // Check if user is admin
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const totalUsers = await User.countDocuments();
      const adminUsers = await User.countDocuments({ role: 'admin' });
      const regularUsers = totalUsers - adminUsers;

      return res.status(200).json({
        totalUsers,
        adminUsers,
        regularUsers
      });
    } catch (error) {
      console.error('User stats error:', error);
      return res.status(500).json({ message: 'Error fetching user statistics' });
    }
  }

  // Admin Orders - All Orders
  if (url.includes('/api/orders/admin/all') && req.method === 'GET') {
    try {
      const cookies = req.headers.cookie || '';
      const tokenMatch = cookies.match(/token=([^;]+)/);
      
      if (!tokenMatch) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = tokenMatch[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      // Check if user is admin
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const orders = await Order.find()
        .populate('userId', 'name email')
        .populate('items.productId')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        orders: orders || [],
        pagination: {
          page: 1,
          limit: 50,
          total: orders ? orders.length : 0,
          pages: orders ? Math.ceil(orders.length / 50) : 0
        }
      });
    } catch (error) {
      console.error('Admin orders error:', error);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
  }

  // Products endpoint
  if (url.includes('/api/products') && req.method === 'GET') {
    try {
      if (!isConnected) {
        return res.status(503).json({ message: 'Database connection unavailable' });
      }

      let products = await Product.find();
      
      // If no products exist, create some sample products
      if (!products || products.length === 0) {
        const sampleProducts = [
          {
            name: 'Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 199.99,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            stock: 50,
            featured: true
          },
          {
            name: 'Smartphone',
            description: 'Latest smartphone with advanced features',
            price: 699.99,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
            stock: 25,
            featured: true
          },
          {
            name: 'Coffee Mug',
            description: 'Ceramic coffee mug with elegant design',
            price: 24.99,
            category: 'Home & Kitchen',
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500',
            stock: 100,
            featured: false
          }
        ];

        products = await Product.insertMany(sampleProducts);
      }

      return res.status(200).json({
        products: products || [],
        total: products ? products.length : 0,
        message: products && products.length > 0 ? 'Products loaded successfully' : 'No products found'
      });
    } catch (error) {
      console.error('Products error:', error);
      return res.status(500).json({ message: 'Error fetching products' });
    }
  }

  // Default response
  res.status(404).json({
    message: 'Endpoint not found',
    endpoint: url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};