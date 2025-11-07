# 🛒 E-Commerce Platform

A modern, full-stack e-commerce platform built with **React**, **TypeScript**, **Node.js**, **Express**, **MongoDB**, and **Stripe**. Features a responsive design with dark/light mode, comprehensive product management, shopping cart, order tracking, and user profiles.

## 🌟 Features

### Core E-Commerce Features
- **Product Browsing** - Search, filter, and sort by price, category, popularity
- **Product Pages** - Detailed product views with images, descriptions, reviews, and related products
- **Shopping Cart** - Add/remove/update items with real-time calculations
- **Checkout System** - Integrated with Stripe for secure payments
- **Order Tracking** - Real-time order status and delivery tracking
- **User Reviews** - Product ratings and reviews system

### User Management
- **User Authentication** - JWT-based auth with secure cookie sessions
- **User Profiles** - Personal info, addresses, payment preferences
- **Order History** - View past orders and invoices
- **Wishlist** - Save favorite products
- **Profile Pictures** - Upload and edit with Cloudinary integration

### Modern UI/UX
- **Dark/Light Mode** - Theme switching with Tailwind CSS
- **Responsive Design** - Mobile-first approach
- **TypeScript** - Full type safety across frontend and backend
- **Modern Stack** - Vite + React 19 + TypeScript + Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Zustand** for state management
- **React Hook Form** for form handling
- **Stripe Elements** for payment processing

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image uploads
- **Stripe** for payment processing

### Development Tools
- **Bun** as package manager and runtime
- **TypeScript** for type safety
- **ESLint** for code linting
- **Git** version control

## 🚀 Quick Start

### Prerequisites
- **Bun** (latest version)
- **MongoDB** (local or Atlas)
- **Node.js** 18+ (for some dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-platform
   ```

2. **Install dependencies**
   ```bash
   bun install:all
   ```

3. **Environment Setup**
   
   **Backend** - Copy and configure server environment:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your actual values
   ```

   **Frontend** - Copy and configure client environment:
   ```bash
   cd ../client
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start Development Servers**
   ```bash
   # From project root - runs both frontend and backend
   bun dev
   
   # Or run separately:
   bun server:dev  # Backend on http://localhost:5000
   bun client:dev  # Frontend on http://localhost:3000
   ```

## 📋 Environment Variables

### Server (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🏗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with search/filter/sort)
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories/list` - Get categories
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders/create` - Create order from cart
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:orderNumber/track` - Track order

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/wishlist` - Get wishlist
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist

## 📱 Available Scripts

### Root Directory
```bash
bun dev              # Start both frontend and backend
bun build            # Build both projects
bun start            # Start production server
bun install:all      # Install all dependencies
```

### Server
```bash
bun dev              # Start development server with hot reload
bun build            # Compile TypeScript to JavaScript
bun start            # Start production server
bun test             # Run tests
```

### Client
```bash
bun dev              # Start Vite development server
bun build            # Build for production
bun preview          # Preview production build
bun lint             # Run ESLint
```

## 🔧 Development

### Project Structure
```
e-commerce-platform/
├── client/                 # Frontend (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── types/         # TypeScript interfaces
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── package.json           # Root package.json
```

### Adding New Features

1. **Backend**: Add routes in `server/src/routes/`, models in `server/src/models/`
2. **Frontend**: Add components in `client/src/components/`, pages in `client/src/pages/`
3. **Types**: Update TypeScript interfaces in respective `types/` directories

## 🧪 Testing

```bash
# Run backend tests
cd server && bun test

# Run frontend tests
cd client && bun test

# Run all tests
bun test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
bun build
# Deploy dist/ folder to Vercel
```

### Backend (Railway/Render/DigitalOcean)
```bash
cd server
bun build
# Deploy with start command: bun start
```

### Environment Variables for Production
- Set all environment variables in your deployment platform
- Use production URLs and API keys
- Set `NODE_ENV=production`

## 🔒 Security Features

- JWT token authentication with httpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Secure headers middleware
- Environment variable protection

## 🎨 UI Components

The frontend includes a comprehensive component library:
- Product cards and grids
- Shopping cart interface
- User authentication forms
- Order tracking interface
- Admin dashboard components
- Responsive navigation
- Dark/light mode toggle

## 📧 Support

For questions and support, please open an issue in the repository.

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🚀**