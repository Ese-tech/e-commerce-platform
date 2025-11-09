# Cloudinary Setup for Vercel Deployment

## Environment Variables Required

To enable image upload functionality in production, you need to add the following environment variables to your Vercel project:

### 1. In Vercel Dashboard:
1. Go to your project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
CLOUDINARY_CLOUD_NAME=dm7qehsww
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 2. Getting Cloudinary Credentials:
1. Log in to your Cloudinary account (https://cloudinary.com)
2. Go to the **Dashboard**
3. Copy the following values:
   - **Cloud Name**: dm7qehsww (already set)
   - **API Key**: Found in your dashboard
   - **API Secret**: Found in your dashboard (click "Reveal")

### 3. Setting Environment Variables in Vercel:
1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable:
   - **Name**: `CLOUDINARY_API_KEY`
   - **Value**: Your actual API key from Cloudinary
   - **Environment**: Production, Preview, Development (select all)

3. Repeat for `CLOUDINARY_API_SECRET`

### 4. Redeploy:
After adding the environment variables, redeploy your application:
1. Go to **Deployments** tab in Vercel
2. Click the "..." menu on the latest deployment
3. Select "Redeploy"

## Testing Image Upload

Once configured:
1. Go to your live application
2. Navigate to Profile page
3. Try uploading a profile picture
4. The upload should work without the 500 error

## Current Error

The current 500 error occurs because:
- Cloudinary environment variables are not set in Vercel
- The API cannot authenticate with Cloudinary service
- Image upload requests fail with "service not configured" error

## Security Notes

- Never commit API secrets to your repository
- Environment variables in Vercel are automatically secured
- API secrets should only be visible to project administrators

## Fallback Behavior

If Cloudinary is not configured:
- Users will see a friendly error message
- The application will continue to work normally
- Profile pictures will use default avatars
- No application crashes will occur