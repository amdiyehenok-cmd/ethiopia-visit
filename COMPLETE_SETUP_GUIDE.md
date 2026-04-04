# 🇪🇹 Ethiopia Visit — Complete Setup & Feature Guide
## Every feature explained. Every fix applied. Step by step.

---

# PART 1 — FIRST-TIME SETUP (do this once)

## Step 1: Install dependencies

Open your terminal in the project folder and run:
```bash
npm install
```
This installs Groq AI, Prisma, Stripe, Chapa, Cloudinary, and everything else.

---

## Step 2: Set up your Neon database

1. Go to **https://neon.tech** and sign up (free)
2. Click **"New Project"** → name it `ethiopia-visit`
3. Choose region **Europe (Frankfurt)** — closest to Ethiopia
4. Click **"Create Project"**
5. On the dashboard, find **"Connection string"**
6. Click **"Pooled connection"** → copy the URL (starts with `postgresql://...`)
7. Also copy the **"Direct connection"** URL

---

## Step 3: Fill in your .env.local

Open the file `.env.local` in your project folder and fill in:

```dotenv
# ── DATABASE (Neon) ─────────────────────────────────────────
# Pooled connection (for app queries)
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15

# Direct connection (for Prisma migrations)
DIRECT_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require

# ── AI (Groq — FREE) ─────────────────────────────────────────
# Sign up at: https://console.groq.com → API Keys → Create
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── AUTH ─────────────────────────────────────────────────────
NEXTAUTH_SECRET=any-random-32-character-string-here
NEXTAUTH_URL=http://localhost:3000

# ── CLOUDINARY (photo uploads) ───────────────────────────────
# Sign up at: https://cloudinary.com (free tier: 25GB)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# ── PAYMENTS ─────────────────────────────────────────────────
# Stripe: https://dashboard.stripe.com → Developers → API Keys
STRIPE_SECRET_KEY=sk_test_your-test-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Chapa (Ethiopia ETB): https://dashboard.chapa.co
CHAPA_SECRET_KEY=CHASECK_TEST-WoD4LbwXIqPCnmw2Umg8r2peA6vGxzz3

# ── WEATHER ──────────────────────────────────────────────────
# https://home.openweathermap.org/api_keys (free, activates in 2hrs)
OPENWEATHER_API_KEY=your-weather-key

# ── APP URL ──────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**MINIMUM to get the app running:**
Only these 4 are required to start:
- `DATABASE_URL` + `DIRECT_URL` (from Neon)
- `GROQ_API_KEY` (from Groq console, free)
- `NEXTAUTH_SECRET` (type any random text)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

---

## Step 4: Push the database schema to Neon

```bash
npx prisma generate
npx prisma db push
```

Expected output:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema.
```

That's it — all 14 tables are created automatically in Neon.

---

## Step 5: Start the app

```bash
npm run dev
```

Open **http://localhost:3000** — the site is running! 🎉

---

# PART 2 — FEATURE-BY-FEATURE GUIDE

## Feature 1: Habesha AI Chat (bottom-right button 🇪🇹)

**What it does:** AI chatbot powered by Groq (Llama 3.3 70B).
Tourists ask questions about Ethiopia and get instant answers.

**How it works:**
- Click the 🇪🇹 button → chat opens
- Type anything: "Plan 7 days in Ethiopia", "Visa for US citizens", "What to eat in Lalibela"
- AI responds with streaming text (appears word by word)

**To get it working:** Set `GROQ_API_KEY` in `.env.local`

**What to expect:**
- Without key: Shows fallback tips about Ethiopia
- With key: Full AI responses, ~2 seconds response time
- Free tier: 14,400 questions/day — enough for ~500 tourists/day

**Quick prompts shown in chat:**
- "Plan 7-day trip" → Full itinerary
- "Best hotels under $100" → Hotel recommendations
- "Visa requirements" → Country-specific visa info
- "Ethiopian festivals" → Festival calendar

---

## Feature 2: AI Trip Planner (/planner)

**What it does:** Generates a complete day-by-day Ethiopia itinerary.

**How it works:**
1. Go to `/planner`
2. Set: number of days, budget (budget/mid-range/luxury), interests
3. Click "Plan My Trip"
4. AI returns a structured itinerary: morning/afternoon/evening activities, accommodation, costs

**To get it working:** Set `GROQ_API_KEY` in `.env.local`

**What to expect:**
- 7-day plan takes ~3-5 seconds to generate
- Includes: daily activities, hotel suggestions, estimated costs in USD
- Can export to PDF via the "Export PDF" button

---

## Feature 3: Hotels (/hotels)

**What it does:** Displays 12 curated Ethiopian hotels with filtering and map view.

**How it works:**
- Filter by city, price, star rating, amenities
- Switch between Grid view and Map view
- Click any hotel → modal opens with: gallery, description, amenities, nights calculator, booking button

