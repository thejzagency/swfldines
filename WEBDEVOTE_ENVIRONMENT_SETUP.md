# 🔧 WebDevote Environment Variables Setup

## 📍 **Where to Find Environment Variables in WebDevote:**

Based on your control panel screenshot, click on **"Advanced Features"** - this is where environment variables are typically located in hosting control panels.

## 🔍 **Look for These Sections in Advanced Features:**

- **"Environment Variables"**
- **"Application Settings"**
- **"Node.js Settings"** (if available)
- **"Custom Variables"**
- **"Configuration"**
- **"App Configuration"**

## 📧 **Alternative: Check Email Manager**

Since you already have SendGrid working, you might also check:
- **"E-mail Manager"** → Look for API settings or SMTP settings
- Your SendGrid API key might already be configured there

## 🎯 **What You Need to Add:**

Once you find the environment variables section, add these:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_existing_sendgrid_key
SITE_URL=https://swfldines.com
```

## 🔑 **Getting Your Supabase Values:**

1. **Go to your Supabase dashboard**
2. **Click Settings → API**
3. **Copy these two values:**
   - **Project URL** (looks like: `https://abcdefg.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOi...`)

## 📧 **Your SendGrid Key:**

Since SendGrid is already working in WebDevote:
- **Check E-mail Manager** for your existing API key
- **Or use the same key** you're already using for email
- **It starts with `SG.`**

## 🚨 **If You Can't Find Environment Variables:**

**Contact WebDevote Support and ask:**
"Hi, I need to add environment variables for my React application. Where can I configure these in my control panel?"

They'll show you exactly where to add them.

## ✅ **Next Steps:**

1. **Click "Advanced Features"** in your control panel
2. **Look for environment variables section**
3. **Add the four variables above**
4. **Then we'll copy the CSS and JavaScript files**

**Try clicking "Advanced Features" first and let me know what you see!**