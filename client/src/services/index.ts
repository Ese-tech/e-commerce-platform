import { api } from './api';
import type { 
  User, 
  Product, 
  Cart, 
  Order,
  ApiResponse,
  ProductFilters,
  ProductsResponse
} from '../types';

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials),
  
  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
  
  getProfile: () =>
    api.get<ApiResponse<User>>('/auth/profile'),
  
  updateProfile: (userData: Partial<User>) =>
    api.put<ApiResponse<User>>('/auth/profile', userData),
  
  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<null>>('/auth/reset-password', { token, password }),
};

// Products API
export const productsAPI = {
  getProducts: (filters?: ProductFilters) =>
    api.get<ProductsResponse>('/products', { params: filters }),
  
  getProduct: (id: string) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),
  
  searchProducts: (query: string, filters?: ProductFilters) =>
    api.get<ProductsResponse>('/products/search', { 
      params: { query, ...filters } 
    }),
  
  getCategories: () =>
    api.get<ApiResponse<string[]>>('/products/categories'),
  
  getFeaturedProducts: () =>
    api.get<ApiResponse<Product[]>>('/products/featured'),
  
  getPopularProducts: () =>
    api.get<ApiResponse<Product[]>>('/products/popular'),
};

// Cart API
export const cartAPI = {
  getCart: () =>
    api.get<ApiResponse<Cart>>('/cart'),
  
  addToCart: (productId: string, quantity: number) =>
    api.post<ApiResponse<Cart>>('/cart/add', { productId, quantity }),
  
  updateCartItem: (itemId: string, quantity: number) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity }),
  
  removeFromCart: (itemId: string) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`),
  
  clearCart: () =>
    api.delete<ApiResponse<null>>('/cart/clear'),
};

// Orders API
export const ordersAPI = {
  getOrders: () =>
    api.get<ApiResponse<Order[]>>('/orders'),
  
  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),
  
  createOrder: (orderData: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
  }) =>
    api.post<ApiResponse<Order>>('/orders', orderData),
  
  updateOrderStatus: (id: string, status: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  
  cancelOrder: (id: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/cancel`),
};

// Users API (for wishlist and profile management)
export const usersAPI = {
  getWishlist: () =>
    api.get<ApiResponse<Product[]>>('/users/wishlist'),
  
  addToWishlist: (productId: string) =>
    api.post<ApiResponse<Product[]>>('/users/wishlist', { productId }),
  
  removeFromWishlist: (productId: string) =>
    api.delete<ApiResponse<Product[]>>(`/users/wishlist/${productId}`),
  
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post<ApiResponse<{ profilePicture: string }>>('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};