**Booking flow:**
1. Click "Book now" on a hotel card or modal
2. Select number of nights
3. Click "Book now" → Payment modal opens
4. Choose: Credit card (Stripe), Chapa (ETB), Telebirr, or PayPal
5. Complete payment → redirects to /payment/success

**To make payments work:**
- Stripe: Set `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Chapa: Set `CHAPA_SECRET_KEY`
- Telebirr: Set `TELEBIRR_APP_ID` + `TELEBIRR_APP_KEY` + etc. (requires business in Ethiopia)

---

## Feature 4: Local Guides (/guides)

**What it does:** Browse 8 verified guide profiles. Filter by city, specialty, language.

**Guide profile page (/guides/[id]):**
- 3 tabs: Experiences, Reviews, About
- Each experience has a "Book" button → payment modal
- WhatsApp button → opens WhatsApp chat with guide
- Reviews with rating breakdown

**To book a guide:**
1. Go to `/guides`
2. Click "View Profile" on any guide
3. Click "Book" on an experience
4. Select payment method
5. Complete payment

---

## Feature 5: Become a Guide (/guides/become-a-guide)

**What it does:** Multi-step application form for local guides to join the platform.

**4-step form:**
1. Profile: Name, city, email, WhatsApp, bio, languages
2. Experiences: Specialties + 2 experience offerings
3. Documents: Certificate + insurance declarations
4. Review + submit

**What happens after submission:**
- Creates `User` record in Neon DB (role: GUIDE)
- Creates `Guide` record with status: `PENDING`
- Creates up to 2 `Experience` records (inactive until approved)
- Guide receives confirmation with their email

**To approve a guide (admin step):**
Run this in Neon console or via Prisma Studio:
```sql
UPDATE guides SET status = 'APPROVED', verified = true, active = true, "approvedAt" = NOW()
WHERE email = 'guide@email.com';

UPDATE experiences SET active = true
WHERE "guideId" = (SELECT id FROM guides WHERE email = 'guide@email.com');
```

---

## Feature 6: Virtual Tours (/virtual-tours)

**What it does:** Immersive 360° experience viewer for 6 Ethiopian destinations.

**Current mode — Immersive Preview:**
- High-resolution full-screen photo
- Drag left/right/up/down to "look around" (parallax zoom)
- Hotspot pins appear with location info
- Audio narration button (browser speech synthesis)
- "Skip to preview" if VR loads slowly

**To upgrade to TRUE 360° VR:**
You need equirectangular 360° photos (these are panoramic photos taken with a 360° camera).

**Where to get 360° photos:**
- Hire a local photographer in Ethiopia with a Ricoh Theta or Insta360 camera
- Search Wikimedia Commons: https://commons.wikimedia.org/wiki/Category:360°_panoramas_of_Ethiopia
- Purchase from stock sites: https://www.360cities.net/search/ethiopia

**How to add real 360° photos:**
1. Upload the photo to Cloudinary
2. Copy the URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/lalibela-360.jpg`)
3. Open `src/data/vr-tours.ts`
4. Set `panoramaUrl` to your Cloudinary URL:
```typescript
{
  id: "lalibela-bete-giyorgis",
  panoramaUrl: "https://res.cloudinary.com/your-cloud/image/upload/lalibela360.jpg",
  // ...
}
```
5. Save — the viewer automatically uses Pannellum for true 360°

---

## Feature 7: Community (/community)

**What it does:** Social feed where travellers share photos and stories.

**What users can do:**
- Read posts from other travellers
- Click ❤️ to like posts
- Click 💬 to open replies and add your own reply
- Click "Share your story" → compose modal
- Upload a photo (Cloudinary)
- Filter posts by tag: Lalibela, Danakil, Culture, Wildlife, etc.

**Currently:** Feed uses seed data (hardcoded). Real DB posts require authentication.

**To enable real community posts with DB:**
This requires adding NextAuth for user accounts.
For now, the community page works perfectly as a showcase with rich seed data.

---

## Feature 8: Smart Map (/explore)

**What it does:** Interactive map of Ethiopia with 50+ POIs.

**3 map styles:**
- 🌙 Dark (default — matches app theme)
- 🛰️ Satellite (Esri imagery)
- 🗺️ Streets (OpenStreetMap)

**Features:**
- Filter by category: Attractions, Hotels, Restaurants, Airports, Nature, Churches, etc.
- Filter by month (best season)
- Search destinations by name
- Click 📍 "Locate me" → shows POIs near your location
- Click any marker → detail panel with routing option
- Route planner: select From + To → draws real driving route via OSRM

**No API key needed** — uses free OpenStreetMap tiles and OSRM routing.

---

## Feature 9: Currency Widget (on homepage)

