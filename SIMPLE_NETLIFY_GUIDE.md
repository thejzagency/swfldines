# 🚀 Simple Netlify Deployment for www.swfldines.com

## Your Files Are Ready! ✅

I've built your project and all the files you need are in the `dist` folder.

## 📁 **What You Need to Upload:**

All the files inside the `dist` folder:
- `index.html` (main website file)
- `assets/` folder (contains CSS and JavaScript)
- `_redirects` (makes your single-page app work properly)

## 🌐 **Step-by-Step Netlify Deployment:**

### **Step 1: Go to Netlify**
1. Open your web browser
2. Go to **[netlify.com](https://netlify.com)**
3. Click **"Sign up"** (or "Log in" if you have an account)
4. Sign up with email or GitHub

### **Step 2: Deploy Your Site**
1. **Look for the deployment section** on your Netlify dashboard
2. **Click "Add new site"**
3. **Click "Deploy manually"** (not from Git)
4. **Click "Choose folder"** or **"Browse to upload"**
5. **Navigate to your project's `dist` folder**
6. **Select ALL files inside the `dist` folder:**
   - Select `index.html`
   - Select the `assets` folder
   - Select `_redirects` file
   - Select any other files you see
7. **Click "Upload"** or **"Open"**

### **Step 3: Your Site Goes Live!**
- Netlify will process your files (takes 30-60 seconds)
- You'll get a temporary URL like `amazing-site-123.netlify.app`
- **Your restaurant directory is now LIVE!** 🎉

### **Step 4: Add Your Custom Domain**
1. **In your Netlify dashboard, click on your site**
2. **Go to "Site settings"**
3. **Click "Domain management"**
4. **Click "Add custom domain"**
5. **Enter:** `www.swfldines.com`
6. **Netlify will show you DNS instructions**

### **Step 5: Configure DNS**
1. **Go to your domain registrar** (where you bought swfldines.com)
2. **Add the DNS records** that Netlify shows you
3. **Wait 24-48 hours** for DNS to propagate
4. **Your site will be live at www.swfldines.com!**

## 🔧 **Environment Variables (Important!)**

After deployment, add these in **Netlify Site Settings → Environment Variables:**

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_sendgrid_api_key
VITE_HUNTER_API_KEY=your_hunter_io_api_key
SITE_URL=https://www.swfldines.com
```

## 💰 **Ready for Business:**

Once live at **www.swfldines.com**, your automated email campaigns will be professional and credible, leading to higher response rates and more restaurant claims!

---

**Need help with any of these steps? I can walk you through each one!**