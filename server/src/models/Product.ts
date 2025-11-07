import { Schema, model, Document, Types } from 'mongoose';
import { IProduct, IReview } from '../types';

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys'],
  },
  images: [{
    url: String,
    alt: String,
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc: number, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }
  next();
});

const Product = model<IProduct>('Product', productSchema);

export default Product;