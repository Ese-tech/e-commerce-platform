import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettingsStore();

  useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  return (
    <footer style={{ background: 'var(--gradient-nude)' }} className="text-gray-800 dark:text-gray-200">
      {/* Features Section */}
      <div className="border-b" style={{ borderColor: 'var(--color-gold-dark)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-gold)' }}>
                <Truck className="w-6 h-6" style={{ color: 'var(--text-on-gold)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-on-nude)' }}>Free Shipping</h3>
                <p className="text-sm opacity-75">
                  On orders over {settings?.general?.currency} {settings?.shipping?.freeShippingThreshold || 50}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-silk)' }}>
                <CreditCard className="w-6 h-6" style={{ color: 'var(--text-on-silk)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-on-nude)' }}>Secure Payment</h3>
                <p className="text-sm opacity-75">100% secure checkout</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-gold)' }}>
                <RotateCcw className="w-6 h-6" style={{ color: 'var(--text-on-gold)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-on-nude)' }}>Easy Returns</h3>
                <p className="text-sm opacity-75">{settings?.shipping?.returnPolicy || '30-day return policy'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--gradient-silk)' }}>
                <Shield className="w-6 h-6" style={{ color: 'var(--text-on-silk)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-on-nude)' }}>Quality Guarantee</h3>
                <p className="text-sm opacity-75">Satisfaction guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ 
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{settings?.general?.storeName || 'ShopHub'}</h3>
            <p className="opacity-75 mb-4">
              {settings?.general?.storeDescription || 'Your one-stop destination for all your shopping needs. Quality products, great prices, and exceptional service.'}
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="opacity-60 transition-all duration-300"
                style={{ color: 'var(--color-gold-dark)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="opacity-60 transition-all duration-300"
                style={{ color: 'var(--color-gold-dark)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="opacity-60 transition-all duration-300"
                style={{ color: 'var(--color-gold-dark)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="opacity-60 transition-all duration-300"
                style={{ color: 'var(--color-gold-dark)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-gold-dark)' }}>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=electronics" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=clothing" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=books" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Books
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=home" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Home & Garden
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-gold-dark)' }}>Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-gold-dark)' }}>Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-75" style={{ color: 'var(--color-gold-base)' }} />
                <div>
                  <p className="opacity-75" style={{ color: 'var(--text-on-nude)' }}>
                    {settings?.general?.address?.street || 'Musterstraße 123'}<br />
                    {settings?.general?.address?.zipCode || '12345'} {settings?.general?.address?.city || 'Musterstadt'}<br />
                    {settings?.general?.address?.country || 'Deutschland'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0 opacity-75" style={{ color: 'var(--color-gold-base)' }} />
                <a 
                  href={`tel:${settings?.general?.phone || '+49123456789'}`}
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  {settings?.general?.phone || '+49 (0) 123 456789'}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0 opacity-75" style={{ color: 'var(--color-gold-base)' }} />
                <a 
                  href={`mailto:${settings?.general?.contactEmail || 'info@ese-tech.de'}`}
                  className="opacity-75 hover:opacity-100 transition-all duration-300"
                  style={{ color: 'var(--text-on-nude)' }}
                >
                  {settings?.general?.contactEmail || 'info@ese-tech.de'}
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2" style={{ color: 'var(--color-silk-green-dark)' }}>Newsletter</h5>
              <p className="text-sm opacity-75 mb-3" style={{ color: 'var(--text-on-nude)' }}>
                Subscribe to get updates on new products and offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="input-field flex-1 text-sm rounded-l-md rounded-r-none"
                />
                <button className="btn-primary text-sm rounded-l-none rounded-r-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t" style={{ borderColor: 'var(--color-gold-dark)' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-75" style={{ color: 'var(--text-on-nude)' }}>
              © {currentYear} {settings?.general?.storeName || 'ShopHub'} by Ese-tech. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/impressum"
                className="text-sm transition-all duration-300 opacity-75 hover:opacity-100"
                style={{ color: 'var(--color-gold-dark)' }}
              >
                Impressum
              </Link>
              <Link 
                to="/datenschutz"
                className="text-sm transition-all duration-300 opacity-75 hover:opacity-100"
                style={{ color: 'var(--color-gold-dark)' }}
              >
                Datenschutz
              </Link>
              <Link 
                to="/cookies"
                className="text-sm transition-all duration-300 opacity-75 hover:opacity-100"
                style={{ color: 'var(--color-gold-dark)' }}
              >
                Cookie-Richtlinie
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-75" style={{ color: 'var(--text-on-nude)' }}>We accept:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1 shadow-sm">
                  <span className="text-xs font-bold" style={{ color: 'var(--color-gold-dark)' }}>VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1 shadow-sm">
                  <span className="text-xs font-bold" style={{ color: 'var(--color-silk-green-dark)' }}>MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1 shadow-sm">
                  <span className="text-xs font-bold" style={{ color: 'var(--color-gold-dark)' }}>AMEX</span>
                </div>
                <div className="bg-white rounded px-2 py-1 shadow-sm">
                  <span className="text-xs font-bold" style={{ color: 'var(--color-silk-green-dark)' }}>PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;