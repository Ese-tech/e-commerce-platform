
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    url: String,
    publicId: String, // For Cloudinary
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  phone: String,
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    language: {
      type: String,
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
