# 🚀 Vercel Deployment Guide für E-Commerce Platform

## Schritt-für-Schritt Vercel Setup

### 1. Vercel Account Setup
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Registrieren Sie sich oder loggen Sie sich ein
3. Verbinden Sie Ihr GitHub Account

### 2. Projekt importieren
1. Klicken Sie auf "New Project"
2. Importieren Sie Ihr GitHub Repository
3. Wählen Sie `e-commerce-platform`

### 3. Build Konfiguration
```
Framework Preset: Other
Build Command: bun run build
Output Directory: dist
Install Command: bun install
Root Directory: client
```

**⚠️ Wichtig:** Setzen Sie das Root Directory auf `client` und verwenden Sie `bun`!

### 4. Environment Variables einrichten
Gehen Sie zu **Settings → Environment Variables** und fügen Sie hinzu:

#### MongoDB
- `MONGODB_URI`: Ihre MongoDB Connection String

#### Authentication
- `JWT_SECRET`: Sicherer Secret (32+ Zeichen)

#### Stripe Payment
- `STRIPE_PUBLISHABLE_KEY`: pk_test_... oder pk_live_...
- `STRIPE_SECRET_KEY`: sk_test_... oder sk_live_...
- `STRIPE_WEBHOOK_SECRET`: whsec_...

#### Email Service
- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_USER`: Ihre Gmail Adresse
- `EMAIL_PASS`: Ihr App-Passwort

#### Other
- `NODE_ENV`: production
- `CLIENT_URL`: https://e-commerce-platform-vert.vercel.app

### 5. Deployment
1. Klicken Sie auf "Deploy"
2. Warten Sie auf Build Completion
3. Testen Sie Ihre Live-App

## 🔗 Nach dem Deployment

### Stripe Webhooks konfigurieren
1. Gehen Sie zu Stripe Dashboard
2. Developers → Webhooks
3. Fügen Sie hinzu: `https://e-commerce-platform-vert.vercel.app/api/payments/webhook`
4. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### Domain & SSL
- Automatisches HTTPS von Vercel
- Custom Domain optional verfügbar

## ⚠️ Wichtige Hinweise

- Verwenden Sie Stripe **Test Mode** für Entwicklung
- Wechseln Sie zu **Live Mode** für Production
- Überprüfen Sie alle Environment Variables
- Testen Sie Payment Flow nach Deployment

## 🎉 Fertig!

Ihre E-Commerce Platform läuft jetzt live auf Vercel! 🚀