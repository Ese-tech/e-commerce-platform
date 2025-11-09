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
    api.post<ApiResponse<{ user: User; token: string }> | { message: string }>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }> | { message: string; user: User }>('/auth/login', credentials),
  
  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
  
  getProfile: () =>
    api.get<ApiResponse<User> | { user: User }>('/auth/profile'),
  
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
    api.get<Cart>('/cart'),
  
  addToCart: (productId: string, quantity: number) =>
    api.post<Cart>('/cart/add', { productId, quantity }),
  
  updateCartItem: (productId: string, quantity: number) =>
    api.put<Cart>('/cart/update', { productId, quantity }),
  
  removeFromCart: (productId: string) =>
    api.delete<Cart>(`/cart/remove/${productId}`),
  
  clearCart: () =>
    api.delete<ApiResponse<null>>('/cart/clear'),
};

// Orders API
export const ordersAPI = {
  getOrders: () =>
    api.get<{ orders: Order[]; pagination: any }>('/orders'),
  
  getOrder: (id: string) =>
    api.get<Order>(`/orders/${id}`),
  
  createOrder: (orderData: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    currency?: string;
  }) =>
    api.post<Order>('/orders/create', orderData),
  
  updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string; estimatedDelivery?: string }) =>
    api.put<Order>(`/orders/${id}/status`, data),
  
  cancelOrder: (id: string) =>
    api.put<Order>(`/orders/${id}/cancel`),
    
  // Admin routes
  getAllOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<{ orders: Order[]; pagination: any }>('/orders/admin/all', { params }),
};

// Users API (for wishlist and profile management)
export const usersAPI = {
  getWishlist: () =>
    api.get<Product[]>('/users/wishlist'),
  
  addToWishlist: (productId: string) =>
    api.post<ApiResponse<null>>(`/users/wishlist/${productId}`),
  
  removeFromWishlist: (productId: string) =>
    api.delete<ApiResponse<null>>(`/users/wishlist/${productId}`),
  
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