# 📁 Upload Files to WebDevote - Step by Step

## ✅ **Your Production Files Are Ready!**

I've built your SW Florida Dines restaurant directory. Here are the files you need to upload to WebDevote:

## 📦 **Files to Upload (from the `dist` folder):**

### **1. Main Website File:**
- `index.html` - This is your main website file

### **2. Assets Folder:**
- `assets/` folder - Contains all CSS and JavaScript
  - Inside you'll see files like `index-JcCyOqNx.css` and `index-8XduJkBp.js`
  - **Upload the entire `assets` folder**

### **3. Redirect Rules:**
- `_redirects` - Makes your single-page app work properly

## 🌐 **How to Upload to WebDevote:**

### **Step 1: Access Your Public Folder**
1. **In WebDevote File Manager**
2. **Open the `public_html` folder** (this is where websites go)
3. **Make sure it's empty** (you should have deleted WordPress files)

### **Step 2: Upload Method A - Individual Files**
1. **Click "Upload" button** in WebDevote File Manager
2. **Upload `index.html` first**
3. **Upload `_redirects` file**
4. **Create a new folder called `assets`**
5. **Go into the `assets` folder**
6. **Upload the CSS and JS files** from your `dist/assets` folder

### **Step 3: Upload Method B - Zip File (Easier)**
1. **Right-click on the `dist` folder** in your computer
2. **Create a ZIP file** of the entire `dist` folder
3. **Upload the ZIP file** to WebDevote
4. **Extract/Unzip it** in the `public_html` folder
5. **Move all files from the extracted folder** to the root of `public_html`

## 📋 **What Your `public_html` Should Look Like After Upload:**

```
public_html/
├── index.html
├── _redirects
└── assets/
    ├── index-JcCyOqNx.css
    └── index-8XduJkBp.js
```

## ⚙️ **Step 4: Add Environment Variables**

In your WebDevote control panel, find:
- **"Environment Variables"** or
- **"Application Settings"** or  
- **"Configuration"**

Add these:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_existing_sendgrid_key
SITE_URL=https://swfldines.com
```

## ✅ **Step 5: Test Your Site**

After upload:
1. **Visit swfldines.com** in your browser
2. **You should see your restaurant directory** (not WordPress!)
3. **Test signup/login** to make sure it works
4. **Login as admin** to access the dashboard

## 🚨 **If You Can't Download Files:**

Since you're in a web development environment, you might not be able to download files directly. In that case:

**Option A:** I can deploy to Bolt Hosting and you can point your domain there
**Option B:** I can create a simple deployment package you can copy/paste

**Which upload method works best for your WebDevote control panel?**