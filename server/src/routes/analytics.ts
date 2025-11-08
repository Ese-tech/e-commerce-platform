import express, { Response } from 'express';
import { protect, admin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

const router = express.Router();

// Get analytics data
router.get('/', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get overview statistics
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      recentCustomers
    ] = await Promise.all([
      // Total revenue from delivered orders
      Order.aggregate([
        { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      // Total orders count
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      
      // Total customers count
      User.countDocuments({ isAdmin: false, createdAt: { $gte: startDate } }),
      
      // Total products count
      Product.countDocuments({ isActive: true }),
      
      // Previous period orders for growth calculation
      Order.countDocuments({ 
        createdAt: { 
          $gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
          $lt: startDate 
        } 
      }),
      
      // Previous period customers for growth calculation
      User.countDocuments({ 
        isAdmin: false,
        createdAt: { 
          $gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
          $lt: startDate 
        } 
      })
    ]);

    // Calculate growth percentages
    const currentRevenue = totalRevenue[0]?.total || 0;
    
    // Get previous period revenue for growth calculation
    const prevPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousRevenue = await Order.aggregate([
      { 
        $match: { 
          status: 'delivered', 
          createdAt: { $gte: prevPeriodStart, $lt: startDate } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const prevRevenue = previousRevenue[0]?.total || 0;
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersGrowth = recentOrders > 0 ? ((totalOrders - recentOrders) / recentOrders) * 100 : 0;
    const customersGrowth = recentCustomers > 0 ? ((totalCustomers - recentCustomers) / recentCustomers) * 100 : 0;

    // Get monthly sales data
    const salesByMonth = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } // This year
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const salesData = monthNames.map((month, index) => {
      const data = salesByMonth.find(item => item._id === index + 1);
      return {
        month,
        revenue: data?.revenue || 0,
        orders: data?.orders || 0
      };
    });

    // Get top products
    const topProducts = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          sold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusData = ordersByStatus.map(item => ({
      status: item._id,
      count: item.count
    }));

    // Get recent activity
    const recentActivity = await Order.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          type: { $literal: 'order' },
          description: {
            $concat: [
              'New order #',
              '$orderNumber',
              ' placed by ',
              { $arrayElemAt: ['$userInfo.name', 0] }
            ]
          },
          timestamp: '$createdAt',
          amount: '$total'
        }
      }
    ]);

    const analyticsData = {
      overview: {
        totalRevenue: currentRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        customersGrowth: Math.round(customersGrowth * 10) / 10
      },
      salesByMonth: salesData,
      topProducts,
      ordersByStatus: statusData,
      recentActivity
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

export default router;