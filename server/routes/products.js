
const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Get all products with search, filter, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build query object
    let query = { isActive: true };
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Rating filter
    if (req.query.minRating) {
      query.averageRating = { $gte: parseFloat(req.query.minRating) };
    }
    
    // Sort options
    let sortOption = {};
    switch (req.query.sortBy) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'popularity':
        sortOption = { reviewCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .populate('reviews.user', 'name');
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
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

// Get product by ID with related products
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name profilePicture');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(6)
      .sort({ averageRating: -1 });
    
    res.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.userId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    product.reviews.push({ 
      user: req.user.userId, 
      rating: parseInt(rating),
      comment 
    });
    
    await product.save();
    await product.populate('reviews.user', 'name profilePicture');
    
    res.status(201).json({ 
      message: 'Review added successfully',
      product 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit a review
router.put('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    review.rating = parseInt(rating);
    review.comment = comment;
    
    await product.save();
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a review
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    product.reviews.pull(req.params.reviewId);
    await product.save();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
