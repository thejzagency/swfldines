# 🚀 GitHub + Netlify Setup Guide (Keep WebDevote Email)

## 🎯 **Perfect Hybrid Approach!**

- ✅ **Website hosting:** GitHub + Netlify (automated deployments)
- ✅ **Email system:** Keep in WebDevote (already working)
- ✅ **Domain:** Point swfldines.com to Netlify
- ✅ **Best of both worlds:** Automation + working email

---

## 📦 **Step 1: Create GitHub Repository**

1. **Go to [github.com](https://github.com)**
2. **Sign up/login**
3. **Click "New repository"**
4. **Repository name:** `sw-florida-dines`
5. **Make it Public** (required for free Netlify)
6. **Click "Create repository"**

---

## 📁 **Step 2: Upload Your Project to GitHub**

### **Method A: GitHub Web Interface (Easiest)**

1. **In your new GitHub repository**
2. **Click "uploading an existing file"**
3. **Upload these files from your project:**
   - All files from `src/` folder
   - `package.json`
   - `index.html`
   - `vite.config.ts`
   - `tailwind.config.js`
   - `tsconfig.json`
   - `tsconfig.app.json`
   - `tsconfig.node.json`
   - `postcss.config.js`
   - `eslint.config.js`
   - `.env.production` (the file I just created)
   - `netlify.toml` (the file I just created)
   - `public/favicon.svg`
   - All `supabase/` folder contents

4. **Commit the files**

### **Method B: Git Commands (If you have Git)**

```bash
git init
git add .
git commit -m "Initial commit - SW Florida Dines"
git branch -M main
git remote add origin https://github.com/yourusername/sw-florida-dines.git
git push -u origin main
```

---

## 🌐 **Step 3: Deploy to Netlify**

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up with your GitHub account**
3. **Click "Add new site" → "Import from Git"**
4. **Connect to GitHub**
5. **Select your `sw-florida-dines` repository**
6. **Netlify auto-detects settings from `netlify.toml`:**
   - Build command: `npm run build`
   - Publish directory: `dist`
7. **Click "Deploy site"**

---

## 🌐 **Step 4: Add Custom Domain to Netlify**

1. **In Netlify Dashboard → Site Settings → Domain Management**
2. **Click "Add custom domain"**
3. **Enter:** `swfldines.com`
4. **Netlify will show DNS instructions**

---

## 📡 **Step 5: Update DNS (Point to Netlify)**

In **Namecheap** (where you bought the domain):

1. **Domain List → Manage swfldines.com**
2. **Advanced DNS tab**
3. **Delete existing WebDevote records**
4. **Add Netlify records:**

```
Type: CNAME
Host: @
Value: [your-netlify-site-name].netlify.app

Type: CNAME  
Host: www
Value: [your-netlify-site-name].netlify.app
```

---

## 📧 **Step 6: Keep Email System in WebDevote**

**The beauty of this approach:**

- ✅ **SendGrid stays in WebDevote** - Already configured and working
- ✅ **Edge functions in Supabase** - Use your existing SendGrid API key
- ✅ **No email migration needed** - Everything keeps working
- ✅ **Website gets automated deployment** - Push to GitHub = instant updates

**Your email system continues working exactly as it is now!**

---

## 🚀 **Step 7: Benefits of This Approach**

### **✅ Automated Deployments:**
- Push code to GitHub → Netlify auto-deploys
- No more manual file copying
- Instant updates and rollbacks

### **✅ Keep Working Email:**
- SendGrid stays in WebDevote
- No need to reconfigure anything
- Approval emails keep working

### **✅ Professional Setup:**
- Version control with GitHub
- Automated CI/CD pipeline
- Easy collaboration and updates

---

## 💰 **Ready for Business:**

Once this is set up:
1. **Make changes in development** → Push to GitHub → Auto-deploy
2. **Email system keeps working** → No interruption to business
3. **Focus on revenue** → Upload restaurant data and launch campaigns

**This is definitely the best approach - automation for the website, stability for the email system!**

Would you like me to help you set up the GitHub repository?