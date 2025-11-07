import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { cartAPI } from '../services';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, setCart, updateItemQuantity, removeItem, setLoading, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data || null);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setLocalLoading(true);
      
      if (user) {
        // Update on server for logged-in users
        await cartAPI.updateCartItem(productId, newQuantity);
        const response = await cartAPI.getCart();
        setCart(response.data || null);
      } else {
        // Update locally for guest users
        updateItemQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setLocalLoading(true);

      if (user) {
        // Remove from server for logged-in users
        await cartAPI.removeFromCart(productId);
        const response = await cartAPI.getCart();
        setCart(response.data || null);
      } else {
        // Remove locally for guest users
        removeItem(productId);
      }
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLocalLoading(true);

      if (user) {
        await cartAPI.clearCart();
        setCart(null);
      } else {
        setCart(null);
      }
      
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLocalLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cart?.items.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4 bg-white p-4 rounded-lg">
                <div className="h-24 w-24 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Shopping Cart
        </h1>
        <div className="text-center py-20">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={handleClearCart}
          disabled={localLoading}
          className="text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.product.images[0]?.url || '/placeholder.jpg'}
                  alt={item.product.images[0]?.alt || item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <Link
                  to={`/products/${item.product._id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  ${item.price.toFixed(2)} each
                </p>
                {user?.isAdmin ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.product.stock > 0 ? 'In Stock' : 'Out of stock'}
                  </p>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || localLoading}
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock || localLoading}
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  disabled={localLoading}
                  className="text-red-600 hover:text-red-700 text-sm font-medium mt-1 flex items-center space-x-1 disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  🎉 You qualify for free shipping!
                </p>
              )}
              {shipping > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-center block"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Estimated Delivery */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Estimated Delivery
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;