import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ShoppingBag, ArrowLeft } from 'lucide-react';
import { ordersAPI } from '../services';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { AutocompleteInput } from '../components/ui/AutocompleteInput';
import { 
  addressData, 
  getStatesForCountry, 
  getCitiesForCountry, 
  getZipCodesForCity, 
  getStreetsForCity,
  searchCities,
  searchStreets
} from '../data/addressData';
import { 
  currencies, 
  getCurrencyForCountry, 
  formatPrice, 
  getAllCurrencies 
} from '../data/currencyData';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCartStore();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Initialize with mock data for testing if no user/cart exists
  useEffect(() => {
    if (!user) {
      setUser({
        _id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        address: {
          street: 'Test Street 123',
          city: 'Berlin',
          state: 'Berlin',
          zipCode: '10115',
          country: 'Germany'
        },
        wishlist: [],
        preferences: {
          notifications: true,
          currency: 'EUR',
          language: 'en',
          theme: 'system'
        },
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    if (!cart) {
      setCart({
        _id: 'mock-cart-id',
        user: 'mock-user-id',
        items: [
          {
            product: {
              _id: 'mock-product-1',
              name: 'Smart Home Security Camera',
              images: [{ url: '/api/placeholder/400/400', alt: 'Smart Camera' }],
              price: 127.49,
              stock: 10
            },
            quantity: 1,
            price: 127.49
          },
          {
            product: {
              _id: 'mock-product-2',
              name: 'Organic Face Moisturizer',
              images: [{ url: '/api/placeholder/400/400', alt: 'Face Moisturizer' }],
              price: 29.74,
              stock: 5
            },
            quantity: 1,
            price: 29.74
          }
        ],
        totalAmount: 157.23,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [user, cart, setUser, setCart]);
  
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const defaultCurrency = getCurrencyForCountry('Germany');
    console.log('Initial currency set to:', defaultCurrency);
    return defaultCurrency;
  });
  
  // Shipping form
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Germany'
  });

  // Address autocomplete state
  const [countryOptions] = useState(() => {
    const countries = Object.keys(addressData);
    console.log('Available countries:', countries);
    return countries;
  });
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [streetOptions, setStreetOptions] = useState<string[]>([]);
  const [zipCodeOptions, setZipCodeOptions] = useState<string[]>([]);
  
  // Payment form
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'stripe' | 'paypal'>('credit_card');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    
    // Start with clean form - don't pre-fill address for testing
    // Comment out pre-fill to start fresh each time
    // if (user.address) {
    //   setShippingAddress(user.address);
    // }
    
    // Reset to step 1 and clear form data
    setStep(1);
    setShippingAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
    setPaymentInfo({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    });
    setPaymentMethod('credit_card');
    
    // Clear dropdown options
    setStateOptions([]);
    setCityOptions([]);
    setStreetOptions([]);
    setZipCodeOptions([]);
    
    // Reset currency to default
    setSelectedCurrency('USD');
  }, [user, cart, navigate]);

  // Update address options when country changes
  useEffect(() => {
    console.log('🌍 Country useEffect triggered:', shippingAddress.country);
    if (shippingAddress.country) {
      const states = getStatesForCountry(shippingAddress.country);
      console.log('📍 States for country:', states);
      setStateOptions(states);
      
      const cities = getCitiesForCountry(shippingAddress.country);
      console.log('🏙️ Cities for country:', cities.length, 'cities available');
      setCityOptions(cities.map(city => ({
        value: city.name,
        label: city.name,
        secondary: city.state
      })));
      
      // Update currency based on country
      const newCurrency = getCurrencyForCountry(shippingAddress.country);
      console.log('💰 Currency updated to:', newCurrency);
      if (newCurrency !== selectedCurrency) {
        setSelectedCurrency(newCurrency);
      }
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  }, [shippingAddress.country, selectedCurrency]);

  // Update city and zip options when state changes
  useEffect(() => {
    console.log('State useEffect triggered:', shippingAddress.state);
    if (shippingAddress.country && shippingAddress.state) {
      const cities = getCitiesForCountry(shippingAddress.country, shippingAddress.state);
      console.log('Cities for state:', cities);
      setCityOptions(cities.map(city => ({
        value: city.name,
        label: city.name,
        secondary: city.state
      })));
    }
  }, [shippingAddress.country, shippingAddress.state]);

  // Update zip codes and streets when city changes
  useEffect(() => {
    console.log('City useEffect triggered:', shippingAddress.city);
    if (shippingAddress.country && shippingAddress.city) {
      const zipCodes = getZipCodesForCity(shippingAddress.country, shippingAddress.city);
      console.log('ZIP codes for city:', zipCodes);
      setZipCodeOptions(zipCodes);
      
      const streets = getStreetsForCity(shippingAddress.country, shippingAddress.city);
      console.log('Streets for city:', streets);
      setStreetOptions(streets);
    } else {
      setZipCodeOptions([]);
      setStreetOptions([]);
    }
  }, [shippingAddress.country, shippingAddress.city]);

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

  // Address handlers
  const handleCountryChange = (value: string) => {
    console.log('Country changed to:', value);
    setShippingAddress(prev => ({ 
      ...prev, 
      country: value,
      state: '',
      city: '',
      street: '',
      zipCode: ''
    }));
    // Clear dependent options
    setStateOptions([]);
    setCityOptions([]);
    setStreetOptions([]);
    setZipCodeOptions([]);
    
    // Update currency based on country
    const countryCurrency = getCurrencyForCountry(value);
    setSelectedCurrency(countryCurrency);
  };

  const handleStateChange = (value: string) => {
    console.log('State changed to:', value);
    setShippingAddress(prev => ({ 
      ...prev, 
      state: value,
      city: '',
      street: '',
      zipCode: ''
    }));
    // Clear dependent options
    setCityOptions([]);
    setStreetOptions([]);
    setZipCodeOptions([]);
  };

  const handleCityChange = (value: string) => {
    console.log('City changed to:', value);
    setShippingAddress(prev => ({ 
      ...prev, 
      city: value,
      street: '',
      zipCode: ''
    }));
    // Clear dependent options
    setStreetOptions([]);
    setZipCodeOptions([]);
  };

  const handleStreetChange = (value: string) => {
    setShippingAddress(prev => ({ ...prev, street: value }));
  };

  const handleZipCodeChange = (value: string) => {
    setShippingAddress(prev => ({ ...prev, zipCode: value }));
  };

  // Search handlers
  const handleCitySearch = (query: string) => {
    console.log('City search:', query);
    if (shippingAddress.country && query.length > 0) {
      const filteredCities = searchCities(shippingAddress.country, query);
      console.log('Filtered cities:', filteredCities);
      setCityOptions(filteredCities.map(city => ({
        value: city.name,
        label: city.name,
        secondary: city.state
      })));
    } else if (shippingAddress.country) {
      // Show all cities for the country when search is empty
      const allCities = getCitiesForCountry(shippingAddress.country);
      setCityOptions(allCities.map(city => ({
        value: city.name,
        label: city.name,
        secondary: city.state
      })));
    }
  };

  const handleStreetSearch = (query: string) => {
    console.log('Street search:', query);
    if (shippingAddress.country && shippingAddress.city && query.length > 0) {
      const filteredStreets = searchStreets(shippingAddress.country, shippingAddress.city, query);
      console.log('Filtered streets:', filteredStreets);
      setStreetOptions(filteredStreets);
    } else if (shippingAddress.country && shippingAddress.city) {
      // Show all streets for the city when search is empty
      const allStreets = getStreetsForCity(shippingAddress.country, shippingAddress.city);
      setStreetOptions(allStreets);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart) return;
    
    try {
      setLoading(true);
      
      // Create order
      const orderData = {
        shippingAddress,
        paymentMethod,
        currency: selectedCurrency
      };
      
      const response = await ordersAPI.createOrder(orderData);
      
      // Clear cart after successful order
      setCart(null);
      
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.data?._id || ''}`, { 
        state: { orderSuccess: true } 
      });
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!user || !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Shipping Information
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  {/* Currency Selection */}
                  <AutocompleteInput
                    label="Currency"
                    value={selectedCurrency}
                    onChange={setSelectedCurrency}
                    options={getAllCurrencies().map(currency => ({
                      value: currency.code,
                      label: `${currency.code} - ${currency.name}`,
                      secondary: currency.symbol
                    }))}
                    placeholder="Select currency..."
                    required
                  />

                  {/* Country Selection */}
                  <AutocompleteInput
                    label="Country"
                    value={shippingAddress.country}
                    onChange={handleCountryChange}
                    options={countryOptions.map(country => {
                      console.log('Mapping country:', country);
                      return {
                        value: country,
                        label: country
                      };
                    })}
                    placeholder="Select country..."
                    required
                  />

                  {/* State/Region Selection */}
                  {stateOptions.length > 0 && (
                    <AutocompleteInput
                      label="State/Region"
                      value={shippingAddress.state}
                      onChange={handleStateChange}
                      options={stateOptions.map(state => ({
                        value: state,
                        label: state
                      }))}
                      placeholder="Select state/region..."
                      required
                    />
                  )}

                  {/* City Selection */}
                  <AutocompleteInput
                    label="City"
                    value={shippingAddress.city}
                    onChange={handleCityChange}
                    options={cityOptions}
                    placeholder="Search city..."
                    onSearch={handleCitySearch}
                    required
                  />

                  {/* Street Address */}
                  <AutocompleteInput
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={handleStreetChange}
                    options={streetOptions.map(street => ({
                      value: street,
                      label: street
                    }))}
                    placeholder="Enter or select street..."
                    onSearch={handleStreetSearch}
                    required
                  />

                  {/* ZIP Code Selection */}
                  <AutocompleteInput
                    label="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={handleZipCodeChange}
                    options={zipCodeOptions.map(zip => ({
                      value: zip,
                      label: zip
                    }))}
                    placeholder="Select ZIP code..."
                    required
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Payment Information
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Select Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <CreditCard className="w-5 h-5" />
                      <span className="text-gray-900 dark:text-white">Credit Card</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-900 dark:text-white">Stripe</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-900 dark:text-white">PayPal</span>
                    </label>
                  </div>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentMethod === 'credit_card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.nameOnCard}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/g, '') }))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'stripe' && (
                    <div className="text-center py-8">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Stripe Payment</h3>
                        <p className="mb-4">Secure payment processing with Stripe</p>
                        <div className="text-sm opacity-90">
                          Click "Place Order" to proceed with Stripe payment
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="text-center py-8">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">PayPal Payment</h3>
                        <p className="mb-4">Pay securely with your PayPal account</p>
                        <div className="text-sm opacity-90">
                          Click "Place Order" to be redirected to PayPal
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order - {formatPrice(total, selectedCurrency)}</span>
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4 mr-1" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0]?.url || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity, selectedCurrency)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Tax:</span>
                  <span>{formatPrice(tax, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping, selectedCurrency)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>{formatPrice(total, selectedCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address Summary */}
              {step === 2 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shipping To:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>{shippingAddress.street}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    <p>{shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;