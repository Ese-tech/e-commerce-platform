const mongoose = require('mongoose');
const Product = require('./dist/models/Product').default;
require('dotenv').config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 199.99,
    category: "electronics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        alt: "Wireless Bluetooth Headphones"
      }
    ],
    stock: 50,
    tags: ["wireless", "bluetooth", "headphones", "audio", "noise-cancellation"],
    isActive: true
  },
  {
    name: "Classic Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear with a relaxed fit.",
    price: 24.99,
    category: "clothing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Classic Cotton T-Shirt"
      }
    ],
    stock: 100,
    tags: ["cotton", "t-shirt", "casual", "comfortable", "basic"],
    isActive: true
  },
  {
    name: "JavaScript: The Definitive Guide",
    description: "The comprehensive guide to JavaScript programming. Essential reading for web developers of all levels.",
    price: 59.99,
    category: "books",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
        alt: "JavaScript Programming Book"
      }
    ],
    stock: 30,
    tags: ["javascript", "programming", "web-development", "coding", "reference"],
    isActive: true
  },
  {
    name: "Smart Home Security Camera",
    description: "WiFi enabled security camera with motion detection, night vision, and mobile app control. Keep your home safe 24/7.",
    price: 149.99,
    category: "electronics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
        alt: "Smart Security Camera"
      }
    ],
    stock: 25,
    tags: ["security", "camera", "smart-home", "wifi", "surveillance"],
    isActive: true
  },
  {
    name: "Ergonomic Office Chair",
    description: "Professional ergonomic office chair with lumbar support, adjustable height, and breathable mesh back. Perfect for long work sessions.",
    price: 299.99,
    category: "home",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        alt: "Ergonomic Office Chair"
      }
    ],
    stock: 15,
    tags: ["office", "chair", "ergonomic", "furniture", "workspace"],
    isActive: true
  },
  {
    name: "Yoga Mat Premium",
    description: "High-quality non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and fitness exercises.",
    price: 49.99,
    category: "sports",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
        alt: "Premium Yoga Mat"
      }
    ],
    stock: 40,
    tags: ["yoga", "mat", "fitness", "exercise", "eco-friendly"],
    isActive: true
  },
  {
    name: "Organic Face Moisturizer",
    description: "Natural organic face moisturizer with SPF 30 protection. Suitable for all skin types, cruelty-free and vegan.",
    price: 34.99,
    category: "beauty",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500",
        alt: "Organic Face Moisturizer"
      }
    ],
    stock: 60,
    tags: ["skincare", "moisturizer", "organic", "spf", "vegan"],
    isActive: true
  },
  {
    name: "Educational Building Blocks",
    description: "Colorful educational building blocks set for children aged 3-8. Promotes creativity, problem-solving, and fine motor skills.",
    price: 39.99,
    category: "toys",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558877385-f1bfa55ba8fd?w=500",
        alt: "Educational Building Blocks"
      }
    ],
    stock: 35,
    tags: ["educational", "building-blocks", "toys", "children", "creative"],
    isActive: true
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    console.log('Sample products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - $${product.price}`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedProducts();