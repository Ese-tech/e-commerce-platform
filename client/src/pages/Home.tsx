import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Zap,
  Shield,
  Truck
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to ShopHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ShopHub?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the best shopping experience with quality products and exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free shipping on orders over $50. Get your products delivered quickly and safely.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Shopping
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your payments and personal information are always protected with our secure checkout.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Quality Products
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We carefully curate our products to ensure you get the best quality and value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  10K+
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Products</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  50K+
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Happy Customers</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  4.9
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Average Rating</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  99%
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', slug: 'electronics', icon: '📱' },
              { name: 'Clothing', slug: 'clothing', icon: '👕' },
              { name: 'Books', slug: 'books', icon: '📚' },
              { name: 'Home & Garden', slug: 'home', icon: '🏠' },
              { name: 'Sports', slug: 'sports', icon: '⚽' },
              { name: 'Beauty', slug: 'beauty', icon: '💄' },
              { name: 'Toys', slug: 'toys', icon: '🎮' },
              { name: 'More', slug: '', icon: '➕' },
            ].map((category) => (
              <Link
                key={category.slug}
                to={category.slug ? `/products?category=${category.slug}` : '/products'}
                className="group p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers and discover your new favorite products today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                Browse Products
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors border border-blue-400"
              >
                <Zap className="mr-2 w-5 h-5" />
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;