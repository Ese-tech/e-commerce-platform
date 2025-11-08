import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home, ShoppingBag } from 'lucide-react';

interface LocationState {
  orderNumber?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total?: string;
  orderSuccess?: boolean;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation for progress steps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // If no order state, redirect to home
  useEffect(() => {
    if (!state?.orderSuccess && !state?.orderNumber) {
      navigate('/');
    }
  }, [state, navigate]);

  const orderNumber = state?.orderNumber || `ORD-${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const orderSteps = [
    {
      icon: CheckCircle,
      title: 'Order Confirmed',
      description: 'Your order has been received and confirmed',
      completed: true
    },
    {
      icon: Package,
      title: 'Processing',
      description: 'We are preparing your items for shipment',
      completed: currentStep >= 1
    },
    {
      icon: Truck,
      title: 'Shipped',
      description: 'Your order is on its way to you',
      completed: currentStep >= 2
    },
    {
      icon: Mail,
      title: 'Delivered',
      description: `Estimated delivery: ${estimatedDelivery.toLocaleDateString()}`,
      completed: currentStep >= 3
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Order Number: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{orderNumber}</span>
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Order Status
          </h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div 
              className="absolute left-8 top-0 w-0.5 bg-green-500 transition-all duration-1000 ease-in-out"
              style={{ height: `${(currentStep / 3) * 100}%` }}
            ></div>
            
            {/* Steps */}
            <div className="space-y-8">
              {orderSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex items-start">
                    <div className={`
                      relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-500
                      ${step.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                      }
                    `}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <div className="ml-6 min-w-0 flex-1">
                      <h3 className={`
                        text-lg font-semibold transition-colors duration-500
                        ${step.completed 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        {step.title}
                      </h3>
                      <p className={`
                        text-sm transition-colors duration-500
                        ${step.completed 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        {state?.shippingAddress && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Order Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-gray-600 dark:text-gray-300 space-y-1">
                  <p>{state.shippingAddress.street}</p>
                  <p>{state.shippingAddress.city}, {state.shippingAddress.state}</p>
                  <p>{state.shippingAddress.zipCode}</p>
                  <p>{state.shippingAddress.country}</p>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {state.total && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{state.total}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Payment Status:</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">Confirmed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Delivery:</span>
                    <span className="text-gray-900 dark:text-white">{estimatedDelivery.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Confirmation Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Email Confirmation Sent
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                We've sent a detailed order confirmation to your email address. 
                You'll also receive updates about your order status and tracking information.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>
        </div>

        {/* Additional Support */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Need help with your order?
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a 
              href="/contact" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact Support
            </a>
            <a 
              href="/faq" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              FAQ
            </a>
            <a 
              href="/returns" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Returns & Exchanges
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;