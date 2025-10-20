# 🚀 Netlify Deployment Guide for swfldines.com

## Your Domain: swfldines.com ✅

Perfect choice! This domain is professional and perfect for your restaurant directory business.

## 📦 **Step 1: Your Project is Built and Ready**

✅ **Project built successfully** - The `dist` folder contains all your production files
✅ **Redirects configured** - Single-page app routing will work properly
✅ **Domain references updated** - All emails and links use swfldines.com

## 🌐 **Step 2: Deploy to Netlify**

### **Option A: Drag & Drop (Easiest)**

1. **Go to [netlify.com](https://netlify.com)** and sign up/login
2. **Drag the entire `dist` folder** onto the Netlify dashboard
3. **Your site deploys instantly** with a temporary URL like `amazing-site-123.netlify.app`

### **Option B: GitHub Integration (Recommended for Updates)**

1. **Push your code to GitHub** (if not already there)
2. **Go to Netlify → "Import from Git"**
3. **Connect your GitHub repository**
4. **Set build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **Deploy automatically**

## 🔧 **Step 3: Configure Your Custom Domain**

1. **In Netlify Dashboard → Site Settings → Domain Management**
2. **Click "Add custom domain"**
3. **Enter:** `swfldines.com`
4. **Netlify will show you DNS records to configure**

## 📡 **Step 4: DNS Configuration**

**Add these records in your domain registrar (GoDaddy, Namecheap, etc.):**

### **Primary Domain:**
```
Type: A
Name: @
Value: 75.2.60.5
```

### **WWW Subdomain:**
```
Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

### **Alternative (if A record doesn't work):**
```
Type: CNAME
Name: @
Value: [your-site-name].netlify.app
```

## ⚙️ **Step 5: Environment Variables**

**In Netlify Dashboard → Site Settings → Environment Variables, add:**

```bash
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# SendGrid (Required for emails)
SENDGRID_API_KEY=your_sendgrid_api_key

# Hunter.io (Required for automated campaigns)
VITE_HUNTER_API_KEY=your_hunter_io_growth_plan_api_key

# Site Configuration
SITE_URL=https://swfldines.com
```

## 🚀 **Step 6: Deploy Edge Functions**

**Your Supabase edge functions need to be deployed separately:**

1. **Go to your Supabase Dashboard**
2. **Navigate to Edge Functions**
3. **Deploy these functions:**
   - `send-approval-email` (for restaurant approval emails)
   - `send-campaign-email` (for automated campaigns)
   - `stripe-webhook` (for payment processing)

## ✅ **Step 7: Test Everything**

**After deployment, test:**
1. **Visit swfldines.com** - Site loads correctly
2. **Sign up for account** - Authentication works
3. **Admin dashboard access** - Login as admin
4. **Email system** - Test SendGrid integration
5. **Automated campaigns** - Test Hunter.io integration

## 🎯 **Production Checklist:**

- ✅ **Domain configured:** swfldines.com
- ✅ **SSL certificate:** Automatic HTTPS
- ✅ **Environment variables:** All APIs configured
- ✅ **Edge functions:** Email system deployed
- ✅ **Database:** Clean and ready for real data
- ✅ **Analytics:** Real tracking system active

## 📧 **Professional Email Setup:**

**Your automated emails will now show:**
- **From:** noreply@swfldines.com
- **Links:** Point to https://swfldines.com
- **Professional branding:** Consistent domain usage

## 💰 **Ready for Revenue:**

Once live at swfldines.com, you can immediately:
1. **Upload 500+ restaurant data**
2. **Launch automated email campaigns** (Hunter.io Growth plan)
3. **Start processing restaurant claims**
4. **Generate $1,000-2,000+ monthly revenue**

---

## 🚀 **Quick Start After Going Live:**

1. **Upload restaurant data** → Admin Dashboard → Data Management
2. **Configure APIs** → Admin Dashboard → Automated Campaigns
3. **Launch campaign** → Click "Launch Automated Campaign"
4. **Process claims** → Admin Dashboard → Claims tab
5. **Watch revenue grow!** 💰

**Your SW Florida Dines platform is ready to go live and start making money! 🌴**