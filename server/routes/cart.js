const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images stock');
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    let cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price; // Update price in case it changed
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.json({ message: 'Cart is already empty' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;