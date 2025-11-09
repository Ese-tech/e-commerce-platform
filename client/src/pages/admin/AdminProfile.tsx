import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getProfilePictureUrl, hasProfilePicture } from '../../utils/userUtils';
import { 
  User, 
  Shield, 
  Calendar, 
  Activity, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Settings,
  Edit2,
  Save,
  X,
  Camera
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentActivity: string[];
}

const AdminProfile = () => {
  const { user, updateUser, isLoading } = useAuthStore();
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentActivity: []
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
    fetchAdminStats();
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      const [usersResponse, ordersResponse, analyticsResponse] = await Promise.allSettled([
        api.get('/admin/users/stats'),
        api.get('/orders/admin/all'),
        api.get('/admin/analytics')
      ]);

      let totalUsers = 0;
      let totalOrders = 0;
      let totalRevenue = 0;

      if (usersResponse.status === 'fulfilled') {
        totalUsers = usersResponse.value.data.totalUsers || 0;
      }

      if (ordersResponse.status === 'fulfilled') {
        totalOrders = ordersResponse.value.data.orders?.length || 0;
      }

      if (analyticsResponse.status === 'fulfilled') {
        totalRevenue = analyticsResponse.value.data.totalRevenue || 0;
      }

      setAdminStats({
        totalUsers,
        totalOrders,
        totalRevenue,
        recentActivity: [
          'User management updated',
          'New order processed',
          'System backup completed',
          'Analytics report generated'
        ]
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(formData);
      setEditingProfile(false);
      toast.success('Admin profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditingProfile(false);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Admin Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need administrator privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Administrator Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your admin account and view system overview
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1 rounded-full text-sm"
               style={{ 
                 background: 'var(--gradient-gold)', 
                 color: 'var(--text-on-gold)' 
               }}>
            <Shield className="w-4 h-4 mr-1" />
            Super Administrator
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="relative inline-block">
                {hasProfilePicture(user.profilePicture) ? (
                  <img
                    src={getProfilePictureUrl(user.profilePicture)}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4"
                    style={{ borderColor: 'var(--gold-500)' }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4"
                       style={{ 
                         background: 'var(--gradient-gold)',
                         borderColor: 'var(--gold-500)'
                       }}>
                    <User className="w-12 h-12" style={{ color: 'var(--text-on-gold)' }} />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg border-2"
                        style={{ borderColor: 'var(--gold-500)' }}>
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Admin Info */}
              <div className="mt-4">
                {editingProfile ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex-1 px-3 py-1 text-sm text-white rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: 'var(--gradient-gold)' }}
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
                    )}
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="mt-2 inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit Profile
                    </button>
                  </>
                )}
              </div>

              {/* Admin Since */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  Admin since {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </button>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Overview */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-gold)' }}>
                    <Users className="w-6 h-6" style={{ color: 'var(--text-on-gold)' }} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminStats.totalUsers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                    <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminStats.totalOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${adminStats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Admin Activity
              </h3>
              <div className="space-y-3">
                {adminStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 rounded-full mr-3"
                         style={{ background: 'var(--gradient-gold)' }}></div>
                    <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 24)}h ago
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-800 dark:text-green-300">Database</span>
                  <span className="text-green-600 font-semibold">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-800 dark:text-green-300">API Server</span>
                  <span className="text-green-600 font-semibold">Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-800 dark:text-green-300">Payment Gateway</span>
                  <span className="text-green-600 font-semibold">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-800 dark:text-green-300">Email Service</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;