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
          
          if (response.data?.data?.user) {
            set({ 
              user: response.data.data.user, 
              isAuthenticated: true,
              isLoading: false 
            });
            toast.success('Login successful!');
          }
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.register({ name, email, password });
          
          if (response.data?.data?.user) {
            set({ 
              user: response.data.data.user, 
              isAuthenticated: true,
              isLoading: false 
            });
            toast.success('Registration successful!');
          }
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Registration failed';
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
          set({ isLoading: true });
          const response = await authAPI.getProfile();
          
          if (response.data?.data) {
            set({ 
              user: response.data.data, 
              isAuthenticated: true,
              isLoading: false 
            });
          }
        } catch (error: any) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          console.error('Load user error:', error);
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.updateProfile(userData);
          
          if (response.data?.data) {
            set({ user: response.data.data, isLoading: false });
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