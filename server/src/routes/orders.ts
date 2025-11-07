import express, { Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { protect, admin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// Get user's orders
router.get('/', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.user!.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('items.product', 'name images');
    
    const total = await Order.countDocuments({ user: req.user!.userId });
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get specific order
router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images description');
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user!.userId && !req.user!.isAdmin) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Create order from cart
router.post('/create', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, currency = 'USD' } = req.body;
    
    const cart = await Cart.findOne({ user: req.user!.userId })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }
    
    // Validate stock availability
    for (const item of cart.items) {
      const product = item.product as any;
      if (product.stock < item.quantity) {
        res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
        return;
      }
    }
    
    // Calculate totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    // Create order items with product snapshots
    const orderItems = cart.items.map(item => {
      const product = item.product as any;
      return {
        product: product._id,
        name: product.name,
        price: item.price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || '',
      };
    });
    
    const order = new Order({
      user: req.user!.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      currency,
    });
    
    await order.save();
    
    // Update product stock
    for (const item of cart.items) {
      const product = item.product as any;
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Test route for order creation without authentication (for testing only)
router.post('/test-create', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, currency = 'USD' } = req.body;
    
    // Mock cart data for testing with proper ObjectIds
    const mockCartItems = [
      {
        product: new mongoose.Types.ObjectId(),
        name: 'Smart Home Security Camera',
        price: 127.49,
        quantity: 1,
        image: '/api/placeholder/400/400',
      },
      {
        product: new mongoose.Types.ObjectId(),
        name: 'Organic Face Moisturizer',
        price: 29.74,
        quantity: 1,
        image: '/api/placeholder/400/400',
      }
    ];
    
    const subtotal = 157.23;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    const order = new Order({
      user: new mongoose.Types.ObjectId(),
      items: mockCartItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      currency,
      // Explicitly set orderNumber to avoid pre-save hook issues
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
    
    await order.save();
    
    res.status(201).json({
      message: 'Test order created successfully',
      order: order
    });
  } catch (error) {
    console.error('Test order creation error:', error);
    res.status(500).json({ 
      message: (error as Error).message,
      error: error 
    });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, trackingNumber, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Track order
router.get('/:orderNumber/track', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber 
    }).select('orderNumber status trackingNumber estimatedDelivery createdAt');
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      orderDate: order.createdAt,
      timeline: getOrderTimeline(order.status),
    };
    
    res.json(trackingInfo);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Admin: Get all orders
router.get('/admin/all', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    let query: any = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name email')
      .populate('items.product', 'name');
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

function getOrderTimeline(status: string): Array<{ step: string; completed: boolean }> {
  const timeline = [
    { step: 'Order Placed', completed: true },
    { step: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
    { step: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
    { step: 'Delivered', completed: status === 'delivered' },
  ];
  
  if (status === 'cancelled') {
    timeline.push({ step: 'Cancelled', completed: true });
  }
  
  return timeline;
}

export default router;