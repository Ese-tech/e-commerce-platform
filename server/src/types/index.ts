import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    isAdmin: boolean;
  };
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
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
  wishlist: Types.ObjectId[];
  preferences: {
    notifications: boolean;
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
  };
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'sports' | 'beauty' | 'toys';
  images: Array<{
    url: string;
    alt: string;
  }>;
  stock: number;
  reviews: Types.DocumentArray<IReview>;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'stripe' | 'paypal' | 'credit_card';
  paymentIntentId?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    isAdmin: boolean;
  };
}