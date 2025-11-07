const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('wishlist', 'name price images averageRating');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile picture (placeholder for Cloudinary integration)
router.post('/profile/picture', protect, async (req, res) => {
  try {
    // This is a placeholder - in a real app, you'd integrate with Cloudinary
    // For now, we'll accept a URL in the request body
    const { imageUrl, publicId } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
    res.status(500).json({ message: error.message });
  }
});

// Get wishlist
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist', 'name price images averageRating category stock');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );
    
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const bcrypt = require('bcryptjs');
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;