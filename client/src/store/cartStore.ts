import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '../types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      setCart: (cart) => set({ cart }),
      setLoading: (isLoading) => set({ isLoading }),
      addItem: (item) => {
        const { cart } = get();
        if (!cart) return;
        
        const existingItemIndex = cart.items.findIndex(
          (cartItem) => cartItem.product._id === item.product._id
        );
        
        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...cart.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          const updatedCart = {
            ...cart,
            items: updatedItems,
            totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          };
          set({ cart: updatedCart });
        } else {
          // Add new item
          const updatedItems = [...cart.items, item];
          const updatedCart = {
            ...cart,
            items: updatedItems,
            totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          };
          set({ cart: updatedCart });
        }
      },
      updateItemQuantity: (productId, quantity) => {
        const { cart } = get();
        if (!cart) return;
        
        const updatedItems = cart.items.map(item =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        const updatedCart = {
          ...cart,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
        set({ cart: updatedCart });
      },
      removeItem: (productId) => {
        const { cart } = get();
        if (!cart) return;
        
        const updatedItems = cart.items.filter(item => item.product._id !== productId);
        const updatedCart = {
          ...cart,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
        set({ cart: updatedCart });
      },
      clearCart: () => set({ cart: null }),
      getItemCount: () => {
        const { cart } = get();
        return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);