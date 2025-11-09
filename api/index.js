// Simple test server for Vercel
module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';
  
  // Health check
  if (url === '/api/health' || url.endsWith('/health')) {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      url: url,
      method: req.method
    });
  }

  // Settings
  if (url.includes('/api/admin/settings/public')) {
    return res.status(200).json({
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
        timezone: 'Europe/Berlin',
        currency: 'EUR',
        language: 'de'
      }
    });
  }

  // Auth endpoints
  if (url.includes('/api/auth/login')) {
    return res.status(501).json({
      message: 'Login system temporarily unavailable',
      debug: 'Production deployment in progress'
    });
  }

  if (url.includes('/api/auth/register')) {
    return res.status(501).json({
      message: 'Registration system temporarily unavailable',
      debug: 'Production deployment in progress'
    });
  }

  // Default response
  res.status(200).json({
    message: 'API server is running',
    endpoint: url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};