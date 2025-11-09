import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Use environment variable with fallback for different environments
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'
);

console.log('API_URL:', API_URL); // Debug log to see which URL is being used

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth token here if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - just log the error, don't redirect
      console.log('Unauthorized request, user not logged in');
    }
    return Promise.reject(error);
  }
);

export default api;