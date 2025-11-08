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
  console.log('=== ORDER ENDPOINT HIT ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('User from middleware:', req.user);
  
  try {
    console.log('=== ORDER CREATION DEBUG ===');
    console.log('User:', req.user!.userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { shippingAddress, paymentMethod, currency = 'USD', items } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      console.log('Missing required fields');
      res.status(400).json({ message: 'Missing required fields: shippingAddress and paymentMethod' });
      return;
    }
    
    // Validate shipping address structure
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.zipCode || !shippingAddress.country) {
      console.log('Invalid shipping address structure:', shippingAddress);
      res.status(400).json({ message: 'Invalid shipping address. All fields are required.' });
      return;
    }
    
    console.log('Looking for existing cart...');
    let cart = await Cart.findOne({ user: req.user!.userId })
      .populate('items.product');
    
    console.log('Found cart:', cart ? `Cart with ${cart.items.length} items` : 'No cart found');
    
    // If no cart exists or cart is empty, but we have items from frontend
    if ((!cart || cart.items.length === 0) && items && items.length > 0) {
      console.log('Creating cart from frontend items...');
      
      if (!cart) {
        cart = new Cart({ user: req.user!.userId, items: [] });
      }
      
      // Validate and add items from frontend to backend cart
      for (const item of items) {
        console.log('Processing item:', item);
        const productId = item.product._id || item.product;
        const product = await Product.findById(productId);
        
        if (!product) {
          console.log('Product not found:', productId);
          res.status(400).json({ message: `Product not found: ${productId}` });
          return;
        }
        
        if (product.stock < item.quantity) {
          console.log('Insufficient stock for:', product.name);
          res.status(400).json({ 
            message: `Insufficient stock for ${product.name}` 
          });
          return;
        }
        
        cart.items.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });
      }
      
      console.log('Saving cart...');
      await cart.save();
      await cart.populate('items.product');
      console.log('Cart saved successfully');
    }
    
    if (!cart || cart.items.length === 0) {
      console.log('Cart is still empty after processing');
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }
    
    console.log('Validating stock for cart items...');
    // Validate stock availability
    for (const item of cart.items) {
      const product = item.product as any;
      if (!product) {
        console.log('Product not found in cart item');
        res.status(400).json({ message: 'Product not found in cart' });
        return;
      }
      if (product.stock < item.quantity) {
        console.log('Insufficient stock during final check:', product.name);
        res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
        return;
      }
    }
    
    console.log('Calculating totals...');
    // Calculate totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    console.log('Totals:', { subtotal, tax, shipping, total });
    
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
    
    console.log('Order items:', orderItems);
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create order
    const orderData = {
      user: req.user!.userId,
      orderNumber,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      currency,
    };
    
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const order = new Order(orderData);
    
    console.log('Saving order...');
    await order.save();
    
    console.log('Order saved successfully:', order._id);
    
    // Update product stock
    console.log('Updating product stock...');
    for (const item of cart.items) {
      const product = item.product as any;
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart
    console.log('Clearing cart...');
    cart.items = [];
    await cart.save();
    
    console.log('=== ORDER CREATION SUCCESS ===');
    res.status(201).json(order);
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
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

// Admin routes (must be before the generic routes)
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

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('=== UPDATE ORDER STATUS ===');
    console.log('Order ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { status, trackingNumber, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log('Order not found');
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    console.log('Current order status:', order.status);
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    
    await order.save();
    console.log('Order updated successfully');
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
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

// Cancel order
router.put('/:id/cancel', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const userId = req.user!.userId;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== userId && !req.user!.isAdmin) {
      res.status(403).json({ message: 'Not authorized to cancel this order' });
      return;
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      res.status(400).json({ message: 'Order is already cancelled' });
      return;
    }

    if (order.status === 'delivered') {
      res.status(400).json({ message: 'Cannot cancel delivered orders' });
      return;
    }

    if (order.status === 'shipped') {
      res.status(400).json({ message: 'Cannot cancel shipped orders. Please contact support.' });
      return;
    }

    // Cancel the order
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
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