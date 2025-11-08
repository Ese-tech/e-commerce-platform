import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  Package
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { useSettingsStore } from '../../store/settingsStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const { settings } = useSettingsStore();

  const cartItemsCount = getItemCount();

  // Fetch settings when component mounts
  useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg border-b transition-all duration-300" 
            style={{ 
              background: 'var(--gradient-nude)',
              borderColor: 'var(--color-gold-dark)',
              borderWidth: '2px'
            }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {settings?.general?.storeName || 'ShopHub'}
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="input-field w-full pl-10 pr-4 py-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
                    }
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500 dark:text-nude-400 w-4 h-4" />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActivePage('/products')
                  ? 'text-white' 
                  : 'text-gray-700 dark:text-gray-300'
                }`}
                style={{
                  background: isActivePage('/products') 
                    ? 'var(--gradient-gold)' 
                    : 'transparent',
                  color: isActivePage('/products') 
                    ? 'var(--text-on-gold)' 
                    : undefined
                }}
              >
                Products
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/wishlist"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActivePage('/wishlist') ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{
                      background: isActivePage('/wishlist') 
                        ? 'var(--gradient-silk)' 
                        : 'transparent',
                      color: isActivePage('/wishlist') 
                        ? 'var(--text-on-silk)' 
                        : 'var(--color-nude-darker)'
                    }}
                    aria-label="Wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                  
                  <Link
                    to="/orders"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActivePage('/orders') ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{
                      background: isActivePage('/orders') 
                        ? 'var(--gradient-silk)' 
                        : 'transparent',
                      color: isActivePage('/orders') 
                        ? 'var(--text-on-silk)' 
                        : 'var(--color-nude-darker)'
                    }}
                    aria-label="Orders"
                  >
                    <Package className="w-5 h-5" />
                  </Link>
                </>
              )}
            </nav>

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                isActivePage('/cart') ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                background: isActivePage('/cart') 
                  ? 'var(--gradient-gold)' 
                  : 'transparent',
                color: isActivePage('/cart') 
                  ? 'var(--text-on-gold)' 
                  : 'var(--color-nude-darker)'
              }}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  style={{ background: 'var(--gradient-silk)' }}
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {user?.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                        style={{
                          color: 'var(--color-gold-dark)',
                          fontWeight: '600'
                        }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm transition-all duration-300 hover:text-opacity-80"
                  style={{ color: 'var(--color-nude-darker)' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input-field w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        navigate(`/products?search=${encodeURIComponent(value.trim())}`);
                        setIsMenuOpen(false);
                      }
                    }
                  }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/products"
                className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ 
                  color: 'var(--color-nude-darker)',
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ 
                      color: 'var(--color-nude-darker)',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary block text-center text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ 
                      color: 'var(--color-nude-darker)',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ 
                      color: 'var(--color-nude-darker)',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    style={{ 
                      color: 'var(--color-nude-darker)',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center space-x-2"
                    style={{ 
                      color: 'var(--color-nude-darker)',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;