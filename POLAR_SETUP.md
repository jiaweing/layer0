# Polar Payments Integration Setup Guide

This guide will help you complete the Polar payments integration for Layer0's $20 group creation feature.

## 🚀 What's Already Done

✅ **Code Integration Complete**

- Polar Better Auth plugin configured
- Group creation dialog updated with payment flow
- Checkout success page created
- Environment template updated
- TypeScript compilation verified

## 📋 Setup Checklist

### 1. Create Polar Account & Get Access Token

1. Visit [Polar Dashboard](https://polar.sh)
2. Sign up or log in to your account
3. Go to **Settings** → **API Keys**
4. Create a new access token with these permissions:
   - `products:read`
   - `products:write`
   - `checkouts:read`
   - `checkouts:write`
   - `webhooks:read`
   - `webhooks:write`
5. Copy the access token (format: `polar_sk_...`)

### 2. Create $20 Group Creation Product

1. In Polar Dashboard, go to **Products**
2. Click **Create Product**
3. Fill in the details:
   - **Name**: "Group Creation"
   - **Description**: "Create a new group on Layer0"
   - **Price**: $20.00 USD
   - **Type**: One-time purchase
4. Save the product and copy the **Product ID** (format: `prod_...`)

### 3. Set Up Webhook

1. In Polar Dashboard, go to **Settings** → **Webhooks**
2. Click **Create Webhook**
3. Configure:
   - **URL**: `https://yourdomain.com/api/auth/polar/webhook`
   - **Events**: Select `order.paid`
   - **Description**: "Layer0 Group Creation"
4. Save and copy the **Webhook Secret** (format: `whsec_...`)

### 4. Environment Configuration

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update the Polar configuration in `.env.local`:
   ```bash
   # Polar Payment Integration
   POLAR_ACCESS_TOKEN=polar_sk_your_actual_token_here
   POLAR_GROUP_PRODUCT_ID=prod_your_actual_product_id_here
   POLAR_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
   ```

### 5. Test the Integration

1. Start your development server:

   ```bash
   pnpm dev
   ```

2. Test the flow:
   - Navigate to `/groups`
   - Click "Create Group"
   - Fill in group details
   - Click "Create Group for $20"
   - Should redirect to Polar checkout
   - Complete test payment
   - Should redirect back to success page
   - Group should be created automatically

## 🔄 How It Works

### Payment Flow

1. User clicks "Create Group" and fills form
2. Frontend calls `authClient.checkout()` with group metadata
3. User redirects to Polar checkout page
4. After payment, user redirects to `/checkout-success`
5. Success page retrieves group data from localStorage
6. Group is created using Better Auth organization API
7. User is redirected to their new group

### Webhook Processing

- Polar sends `order.paid` webhook to `/api/auth/polar/webhook`
- Webhook handler logs payment success
- Future enhancement: automatic group creation via webhook

## 🛠 Development URLs

- **Webhook URL (local)**: `http://localhost:3000/api/auth/polar/webhook`
- **Success URL**: `http://localhost:3000/checkout-success?checkout_id={CHECKOUT_ID}`

For production, update these URLs to your actual domain.

## 🔒 Security Notes

- Never commit actual API keys to version control
- Use different API keys for development and production
- Verify webhook signatures in production
- Implement proper error handling and logging

## 🎯 Next Steps

1. **Production Setup**: Update URLs for production deployment
2. **Enhanced Webhooks**: Implement automatic group creation via webhooks
3. **Payment Validation**: Add additional payment verification
4. **User Experience**: Add loading states and better error handling
5. **Analytics**: Track conversion rates and payment success

## 📚 Documentation

- [Polar API Docs](https://docs.polar.sh/)
- [Better Auth Organizations](https://www.better-auth.com/docs/plugins/organization)
- [Better Auth Polar Plugin](https://docs.polar.sh/better-auth)

## 🐛 Troubleshooting

### Common Issues

1. **Checkout fails**: Check POLAR_ACCESS_TOKEN and POLAR_GROUP_PRODUCT_ID
2. **Webhook not received**: Verify webhook URL and secret
3. **Group not created**: Check localStorage data and auth state
4. **TypeScript errors**: Run `npx tsc --noEmit` to verify compilation

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Polar API connection
4. Check webhook delivery in Polar dashboard
5. Review server logs for errors

## ✅ Verification

Run this checklist to verify everything is working:

- [ ] Environment variables set correctly
- [ ] Polar product created and ID copied
- [ ] Webhook endpoint configured
- [ ] TypeScript compiles without errors
- [ ] Dev server starts successfully
- [ ] Create group dialog shows $20 payment option
- [ ] Checkout redirects to Polar
- [ ] Success page creates group after payment
- [ ] User can access new group

---

**Need Help?** Check the troubleshooting section above or review the Polar documentation for additional guidance.
