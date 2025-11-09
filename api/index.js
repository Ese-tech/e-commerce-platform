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
  createdAt: { type: Date, default: Date.now }
});

// Avoid re-compilation error
const User = mongoose.models.User || mongoose.model('User', userSchema);

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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
          role: user.role
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
      const { name, email, password } = await parseBody(req);
      
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
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      return res.status(201).json({ message: 'User created successfully' });
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

  // Products endpoint
  if (url.includes('/api/products') && req.method === 'GET') {
    return res.status(200).json({
      products: [],
      message: 'Product system loading...'
    });
  }

  // Default response
  res.status(404).json({
    message: 'Endpoint not found',
    endpoint: url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};