**What it does:** Live exchange rate converter.

**Currencies:** USD, ETB, EUR, GBP, CNY, JPY, AED, SAR, CAD, AUD

**How it works:**
- Fetches live rates from `open.er-api.com` (100% free, no key needed)
- Updates every hour
- Swap button ⇄ to reverse conversion direction

---

## Feature 10: Weather Widget (on homepage)

**What it does:** Shows current Addis Ababa weather + 5-day forecast.

**To activate:** Set `OPENWEATHER_API_KEY` in `.env.local`

**Without key:** Shows realistic demo data (22°C, partly cloudy, 5-day forecast)

---

## Feature 11: Festivals (/festivals)

**What it does:** Detailed guide to 8 Ethiopian festivals with countdown timer.

Each festival includes:
- Date (Ethiopian calendar converted to Gregorian)
- Photo, description, significance
- Best places to attend
- What to wear
- Photography tips
- Link to find a guide for that festival

---

## Feature 12: Cuisine (/cuisine)

**What it does:** Visual guide to Ethiopian food.

Includes: Injera, Doro Wat, Kitfo, Tibs, Shiro Wat, Tej, Coffee, Firfir
Plus: Restaurant recommendations in Addis Ababa, Lalibela, and Gondar

---

## Feature 13: PDF Export (in /planner)

**What it does:** After generating an itinerary, click "Export PDF" to download it.

Uses `jspdf` — no server needed, generates entirely in the browser.

---

## Feature 14: Budget Estimator (/budget)

**What it does:** Calculates estimated trip cost based on:
- Duration
- Budget tier (budget/mid-range/luxury)
- Group size
- Transport preferences

Returns: Accommodation, food, transport, activities broken down by day.

---

# PART 3 — REPLACING DEMO PHOTOS WITH REAL ONES

## Step 1: Prepare your Cloudinary account

1. Sign up at **https://cloudinary.com** (free: 25GB storage, 25GB bandwidth/month)
2. Go to **Settings → Upload → Upload presets**
3. Click **"Add upload preset"**
4. Set: Preset name = `ethiopia_ugc`, Signing mode = `Unsigned`
5. In the Folder field, type: `ethiopia-visit/ugc`
6. Click Save

## Step 2: Upload your photos

1. In Cloudinary, go to **Media Library**
2. Create folders: `destinations/`, `hotels/`, `guides/`, `festivals/`
3. Upload your photos
4. Click any photo → copy the URL (starts with `https://res.cloudinary.com/...`)

## Step 3: Update destination photos

Open `src/data/destinations.ts`

Find the destination you want to update, e.g. Lalibela:
```typescript
{
  id: "lalibela",
  image: "https://images.unsplash.com/photo-1548013146...",  // ← change this
```

Replace with your Cloudinary URL:
```typescript
{
  id: "lalibela",
  image: "https://res.cloudinary.com/YOUR_CLOUD/image/upload/destinations/lalibela-hero.jpg",
```

## Step 4: Update hero slider photos

Open `src/components/hero/HeroSlider.tsx`

Find each slide and replace the `image` field with your real photo URL.

## Step 5: Update hotel photos

Open `src/data/hotels.ts`

Each hotel has an `images: []` array. Replace with up to 3 real photos:
```typescript
images: [
  "https://res.cloudinary.com/YOUR_CLOUD/image/upload/hotels/sheraton-addis-1.jpg",
  "https://res.cloudinary.com/YOUR_CLOUD/image/upload/hotels/sheraton-addis-2.jpg",
],
```

## Step 6: Update guide profile photos

Open `src/data/guides.ts`

Replace `profilePhoto` and `coverPhoto` for each guide with their real photos.

## Step 7: Update festival photos

Open `src/data/festivals.ts`

Replace the `image` field with real festival photos.

## Recommended photo specs
| Use | Size | Ratio |
|---|---|---|
| Hero slider | 1920×1080 | 16:9 |
| Destination cards | 1200×800 | 3:2 |
| Hotel gallery | 1200×900 | 4:3 |
| Guide profile photo | 400×400 | 1:1 (square) |
| Guide cover photo | 1200×400 | 3:1 |
| Festival photos | 800×600 | 4:3 |
| Community posts | Any | Any |

---

# PART 4 — DEPLOYING TO VERCEL

## Step 1: Push to GitHub

```bash
cd ethiopia-final

# Initialize git (if not done)
git init
git add .
git commit -m "feat: Ethiopia Visit"

# Create repo on github.com first, then:
git remote add origin https://github.com/amdiyehenok-cmd/ethiopia-visit.git
git push -u origin main
```

## Step 2: Import to Vercel

1. Go to **https://vercel.com/new**
2. Click "Import Git Repository"
3. Select your `ethiopia-visit` repo
4. Framework: **Next.js** (auto-detected)
5. Root Directory: leave blank
6. Click **Deploy** (will fail first time — needs env vars)

