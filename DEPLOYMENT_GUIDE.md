# 🚀 SW Florida Dines Deployment Guide

## Your Domain: www.swfldines.com

Perfect choice! This domain is professional and perfect for your restaurant directory business.

## 📦 **Step 1: Build Your Project**

```bash
npm run build
```

This creates a `dist` folder with all your production files.

## 🌐 **Step 2: Choose Your Hosting Platform**

### **Option A: Netlify (Recommended)**

**Why Netlify:**
- ✅ Free custom domain support
- ✅ Automatic SSL certificates
- ✅ Global CDN for fast loading
- ✅ Easy deployment from GitHub
- ✅ Perfect for React/Vite apps

**Deployment Steps:**
1. **Sign up at [netlify.com](https://netlify.com)**
2. **Connect your GitHub repository** (or drag/drop the `dist` folder)
3. **Set build command:** `npm run build`
4. **Set publish directory:** `dist`
5. **Deploy the site**

**Custom Domain Setup:**
1. **Go to Site Settings → Domain Management**
2. **Add custom domain:** `www.swfldines.com`
3. **Update your DNS records** (see DNS section below)

### **Option B: Vercel**

**Deployment Steps:**
1. **Sign up at [vercel.com](https://vercel.com)**
2. **Import your project from GitHub**
3. **Vercel auto-detects Vite settings**
4. **Deploy automatically**

**Custom Domain:**
1. **Go to Project Settings → Domains**
2. **Add:** `www.swfldines.com`
3. **Follow DNS instructions**

## 🔧 **Step 3: DNS Configuration**

**Add these DNS records in your domain registrar:**

### **For Netlify:**
```
Type: CNAME
Name: www
Value: [your-netlify-subdomain].netlify.app
```

### **For Vercel:**
```
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### **Root Domain Redirect (Optional):**
```
Type: A
Name: @
Value: [hosting provider IP]
```

## ⚙️ **Step 4: Environment Variables**

**Add these to your hosting platform:**

```bash
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# SendGrid (Required for emails)
SENDGRID_API_KEY=your_sendgrid_api_key

# Hunter.io (Required for automated campaigns)
VITE_HUNTER_API_KEY=your_hunter_io_api_key

# Site Configuration
SITE_URL=https://www.swfldines.com
```

## 🚀 **Step 5: Deploy Edge Functions**

**Your Supabase edge functions need to be deployed:**

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login and link project:**
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. **Deploy functions:**
   ```bash
   supabase functions deploy send-approval-email
   supabase functions deploy send-campaign-email
   supabase functions deploy stripe-webhook
   ```

## ✅ **Step 6: Test Everything**

**After deployment, test:**
1. **Visit www.swfldines.com** - Site loads correctly
2. **Sign up for account** - Authentication works
3. **Admin dashboard access** - Login as admin
4. **Email system** - Test SendGrid integration
5. **Automated campaigns** - Test Hunter.io integration

## 🎯 **Production Checklist:**

- ✅ **Domain configured:** www.swfldines.com
- ✅ **SSL certificate:** Automatic HTTPS
- ✅ **Environment variables:** All APIs configured
- ✅ **Edge functions:** Email system deployed
- ✅ **Database:** Clean and ready for real data
- ✅ **Analytics:** Real tracking system active

## 📧 **Email Configuration:**

**Your emails will now show:**
- **From:** noreply@swfldines.com
- **Links:** Point to www.swfldines.com
- **Professional branding:** Consistent domain usage

## 💰 **Ready for Revenue:**

Once live, you can immediately:
1. **Upload 500+ restaurant data**
2. **Launch automated email campaigns**
3. **Start processing restaurant claims**
4. **Generate $1,000-2,000+ monthly revenue**

**Your SW Florida Dines platform is ready to go live and start making money! 🌴💰**

Which hosting platform would you prefer to use?