import express, { Response } from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Create Payment Intent
router.post('/create-payment-intent', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { cartItems, shippingAddress, billingAddress } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    // Calculate order totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(400).json({ message: `Product ${item.productId} not found` });
        return;
      }
      
      if (product.stock < item.quantity) {
        res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        userId: req.user!.userId,
        orderType: 'ecommerce',
      },
    });

    // Create pending order
    const order = new Order({
      user: req.user!.userId,
      items: validatedItems,
      subtotal,
      tax,
      shipping,
      total,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress,
      billingAddress,
      paymentIntentId: paymentIntent.id,
    });

    await order.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      total: total,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Confirm Payment and Complete Order
router.post('/confirm-payment', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      res.status(400).json({ message: 'Payment not completed' });
      return;
    }

    // Update order status
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Update inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update order
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.paidAt = new Date();
    await order.save();

    // Clear user's cart (you'll need to implement this based on your cart system)
    
    res.status(200).json({
      message: 'Payment confirmed successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.orderStatus,
      }
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

// Get Stripe Publishable Key
router.get('/config', (req: express.Request, res: Response): void => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Webhook for Stripe events (for production use)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: express.Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Find and update the order
      const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'completed';
        order.orderStatus = 'confirmed';
        order.paidAt = new Date();
        await order.save();
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      
      // Find and update the order
      const failedOrder = await Order.findOne({ paymentIntentId: failedPayment.id });
      if (failedOrder) {
        failedOrder.paymentStatus = 'failed';
        await failedOrder.save();
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;