import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services';
import type { User } from '../types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.login({ email, password });
          
          // Handle different response structures with type casting
          const responseData = response.data as any;
          let user: User | null = null;
          
          if (responseData?.data?.user) {
            user = responseData.data.user;
          } else if (responseData?.user) {
            user = responseData.user;
          } else if (responseData?.name && responseData?.email) {
            user = responseData;
          }
          
          if (user) {
            set({ 
              user: user, 
              isAuthenticated: true,
              isLoading: false 
            });
            toast.success('Login successful!');
          } else {
            throw new Error('Login response missing user data');
          }
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || error.message || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.register({ name, email, password });
          
          const responseData = response.data as any;
          const message = responseData?.message || 'Registration successful';
          
          set({ isLoading: false });
          toast.success(message);
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || error.message || 'Registration failed';
          toast.error(message);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
        } catch (error: any) {
          // Even if logout fails on server, clear local state
          set({ user: null, isAuthenticated: false });
          console.error('Logout error:', error);
        }
      },

      loadUser: async () => {
        try {
          const response = await authAPI.getProfile();
          
          const responseData = response.data as any;
          let user: User | null = null;
          
          if (responseData?.data) {
            user = responseData.data;
          } else if (responseData?.user) {
            user = responseData.user;
          } else if (responseData?.name && responseData?.email) {
            user = responseData;
          }
          
          if (user) {
            set({ 
              user: user, 
              isAuthenticated: true 
            });
          }
        } catch (error) {
          // Silent fail for loadUser - user just isn't logged in
          set({ user: null, isAuthenticated: false });
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.updateProfile(userData);
          
          const responseData = response.data as any;
          let user: User | null = null;
          
          if (responseData?.data) {
            user = responseData.data;
          } else if (responseData?.user) {
            user = responseData.user;
          } else if (responseData?.name && responseData?.email) {
            user = responseData;
          }
          
          if (user) {
            set({ user: user, isLoading: false });
            toast.success('Profile updated successfully!');
          }
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Update failed';
          toast.error(message);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);