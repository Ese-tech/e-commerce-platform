import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  userEmail: string,
  userName: string,
  orderDetails: {
    orderNumber: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }
) => {
  try {
    const transporter = createTransporter();

    const itemsHtml = orderDetails.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0; font-size: 16px;">Thank you for your purchase</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${userName},</h2>
          <p>Your order has been confirmed and is being processed. Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Order Details</h3>
            <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Total Amount:</strong> $${orderDetails.total.toFixed(2)}</p>
          </div>

          <h3 style="color: #333;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <h3 style="color: #333;">Shipping Address</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p style="margin: 5px 0;">${orderDetails.shippingAddress.street}</p>
            <p style="margin: 5px 0;">${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}</p>
            <p style="margin: 5px 0;">${orderDetails.shippingAddress.country}</p>
          </div>

          <div style="background: #f0f9ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
            <ul style="color: #374151; padding-left: 20px;">
              <li>We'll prepare your order for shipping</li>
              <li>You'll receive a tracking number once shipped</li>
              <li>Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/orders" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Order Details</a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            If you have any questions, please contact our customer support.<br>
            Thank you for shopping with us!
          </p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - ${orderDetails.orderNumber}`,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (
  userEmail: string,
  userName: string,
  orderDetails: {
    orderNumber: string;
    status: string;
    trackingNumber?: string;
  }
) => {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is currently being processed.',
      shipped: 'Your order has been shipped and is on its way!',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.',
    };

    const statusColors = {
      confirmed: '#10b981',
      processing: '#f59e0b',
      shipped: '#3b82f6',
      delivered: '#059669',
      cancelled: '#ef4444',
    };

    const trackingInfo = orderDetails.trackingNumber
      ? `
        <div style="background: #f0f9ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Tracking Information</h3>
          <p><strong>Tracking Number:</strong> ${orderDetails.trackingNumber}</p>
          <p>You can track your package using this tracking number on our website or the carrier's website.</p>
        </div>
      `
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${statusColors[orderDetails.status as keyof typeof statusColors] || '#6b7280'}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Update</h1>
          <p style="color: white; margin: 10px 0 0; font-size: 16px;">Order #${orderDetails.orderNumber}</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${userName},</h2>
          <p>${statusMessages[orderDetails.status as keyof typeof statusMessages] || 'Your order status has been updated.'}</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Current Status</h3>
            <p style="font-size: 18px; font-weight: bold; color: ${statusColors[orderDetails.status as keyof typeof statusColors] || '#6b7280'}; text-transform: uppercase;">${orderDetails.status}</p>
          </div>

          ${trackingInfo}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/orders" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Order Details</a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Thank you for shopping with us!
          </p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Update - ${orderDetails.orderNumber}`,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};