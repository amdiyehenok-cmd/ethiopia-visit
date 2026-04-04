# 🚀 Ethiopia Visit — Production Deployment Guide

## Quick Deploy to Vercel (10 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: production-ready Ethiopia Visit"
git remote add origin https://github.com/YOUR_USERNAME/ethiopia-visit.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to **https://vercel.com/new**
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Root Directory: leave blank (or `ethiopia-travel-site` if in subfolder)
5. Click **Deploy** — it will fail first time (needs env vars)

### Step 3: Add Environment Variables in Vercel
Go to **Project → Settings → Environment Variables** and add:

| Variable | Where to get it | Required? |
|---|---|---|
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey | ✅ YES |
| `DATABASE_URL` | https://neon.tech (free) | ✅ YES |
| `NEXTAUTH_SECRET` | Run: `openssl rand -hex 32` | ✅ YES |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL e.g. `https://ethiopia-visit.vercel.app` | ✅ YES |
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com | For payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same dashboard | For payments |
| `CHAPA_SECRET_KEY` | https://dashboard.chapa.co | For ETB payments |
| `CLOUDINARY_CLOUD_NAME` | https://cloudinary.com | For photo uploads |
| `CLOUDINARY_API_KEY` | Same dashboard | For photo uploads |
| `CLOUDINARY_API_SECRET` | Same dashboard | For photo uploads |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same | For photo uploads |
| `OPENWEATHER_API_KEY` | https://home.openweathermap.org | For weather widget |
| `BOOKING_AFFILIATE_ID` | https://join.booking.com | For hotel revenue |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | https://adsense.google.com | For ad revenue |

### Step 4: Redeploy
After adding env vars, click **Redeploy** in Vercel dashboard.

---

## Setting up Chapa Payments (Ethiopia)

1. Register at **https://dashboard.chapa.co**
2. Verify your business (takes 1-2 days)
3. Get `CHASECK_TEST-...` key for testing
4. Test cards: 0900000000 (CBE), 0900000001 (Amhara Bank)
5. For production: upgrade to live keys

## Setting up Telebirr Payments

1. Apply at **https://developer.ethiotelecom.et**
2. Submit: business registration, trade license, TIN certificate
3. Test in sandbox with provided credentials
4. Processing time: 5-10 business days for approval

## Setting up Stripe (International)

1. Create account at **https://stripe.com**
2. Use test keys (`sk_test_...`) for development
3. Add webhook: `https://your-domain.vercel.app/api/payment/verify?provider=stripe`
4. Events to listen: `checkout.session.completed`

---

## Database Setup (Neon)

```bash
# After setting DATABASE_URL:
npx prisma generate
npx prisma db push   # Creates tables

# Optional: seed with sample data
npx prisma studio    # Visual database browser
```

---

## Custom Domain

1. Vercel → Project → Settings → Domains
2. Add `ethiopiavisit.com` (or your domain)
3. Update DNS: CNAME record → `cname.vercel-dns.com`
4. Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to new domain

---

## Revenue Streams Active After Setup

| Stream | Monthly potential | Setup time |
|---|---|---|
| Booking.com affiliate | $200–2,000 | 2 days |
| Google AdSense | $50–500 | 14 days |
| Stripe guide bookings (10%) | $500–5,000 | 1 hour |
| Chapa ETB bookings | Unlimited | 2 days |
| Premium subscriptions ($9.99/mo) | Unlimited | 1 hour |

---

## Performance Checklist

- [ ] Vercel Edge Network automatically caches static assets
- [ ] Images served via Next.js Image Optimization (AVIF/WebP)
- [ ] Gemini AI streamed (no timeout on responses)
- [ ] All API routes have error handling + fallbacks
- [ ] Security headers set in vercel.json
- [ ] Sitemap.xml auto-generated at /sitemap.xml

## Support

For help with deployment, check:
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
- Chapa docs: https://developer.chapa.co/docs
- Prisma docs: https://www.prisma.io/docs

---

## Stripe Webhook Setup

After deployment, run these commands in your terminal:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to https://your-domain.vercel.app/api/webhooks/stripe

# Copy the webhook signing secret shown (whsec_...) 
# Add it as STRIPE_WEBHOOK_SECRET in Vercel env vars
```

For production, register the webhook in your Stripe Dashboard:
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## Chapa Test Credentials

```
Test URL: https://checkout.chapa.co/checkout/payment
Test bank: Commercial Bank of Ethiopia
Test phone: 0912345678
Test OTP: 123456
```
