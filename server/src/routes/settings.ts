import express, { Response } from 'express';
import { protect, admin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// In-memory settings storage (in production, use MongoDB collection)
let storeSettings = {
  general: {
    storeName: 'ShopHub',
    storeDescription: 'Your one-stop destination for all your shopping needs. Quality products, great prices, and exceptional service.',
    contactEmail: 'info@shophub.com',
    supportEmail: 'support@shophub.com',
    phone: '+49 (40) 123-4567',
    address: {
      street: 'Musterstraße 123',
      city: 'Hamburg',
      state: 'Hamburg',
      zipCode: '20095',
      country: 'Deutschland'
    },
    timezone: 'Europe/Berlin',
    currency: 'EUR',
    language: 'de'
  },
  payment: {
    enableStripe: true,
    enablePayPal: true,
    enableCreditCard: true,
    stripePublishableKey: 'pk_test_••••••••••••••••',
    stripeSecretKey: 'sk_test_••••••••••••••••',
    paypalClientId: 'AXG••••••••••••••••••••••••••••••••••••••••••••••••',
    paypalClientSecret: 'EK6••••••••••••••••••••••••••••••••••••••••••••••••'
  },
  shipping: {
    freeShippingThreshold: 50,
    domesticShippingRate: 5.99,
    internationalShippingRate: 15.99,
    processingTime: '1-2 Werktage',
    returnPolicy: '30 Tage Rückgaberecht. Artikel müssen im Originalzustand sein.'
  },
  notifications: {
    orderNotifications: true,
    customerNotifications: true,
    inventoryAlerts: true,
    marketingEmails: false,
    adminEmails: true
  },
  security: {
    enableTwoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8
  }
};

// Get store settings
router.get('/', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // In production, you would fetch from MongoDB:
    // const settings = await StoreSettings.findOne() || defaultSettings;
    
    res.json(storeSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update store settings
router.put('/', protect, admin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const updatedSettings = req.body;
    
    // Validate required fields
    if (!updatedSettings.general?.storeName) {
      res.status(400).json({ message: 'Store name is required' });
      return;
    }
    
    if (!updatedSettings.general?.contactEmail) {
      res.status(400).json({ message: 'Contact email is required' });
      return;
    }
    
    // Update settings (in production, save to MongoDB)
    storeSettings = {
      ...storeSettings,
      ...updatedSettings,
      general: {
        ...storeSettings.general,
        ...updatedSettings.general
      },
      payment: {
        ...storeSettings.payment,
        ...updatedSettings.payment
      },
      shipping: {
        ...storeSettings.shipping,
        ...updatedSettings.shipping
      },
      notifications: {
        ...storeSettings.notifications,
        ...updatedSettings.notifications
      },
      security: {
        ...storeSettings.security,
        ...updatedSettings.security
      }
    };
    
    // In production, you would save to MongoDB:
    // await StoreSettings.findOneAndUpdate({}, updatedSettings, { upsert: true });
    
    console.log('Settings updated:', {
      storeName: storeSettings.general.storeName,
      timestamp: new Date().toISOString(),
      updatedBy: req.user!.userId
    });
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: storeSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Get public settings (for frontend display)
router.get('/public', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const publicSettings = {
      general: {
        storeName: storeSettings.general.storeName,
        storeDescription: storeSettings.general.storeDescription,
        contactEmail: storeSettings.general.contactEmail,
        phone: storeSettings.general.phone,
        address: storeSettings.general.address,
        currency: storeSettings.general.currency,
        language: storeSettings.general.language
      },
      shipping: {
        freeShippingThreshold: storeSettings.shipping.freeShippingThreshold,
        domesticShippingRate: storeSettings.shipping.domesticShippingRate,
        internationalShippingRate: storeSettings.shipping.internationalShippingRate,
        processingTime: storeSettings.shipping.processingTime,
        returnPolicy: storeSettings.shipping.returnPolicy
      },
      payment: {
        enableStripe: storeSettings.payment.enableStripe,
        enablePayPal: storeSettings.payment.enablePayPal,
        enableCreditCard: storeSettings.payment.enableCreditCard
      }
    };
    
    res.json(publicSettings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Failed to fetch public settings' });
  }
});

export default router;