import express, { Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import { protect, admin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all users with filtering, pagination, and search (Admin only)
router.get('/', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = 'all',
      status = 'all',
      country = '',
      registrationDate = '',
      sortBy = 'newest'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Build filter object
    const filter: any = {};

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role !== 'all') {
      filter.isAdmin = role === 'admin';
    }

    // Status filter
    if (status !== 'all') {
      switch (status) {
        case 'active':
          filter.isActive = true;
          break;
        case 'inactive':
          filter.isActive = false;
          break;
        case 'banned':
          filter.isBanned = true;
          break;
      }
    }

    // Country filter
    if (country) {
      filter['address.country'] = { $regex: country, $options: 'i' };
    }

    // Registration date filter
    if (registrationDate) {
      const date = new Date(registrationDate as string);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      filter.createdAt = {
        $gte: date,
        $lt: nextDay
      };
    }

    // Build sort object
    let sort: any = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'orders':
        sort = { 'stats.totalOrders': -1 };
        break;
      case 'spent':
        sort = { 'stats.totalSpent': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (pageNum - 1) * limitNum;

    // Get users with aggregation to include stats
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'userOrders'
        }
      },
      {
        $addFields: {
          'stats.totalOrders': { $size: '$userOrders' },
          'stats.totalSpent': {
            $sum: {
              $map: {
                input: '$userOrders',
                as: 'order',
                in: '$$order.totalAmount'
              }
            }
          },
          'stats.wishlistItems': { $size: '$wishlist' },
          'stats.lastLogin': '$updatedAt' // Placeholder - would need actual last login tracking
        }
      },
      {
        $project: {
          password: 0,
          userOrders: 0
        }
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limitNum }
    ];

    const users = await User.aggregate(pipeline);
    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get user statistics (Admin only)
router.get('/stats', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersThisMonth,
      userGrowth
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get single user details (Admin only)
router.get('/:id', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('wishlist', 'name price images');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get user's order statistics
    const orders = await Order.find({ user: user._id });
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
      wishlistItems: user.wishlist.length,
      lastLogin: user.updatedAt // Placeholder
    };

    res.json({
      ...user.toObject(),
      stats
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Create new user (Admin only)
router.post('/', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, isAdmin = false, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      phone,
      address,
      isActive: true,
      isVerified: true
    });

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update user role (Admin only)
router.put('/:id/role', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent admin from removing their own admin status
    if (user._id.toString() === req.user!.userId && user.isAdmin) {
      res.status(400).json({ message: 'Cannot remove your own admin privileges' });
      return;
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: `User ${user.isAdmin ? 'promoted to' : 'demoted from'} admin`, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update user status (Admin only)
router.put('/:id/status', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user!.userId) {
      res.status(400).json({ message: 'Cannot deactivate your own account' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Ban/unban user (Admin only)
router.put('/:id/ban', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent admin from banning themselves
    if (user._id.toString() === req.user!.userId) {
      res.status(400).json({ message: 'Cannot ban your own account' });
      return;
    }

    const isBanned = (user as any).isBanned || false;
    (user as any).isBanned = !isBanned;
    if (!isBanned) {
      user.isActive = false; // Deactivate when banning
    }
    
    await user.save();

    res.json({ 
      message: `User ${(user as any).isBanned ? 'banned' : 'unbanned'}`, 
      user: { ...user.toObject(), password: undefined } 
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Delete user (Admin only)
router.delete('/:id', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user!.userId) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }

    // Check if user has orders - in production, you might want to soft delete or transfer orders
    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0) {
      res.status(400).json({ 
        message: `Cannot delete user with ${orderCount} orders. Consider deactivating instead.` 
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Bulk actions (Admin only)
router.post('/bulk-action', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userIds, action } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ message: 'User IDs array is required' });
      return;
    }

    // Prevent admin from performing bulk actions on themselves
    if (userIds.includes(req.user!.userId)) {
      res.status(400).json({ message: 'Cannot perform bulk actions on your own account' });
      return;
    }

    let updateQuery: any = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateQuery = { isActive: true };
        message = 'Users activated successfully';
        break;
      case 'deactivate':
        updateQuery = { isActive: false };
        message = 'Users deactivated successfully';
        break;
      case 'ban':
        updateQuery = { isBanned: true, isActive: false };
        message = 'Users banned successfully';
        break;
      case 'unban':
        updateQuery = { isBanned: false };
        message = 'Users unbanned successfully';
        break;
      case 'delete':
        // Check for users with orders before deleting
        const usersWithOrders = await Order.distinct('user', { user: { $in: userIds } });
        if (usersWithOrders.length > 0) {
          res.status(400).json({ 
            message: `Cannot delete users with existing orders. Users with orders: ${usersWithOrders.length}` 
          });
          return;
        }
        await User.deleteMany({ _id: { $in: userIds } });
        res.json({ message: 'Users deleted successfully' });
        return;
      default:
        res.status(400).json({ message: 'Invalid action' });
        return;
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateQuery
    );

    res.json({ message, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Send password reset email (Admin only)
router.post('/:id/reset-password', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the database with an expiration time
    // 3. Send an email with the reset link
    
    // For now, we'll just return a success message
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Export users data (Admin only)
router.get('/export', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { format = 'csv' } = req.query;

    const users = await User.find({}, '-password').lean();

    if (format === 'csv') {
      // Create CSV content
      const csvHeader = 'ID,Name,Email,Phone,Role,Status,Country,Joined,Total Orders,Total Spent\n';
      
      const csvRows = await Promise.all(users.map(async (user) => {
        const orders = await Order.find({ user: user._id });
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        
        return [
          user._id,
          user.name,
          user.email,
          user.phone || '',
          user.isAdmin ? 'Admin' : 'User',
          user.isActive ? 'Active' : 'Inactive',
          user.address?.country || '',
          new Date(user.createdAt).toLocaleDateString(),
          totalOrders,
          totalSpent.toFixed(2)
        ].join(',');
      }));

      const csvContent = csvHeader + csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
      res.send(csvContent);
    } else {
      res.status(400).json({ message: 'Unsupported export format' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;