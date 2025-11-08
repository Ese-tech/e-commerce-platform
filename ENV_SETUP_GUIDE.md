# 🔐 Environment Variables für Vercel Deployment

## ⚠️ WICHTIG: Sicherheitshinweise
- Verwenden Sie NIEMALS echte API-Schlüssel in öffentlichen Repositories
- Alle Werte müssen in der Vercel Dashboard eingegeben werden
- Ersetzen Sie Test-Schlüssel durch Production-Schlüssel für Live-Deployment

## 📋 Vercel Environment Variables Setup

### 1. MongoDB Database
```
Variable: MONGODB_URI
Value: [Ihre MongoDB Atlas Connection String]
```

### 2. JWT Authentication
```
Variable: JWT_SECRET
Value: [Ihr sicherer JWT Secret - mindestens 32 Zeichen]
```

### 3. Server Configuration
```
Variable: NODE_ENV
Value: production

Variable: CLIENT_URL
Value: https://[IHR-VERCEL-PROJEKT].vercel.app
```

### 4. Stripe Payment Integration
```
Variable: STRIPE_PUBLISHABLE_KEY
Value: pk_test_[IHR_TEST_KEY] oder pk_live_[IHR_LIVE_KEY]

Variable: STRIPE_SECRET_KEY
Value: sk_test_[IHR_TEST_KEY] oder sk_live_[IHR_LIVE_KEY]

Variable: STRIPE_WEBHOOK_SECRET
Value: whsec_[IHR_WEBHOOK_SECRET]
```

### 5. Email Notifications
```
Variable: EMAIL_HOST
Value: smtp.gmail.com

Variable: EMAIL_PORT
Value: 587

Variable: EMAIL_USER
Value: [Ihre Email-Adresse]

Variable: EMAIL_PASS
Value: [Ihr App-Passwort]
```

### 6. Cloudinary (Image Upload)
```
Variable: CLOUDINARY_CLOUD_NAME
Value: [Ihr Cloudinary Cloud Name]

Variable: CLOUDINARY_API_KEY
Value: [Ihr Cloudinary API Key]

Variable: CLOUDINARY_API_SECRET
Value: [Ihr Cloudinary API Secret]
```

## 🔑 Wo finde ich meine Keys?

### Stripe Keys
1. Gehen Sie zu https://dashboard.stripe.com/
2. Developers → API Keys
3. Kopieren Sie Publishable und Secret Key

### MongoDB URI
1. Gehen Sie zu https://cloud.mongodb.com/
2. Database → Connect → Drivers
3. Kopieren Sie die Connection String

### Cloudinary Keys
1. Gehen Sie zu https://cloudinary.com/console
2. Dashboard → Account Details
3. Kopieren Sie Cloud Name, API Key und Secret

## 🚀 Vercel Dashboard Setup
1. Gehen Sie zu Ihrem Vercel Projekt
2. Settings → Environment Variables
3. Fügen Sie jede Variable einzeln hinzu
4. Wählen Sie alle Environments: Production, Preview, Development