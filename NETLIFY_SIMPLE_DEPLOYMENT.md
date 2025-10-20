# 🚀 Simple Netlify Deployment for swfldines.com

## Method 1: Manual File Upload (No Drag & Drop)

### **Step 1: Go to Netlify**
1. Visit [netlify.com](https://netlify.com)
2. Sign up or log in
3. Click **"Add new site"** → **"Deploy manually"**

### **Step 2: Upload Files**
1. **Click "Choose folder"** or **"Browse to upload"**
2. **Navigate to your project's `dist` folder**
3. **Select ALL files inside the `dist` folder:**
   - `index.html`
   - `assets` folder (contains CSS and JS)
   - `_redirects` file
   - Any other files in `dist`
4. **Click "Upload"** or **"Deploy"**

### **Step 3: Get Your Live Site**
- Netlify will give you a temporary URL like `amazing-site-123.netlify.app`
- Your site is now LIVE! 🎉

### **Step 4: Add Your Custom Domain**
1. **In Netlify Dashboard → Site Settings → Domain Management**
2. **Click "Add custom domain"**
3. **Enter:** `swfldines.com`
4. **Netlify will show DNS instructions**

---

## Method 2: GitHub Integration (Recommended)

### **Step 1: Push to GitHub**
1. Create a new repository on GitHub
2. Upload your project files to GitHub
3. Make sure all files are committed

### **Step 2: Connect Netlify to GitHub**
1. **In Netlify → "Add new site" → "Import from Git"**
2. **Connect your GitHub account**
3. **Select your repository**
4. **Build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **Click "Deploy site"**

### **Benefits of GitHub Method:**
- ✅ **Automatic deployments** when you update code
- ✅ **Version control** for your project
- ✅ **Easy rollbacks** if needed
- ✅ **Professional development workflow**

---

## 🌐 DNS Configuration for swfldines.com

**Add these records in your domain registrar:**

### **Primary Domain (swfldines.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

### **WWW Subdomain (www.swfldines.com):**
```
Type: CNAME
Name: www
Value: [your-netlify-site-name].netlify.app
```

**Example:** If your Netlify site is `amazing-restaurant-123.netlify.app`, then:
```
Type: CNAME
Name: www
Value: amazing-restaurant-123.netlify.app
```

---

## ⚙️ Environment Variables for Netlify

**In Netlify Dashboard → Site Settings → Environment Variables:**

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

---

## ✅ After Deployment Checklist:

1. **✅ Site loads at www.swfldines.com**
2. **✅ Restaurant directory works**
3. **✅ User signup/login works**
4. **✅ Admin dashboard accessible**
5. **✅ Email system functional**
6. **✅ Ready for automated campaigns**

---

## 🎯 Next Steps After Going Live:

1. **Upload restaurant data** → Admin Dashboard → Data Management
2. **Configure APIs** → Admin Dashboard → Automated Campaigns  
3. **Launch automated campaign** → Process 500+ restaurants automatically
4. **Process claims** → Admin Dashboard → Claims tab
5. **Start generating revenue!** 💰

**Your professional restaurant directory will be live at www.swfldines.com! 🌴**