## Step 3: Add environment variables to Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these (all environments: Production, Preview, Development):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon pooled connection string |
| `DIRECT_URL` | Your Neon direct connection string |
| `GROQ_API_KEY` | Your Groq API key |
| `NEXTAUTH_SECRET` | Random 32-char string |
| `NEXT_PUBLIC_APP_URL` | https://your-app.vercel.app |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary |
| `CLOUDINARY_API_KEY` | From Cloudinary |
| `CLOUDINARY_API_SECRET` | From Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same as above |
| `STRIPE_SECRET_KEY` | From Stripe (use test key first) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe |
| `CHAPA_SECRET_KEY` | From Chapa dashboard |
| `OPENWEATHER_API_KEY` | From OpenWeatherMap |

## Step 4: Redeploy

After adding env vars:
1. Go to Vercel dashboard → Deployments
2. Click "..." on the latest deployment → Redeploy
3. Wait ~2 minutes → your site is live!

## Step 5: Run database migrations on production

In your terminal (after deployment):
```bash
# Set DATABASE_URL to your production Neon URL temporarily
$env:DATABASE_URL="postgresql://..."  # Windows PowerShell
npx prisma db push
```

Or use Neon's SQL editor directly.

## Step 6: Set up Stripe webhook (for payment confirmations)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Listen: `stripe listen --forward-to https://your-app.vercel.app/api/webhooks/stripe`
4. Copy the `whsec_...` secret shown
5. Add as `STRIPE_WEBHOOK_SECRET` in Vercel env vars
6. Redeploy

---

# PART 5 — QUICK FIXES FOR COMMON ISSUES

## "AI not responding"
→ Check `GROQ_API_KEY` is set correctly in `.env.local`
→ Test at: https://console.groq.com → Playground

## "Images showing broken/404"
→ The Unsplash URLs in the code use specific photo IDs
→ Some IDs get deleted by photographers — replace them in the data files
→ Best solution: upload your own photos to Cloudinary

## "Database connection failed"
→ Make sure `DATABASE_URL` has `?sslmode=require` at the end
→ Also set `DIRECT_URL` for Prisma migrations
→ Run `npx prisma db push` to create tables

## "Payment not working"
→ Stripe: use test card `4242 4242 4242 4242`, any date, any CVV
→ Chapa: use test phone `0900000000`, OTP `123456`
→ Make sure you're using TEST keys (sk_test_...), not live keys

## "Guide registration fails"
→ Make sure `DATABASE_URL` is set and `npx prisma db push` was run
→ Check Prisma Studio: `npx prisma studio`

## "Weather showing 502"
→ OpenWeather key takes 2 hours to activate after creating
→ Until then, demo weather data is shown automatically

---

# PART 6 — REVENUE SETUP

## Booking.com Affiliate
1. Apply at: https://join.booking.com
2. Add `BOOKING_AFFILIATE_ID` to `.env.local`
3. Every hotel "Book on Booking.com" click earns commission (~4-8%)

## Stripe Payments (10% platform fee on guide bookings)
Already configured. When a tourist books a guide, you receive 90%, guide receives 90%.
Set up Stripe Connect to auto-transfer to guides.

## Google AdSense
1. Apply at: https://adsense.google.com
2. Add `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXX` to env vars
3. Ads appear automatically in the AdBanner slots on homepage

## Chapa Merchant Account
1. Register at: https://dashboard.chapa.co
2. Verify your business (Ethiopian business required)
3. Earn on every ETB payment processed through the platform

---

# PART 7 — DATABASE ADMINISTRATION

## View all guide applications
```bash
npx prisma studio
```
Opens at http://localhost:5555 — visual database browser.

## Approve a guide application
In Prisma Studio → Guide table → find the guide → set:
- `status` → `APPROVED`
- `verified` → ✓ (true)
- `active` → ✓ (true)
- `approvedAt` → current date

Then in Experience table → find their experiences → set `active` → ✓

## View all bookings
```bash
# In Prisma Studio → Booking table
# Or run SQL in Neon console:
SELECT b.*, u.email, u.name
FROM bookings b
JOIN users u ON b."userId" = u.id
ORDER BY b."createdAt" DESC;
```

## Export booking report
```sql
SELECT
  b.id,
  b.type,
  b.status,
  b."totalAmountUSD",
  b."paymentProvider",
  b."createdAt",
  u.name AS tourist,
  u.email AS tourist_email,
  g.name AS guide_name
FROM bookings b
JOIN users u ON b."userId" = u.id
LEFT JOIN guides g ON b."guideId" = g.id
WHERE b.status = 'CONFIRMED'
ORDER BY b."createdAt" DESC;
```
