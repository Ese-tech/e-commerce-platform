import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, Phone } from 'lucide-react';
import { ordersAPI } from '../services';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import type { Order } from '../types';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (id && user) {
      fetchOrder();
    }
  }, [id, user]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrder(id!);
      setOrder(response.data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    try {
      await ordersAPI.cancelOrder(order._id);
      await fetchOrder(); // Refresh order data
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-silk-green-600" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-gold-600" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-silk-green-700" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-silk-green-100 text-silk-green-800 dark:bg-silk-green-900 dark:text-silk-green-300';
      case 'shipped':
        return 'bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-300';
      case 'delivered':
        return 'bg-silk-green-200 text-silk-green-900 dark:bg-silk-green-800 dark:text-silk-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderTimeline = (status: string) => {
    const steps = [
      { step: 'Order Placed', completed: true },
      { step: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
      { step: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { step: 'Delivered', completed: status === 'delivered' },
    ];
    
    if (status === 'cancelled') {
      return [
        { step: 'Order Placed', completed: true },
        { step: 'Cancelled', completed: true }
      ];
    }
    
    return steps;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order not found
          </h2>
          <Link
            to="/orders"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const timeline = getOrderTimeline(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center text-gold-600 hover:text-gold-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            {(order.status === 'pending' || order.status === 'processing') && (
              <button
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Progress</h2>
            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-silk-green-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.completed 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.step}
                    </p>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-px h-8 ml-4 ${
                      step.completed 
                        ? 'bg-silk-green-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Order Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tracking Information</h2>
              <div className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-gold-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Tracking Number</p>
                    <p className="font-mono text-gold-600 dark:text-gold-400 text-lg">{order.trackingNumber}</p>
                  </div>
                </div>
                {order.estimatedDelivery && (
                  <div className="mt-3 pt-3 border-t border-gold-200 dark:border-gold-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Estimated delivery: {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax:</span>
                <span className="text-gray-900 dark:text-white">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping:</span>
                <span className="text-gray-900 dark:text-white">
                  {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">Total:</span>
                  <span className="font-bold text-xl text-gold-600 dark:text-gold-400">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shipping Address
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-1">
              <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="capitalize font-medium text-gray-900 dark:text-white">
                {order.paymentMethod.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-silk-green-50 dark:bg-silk-green-900/20 border border-silk-green-200 dark:border-silk-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-silk-green-900 dark:text-silk-green-200 mb-2 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Need Help?
            </h3>
            <p className="text-silk-green-800 dark:text-silk-green-300 text-sm mb-3">
              If you have any questions about your order, please contact our support team.
            </p>
            <button className="w-full bg-silk-green-600 hover:bg-silk-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;