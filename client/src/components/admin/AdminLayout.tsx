import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getProfilePictureUrl, hasProfilePicture } from '../../utils/userUtils';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
          <Link 
            to="/" 
            className="btn-primary"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link 
            to="/" 
            className="text-xl font-bold transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ShopHub Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  style={{
                    background: isActive ? 'var(--gradient-gold)' : 'transparent'
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="mr-3 w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Admin header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white ml-4 lg:ml-0">
                  Admin Panel
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</span>
                <Link to="/admin/profile" className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors">
                  {hasProfilePicture(user?.profilePicture) ? (
                    <img
                      src={getProfilePictureUrl(user?.profilePicture)}
                      alt={user?.name || 'Admin'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-gold)' }}>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-on-gold)' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                </Link>
                
                <Link
                  to="/"
                  className="btn-secondary text-sm"
                  title="View Site"
                >
                  View Site
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;