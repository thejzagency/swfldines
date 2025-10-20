# 🔄 Replace WordPress Site with SW Florida Dines React App

## ⚠️ **IMPORTANT: Backup First!**

Before deleting anything:
1. **Download a backup** of your current WordPress site (just in case)
2. **Export any important content** you want to keep
3. **Save any custom settings** or configurations

## 🗑️ **Step 1: Clear Out WordPress Files**

In your WebDevote File Manager:

### **Delete These WordPress Files/Folders:**
- `wp-admin/` (WordPress admin folder)
- `wp-content/` (themes, plugins, uploads)
- `wp-includes/` (WordPress core files)
- `index.php` (WordPress main file)
- `wp-config.php` (WordPress configuration)
- `.htaccess` (WordPress URL rules)
- Any other `.php` files
- `readme.html`
- `license.txt`
- `xmlrpc.php`

### **Keep These Files (if they exist):**
- Any custom HTML files you want to preserve
- Image files you might want to use later
- Any non-WordPress files

### **How to Delete in WebDevote File Manager:**
1. **Select multiple files** (usually Ctrl+Click or Shift+Click)
2. **Right-click → Delete** or look for a "Delete" button
3. **Confirm the deletion**
4. **Repeat until the folder is clean**

## 📁 **Step 2: Upload Your React App Files**

After clearing the WordPress files, upload ALL files from your `dist` folder:

### **Files to Upload:**
- `index.html` (your new main page)
- `assets/` folder (contains all CSS and JavaScript)
- `_redirects` (makes your single-page app work)

### **Upload Process:**
1. **Click "Upload" or "Upload Files"** in WebDevote File Manager
2. **Select ALL files from your `dist` folder**
3. **Upload them to the root directory** (same place where WordPress was)
4. **Make sure `index.html` is in the root** (not in a subfolder)

## ⚙️ **Step 3: Configure Environment Variables**

In WebDevote control panel, look for:
- **"Environment Variables"**
- **"Application Settings"**
- **"Configuration"**
- **"PHP Settings"** (might be under here)

Add these:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_existing_sendgrid_key
SITE_URL=https://swfldines.com
```

## 🔧 **Step 4: Update Supabase Settings**

Once your React app is live:
1. **Go to Supabase Dashboard → Authentication → Settings**
2. **Update Site URL to:** `https://swfldines.com`
3. **Update Redirect URLs to:** `https://swfldines.com/**`

## ✅ **Step 5: Test Everything**

After upload:
1. **Visit swfldines.com** - Should show your restaurant directory (not WordPress)
2. **Test user signup** - Should work with your existing email setup
3. **Login as admin** - Should access the admin dashboard
4. **Test restaurant features** - Browse, search, claim restaurants

## 🎯 **What You'll See:**

**Before:** WordPress blog/site
**After:** Professional restaurant directory with:
- Modern search and filtering
- Restaurant claiming system
- Admin dashboard for management
- Automated email campaigns
- Revenue-generating subscription tiers

## 💡 **Pro Tip:**

Since you already have SendGrid working through WebDevote, your restaurant approval emails will work immediately - no additional email configuration needed!

## 🚨 **If Something Goes Wrong:**

- **Site shows errors?** Check that `index.html` is in the root directory
- **Features not working?** Verify environment variables are set correctly
- **Email issues?** Your existing SendGrid setup should continue working

**This is definitely the right approach - replace WordPress with your modern restaurant directory platform!**

Ready to clear out WordPress and upload your React app?