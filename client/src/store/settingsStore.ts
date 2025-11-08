import { create } from 'zustand';
import { api } from '../services/api';

interface PublicSettings {
  general: {
    storeName: string;
    storeDescription: string;
    contactEmail: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    currency: string;
    language: string;
  };
  shipping: {
    freeShippingThreshold: number;
    domesticShippingRate: number;
    internationalShippingRate: number;
    processingTime: string;
    returnPolicy: string;
  };
  payment: {
    enableStripe: boolean;
    enablePayPal: boolean;
    enableCreditCard: boolean;
  };
}

interface SettingsStore {
  settings: PublicSettings | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    if (get().settings) return; // Only fetch once unless manually refreshed
    
    try {
      set({ loading: true, error: null });
      const response = await api.get('/admin/settings/public');
      set({ settings: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching public settings:', error);
      set({ 
        error: 'Failed to load store settings', 
        loading: false,
        // Set default settings on error
        settings: {
          general: {
            storeName: 'ShopHub',
            storeDescription: 'Your shopping destination',
            contactEmail: 'info@shophub.com',
            phone: '+49 (40) 123-4567',
            address: {
              street: 'Musterstraße 123',
              city: 'Hamburg',
              state: 'Hamburg',
              zipCode: '20095',
              country: 'Deutschland'
            },
            currency: 'EUR',
            language: 'de'
          },
          shipping: {
            freeShippingThreshold: 50,
            domesticShippingRate: 5.99,
            internationalShippingRate: 15.99,
            processingTime: '1-2 Werktage',
            returnPolicy: '30 Tage Rückgaberecht'
          },
          payment: {
            enableStripe: true,
            enablePayPal: true,
            enableCreditCard: true
          }
        }
      });
    }
  },

  refreshSettings: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/admin/settings/public');
      set({ settings: response.data, loading: false });
    } catch (error) {
      console.error('Error refreshing settings:', error);
      set({ error: 'Failed to refresh settings', loading: false });
    }
  }
}));