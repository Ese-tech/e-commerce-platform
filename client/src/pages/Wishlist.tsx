import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Grid, List } from 'lucide-react';
import { usersAPI, cartAPI } from '../services';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuthStore();
  const { setCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getWishlist();
      setWishlistItems(response.data as Product[]);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await usersAPI.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
      }

      const response = await cartAPI.addToCart(product._id, 1);
      setCart(response.data);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleMoveToCart = async (product: Product) => {
    try {
      if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
      }

      // Add to cart and remove from wishlist
      await handleAddToCart(product);
      await handleRemoveFromWishlist(product._id);
      toast.success(`${product.name} moved to cart`);
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error('Failed to move to cart');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to view your wishlist
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Create an account or sign in to save your favorite items.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
                style={{
                  background: viewMode === 'grid' ? 'var(--gradient-gold)' : undefined
                }}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
                style={{
                  background: viewMode === 'list' ? 'var(--gradient-gold)' : undefined
                }}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        /* Products Grid */
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'w-full h-48'} relative overflow-hidden rounded-t-lg ${viewMode === 'list' ? 'rounded-l-lg rounded-t-none' : ''}`}>
                <img
                  src={product.images[0]?.url || '/placeholder.jpg'}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current group-hover:text-red-600" />
                </button>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <Link 
                  to={`/products/${product._id}`}
                  className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(product.averageRating)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price and Stock */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`text-sm ${
                    product.stock > 10 
                      ? 'text-green-600 dark:text-green-400' 
                      : product.stock > 0 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      product.stock === 0
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}</span>
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;