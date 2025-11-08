import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  ShieldOff,
  Ban,
  UserCheck,
  Mail,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Heart,
  Package,
  Trash2,
  Download,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    notifications: boolean;
    currency: string;
    language: string;
    theme: string;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    wishlistItems: number;
    lastLogin: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserFilters {
  search: string;
  role: 'all' | 'admin' | 'user';
  status: 'all' | 'active' | 'inactive' | 'banned';
  country: string;
  registrationDate: string;
  sortBy: 'newest' | 'oldest' | 'name' | 'orders' | 'spent';
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    country: '',
    registrationDate: '',
    sortBy: 'newest'
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
        role: filters.role,
        status: filters.status,
        country: filters.country,
        sortBy: filters.sortBy,
        ...(filters.registrationDate && { registrationDate: filters.registrationDate })
      });

      const response = await api.get(`/admin/users?${queryParams}`);
      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages,
        totalUsers: response.data.pagination.total
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      setActionLoading(userId + action);
      
      switch (action) {
        case 'toggleAdmin':
          await api.put(`/admin/users/${userId}/role`);
          toast.success('User role updated successfully');
          break;
        case 'toggleStatus':
          await api.put(`/admin/users/${userId}/status`);
          toast.success('User status updated successfully');
          break;
        case 'ban':
          await api.put(`/admin/users/${userId}/ban`);
          toast.success('User ban status updated successfully');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted successfully');
          }
          break;
        case 'sendEmail':
          // In a real application, this would open an email composer or send a template email
          toast.success('Email functionality would be implemented here');
          break;
        case 'resetPassword':
          if (window.confirm('Send password reset email to this user?')) {
            await api.post(`/admin/users/${userId}/reset-password`);
            toast.success('Password reset email sent successfully');
          }
          break;
      }
      
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error(`Error performing ${action}:`, error);
      const message = error.response?.data?.message || `Failed to ${action} user`;
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }
    
    try {
      setActionLoading('bulk');
      await api.post('/admin/users/bulk-action', {
        userIds: selectedUsers,
        action
      });
      setSelectedUsers([]);
      fetchUsers();
      toast.success(`Bulk ${action} completed successfully`);
    } catch (error: any) {
      console.error('Error performing bulk action:', error);
      const message = error.response?.data?.message || `Failed to perform bulk ${action}`;
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const exportUsers = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const response = await api.get(`/admin/users/export?format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>;
    }
    if (user.isVerified) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Verified</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
  };

  const getRoleBadge = (isAdmin: boolean) => {
    return isAdmin ? 
      <span className="px-2 py-1 text-xs rounded-full" style={{ background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)' }}>Admin</span> :
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">User</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-gold-dark)' }}>
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage users, permissions, and account settings
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportUsers('csv')}
            className="btn-secondary flex items-center text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="btn-primary flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-gold-dark)' }}>
                {pagination.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-gold)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--text-on-gold)' }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-silk-green-dark)' }}>
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-silk)' }}>
              <UserCheck className="w-6 h-6" style={{ color: 'var(--text-on-silk)' }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Admins</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-gold-dark)' }}>
                {users.filter(u => u.isAdmin).length}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-gold)' }}>
              <Shield className="w-6 h-6" style={{ color: 'var(--text-on-gold)' }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">New This Month</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-silk-green-dark)' }}>
                {users.filter(u => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(u.createdAt) > monthAgo;
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-silk)' }}>
              <Calendar className="w-6 h-6" style={{ color: 'var(--text-on-silk)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="input-field pl-10 pr-4 py-2 w-64"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="btn-secondary text-sm"
                disabled={actionLoading === 'bulk'}
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="btn-secondary text-sm"
                disabled={actionLoading === 'bulk'}
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                disabled={actionLoading === 'bulk'}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                className="input-field"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>

              <select
                className="input-field"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>

              <input
                type="text"
                placeholder="Country"
                className="input-field"
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              />

              <input
                type="date"
                className="input-field"
                value={filters.registrationDate}
                onChange={(e) => setFilters(prev => ({ ...prev, registrationDate: e.target.value }))}
              />

              <select
                className="input-field"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="orders">Most Orders</option>
                <option value="spent">Highest Spending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead style={{ background: 'var(--color-nude-light)' }}>
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u._id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedUsers.includes(user._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(prev => [...prev, user._id]);
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user._id));
                        }
                      }}
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profilePicture?.url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.profilePicture.url}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-gold)' }}>
                            <span className="text-sm font-medium" style={{ color: 'var(--text-on-gold)' }}>
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                      {user.address?.country && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {user.address.country}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getRoleBadge(user.isAdmin)}
                      {getStatusBadge(user)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      Last login: {new Date(user.stats.lastLogin).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Package className="w-4 h-4 mr-1" />
                        {user.stats.totalOrders} orders
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <CreditCard className="w-4 h-4 mr-1" />
                        ${user.stats.totalSpent.toLocaleString()}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Heart className="w-4 h-4 mr-1" />
                        {user.stats.wishlistItems} items
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="btn-secondary text-sm"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn-secondary text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUserDetails(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium" style={{ color: 'var(--color-gold-dark)' }}>
                    User Details
                  </h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                {/* User details content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
                        <p><strong>Role:</strong> {selectedUser.isAdmin ? 'Admin' : 'User'}</p>
                        <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                        <p><strong>Verified:</strong> {selectedUser.isVerified ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    {selectedUser.address && (
                      <div>
                        <h4 className="font-medium mb-2">Address</h4>
                        <div className="text-sm">
                          <p>{selectedUser.address.street}</p>
                          <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                          <p>{selectedUser.address.country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Account Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Total Orders:</strong> {selectedUser.stats.totalOrders}</p>
                        <p><strong>Total Spent:</strong> ${selectedUser.stats.totalSpent.toLocaleString()}</p>
                        <p><strong>Wishlist Items:</strong> {selectedUser.stats.wishlistItems}</p>
                        <p><strong>Last Login:</strong> {new Date(selectedUser.stats.lastLogin).toLocaleString()}</p>
                        <p><strong>Member Since:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Preferences</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Currency:</strong> {selectedUser.preferences.currency}</p>
                        <p><strong>Language:</strong> {selectedUser.preferences.language}</p>
                        <p><strong>Theme:</strong> {selectedUser.preferences.theme}</p>
                        <p><strong>Notifications:</strong> {selectedUser.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUserAction(selectedUser._id, 'toggleAdmin')}
                    className="btn-secondary flex items-center text-sm"
                    disabled={actionLoading === selectedUser._id + 'toggleAdmin'}
                  >
                    {selectedUser.isAdmin ? <ShieldOff className="w-4 h-4 mr-1" /> : <Shield className="w-4 h-4 mr-1" />}
                    {selectedUser.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  
                  <button
                    onClick={() => handleUserAction(selectedUser._id, 'toggleStatus')}
                    className="btn-secondary flex items-center text-sm"
                    disabled={actionLoading === selectedUser._id + 'toggleStatus'}
                  >
                    {selectedUser.isActive ? <Ban className="w-4 h-4 mr-1" /> : <UserCheck className="w-4 h-4 mr-1" />}
                    {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleUserAction(selectedUser._id, 'sendEmail')}
                    className="btn-secondary flex items-center text-sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Send Email
                  </button>
                  
                  <button
                    onClick={() => handleUserAction(selectedUser._id, 'resetPassword')}
                    className="btn-secondary flex items-center text-sm"
                  >
                    Reset Password
                  </button>
                  
                  <button
                    onClick={() => handleUserAction(selectedUser._id, 'delete')}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;