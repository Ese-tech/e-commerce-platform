const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Get user's orders
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('items.product', 'name images');
    
    const total = await Order.countDocuments({ user: req.user.userId });
    
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
    res.status(500).json({ message: error.message });
  }
});

// Get specific order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images description');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order from cart
router.post('/create', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.name}` 
        });
      }
    }
    
    // Calculate totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    // Create order items with product snapshots
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images?.[0]?.url || '',
    }));
    
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
    });
    
    await order.save();
    
    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, trackingNumber, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track order
router.get('/:orderNumber/track', async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber 
    }).select('orderNumber status trackingNumber estimatedDelivery createdAt');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    let query = {};
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
    res.status(500).json({ message: error.message });
  }
});

function getOrderTimeline(status) {
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

module.exports = router;