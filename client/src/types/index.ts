// User types
export interface User {
  _id: string;
  name: string;
  email: string;
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
  phone?: string;
  wishlist: string[];
  preferences: {
    notifications: boolean;
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
  };
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: {
      url: string;
    };
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'sports' | 'beauty' | 'toys';
  images: Array<{
    url: string;
    alt: string;
  }>;
  stock: number;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductDetailResponse {
  product: Product;
  relatedProducts: Product[];
}

// Cart types
export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      alt: string;
    }>;
    stock: number;
  };
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'stripe' | 'paypal' | 'credit_card';
  paymentIntentId?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AddReviewForm {
  rating: number;
  comment: string;
}

export interface UpdateProfileForm {
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Filter types
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity' | 'newest';
  page?: number;
  limit?: number;
}