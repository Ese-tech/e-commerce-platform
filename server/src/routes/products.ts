import express, { Response } from 'express';
import Product from '../models/Product';
import { protect, admin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// Get all products with search, filter, sort, and pagination
router.get('/', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    
    // Build query object
    let query: any = {};
    
    // For admin requests, show all products; for regular users, only active products
    if (!req.query.admin || req.query.admin !== 'true') {
      query.isActive = true;
    }
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search as string, 'i')] } }
      ];
    }
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice as string);
    }
    
    // Rating filter
    if (req.query.minRating) {
      query.averageRating = { $gte: parseFloat(req.query.minRating as string) };
    }
    
    // Sort options
    let sortOption: any = {};
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
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get product by ID with related products
router.get('/:id', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name profilePicture');
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
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
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get product categories
router.get('/categories/list', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Add a review
router.post('/:id/reviews', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user!.userId
    );
    
    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this product' });
      return;
    }
    
    product.reviews.push({ 
      user: req.user!.userId, 
      rating: parseInt(rating),
      comment 
    } as any);
    
    await product.save();
    await product.populate('reviews.user', 'name profilePicture');
    
    res.status(201).json({ 
      message: 'Review added successfully',
      product 
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Edit a review
router.put('/:id/reviews/:reviewId', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    
    if (review.user.toString() !== req.user!.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    
    review.rating = parseInt(rating);
    review.comment = comment;
    
    await product.save();
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Delete a review
router.delete('/:id/reviews/:reviewId', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    
    if (review.user.toString() !== req.user!.userId && !req.user!.isAdmin) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    
    product.reviews.pull(req.params.reviewId);
    await product.save();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Admin routes
router.post('/', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.put('/:id', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.delete('/:id', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;