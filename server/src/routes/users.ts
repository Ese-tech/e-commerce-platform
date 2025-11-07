import express, { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId)
      .select('-password')
      .populate('wishlist', 'name price images averageRating');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update user profile
router.put('/profile', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, address, preferences } = req.body;
    
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    const updatedUser = await User.findById(req.user!.userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Upload profile picture (placeholder for Cloudinary integration)
router.post('/profile/picture', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // This is a placeholder - in a real app, you'd integrate with Cloudinary
    // For now, we'll accept a URL in the request body
    const { imageUrl, publicId } = req.body;
    
    if (!imageUrl) {
      res.status(400).json({ message: 'Image URL is required' });
      return;
    }
    
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    user.profilePicture = {
      url: imageUrl,
      publicId: publicId || '',
    };
    
    await user.save();
    
    res.json({ 
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture 
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get wishlist
router.get('/wishlist', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId)
      .populate('wishlist', 'name price images averageRating category stock');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Add to wishlist
router.post('/wishlist/:productId', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (user.wishlist.includes(productId as any)) {
      res.status(400).json({ message: 'Product already in wishlist' });
      return;
    }
    
    user.wishlist.push(productId as any);
    await user.save();
    
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Remove from wishlist
router.delete('/wishlist/:productId', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );
    
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Change password
router.put('/password', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;