import express, { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// Get user's cart
router.get('/', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!.userId })
      .populate('items.product', 'name price images stock');
    
    if (!cart) {
      res.json({ items: [], totalAmount: 0 });
      return;
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Add item to cart
router.post('/add', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    if (product.stock < quantity) {
      res.status(400).json({ message: 'Insufficient stock' });
      return;
    }
    
    let cart = await Cart.findOne({ user: req.user!.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.user!.userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        res.status(400).json({ message: 'Insufficient stock' });
        return;
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
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update item quantity
router.put('/update', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    
    if (quantity < 1) {
      res.status(400).json({ message: 'Quantity must be at least 1' });
      return;
    }
    
    const cart = await Cart.findOne({ user: req.user!.userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }
    
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      res.status(400).json({ message: 'Insufficient stock' });
      return;
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price; // Update price in case it changed
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user!.userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!.userId });
    if (!cart) {
      res.json({ message: 'Cart is already empty' });
      return;
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;