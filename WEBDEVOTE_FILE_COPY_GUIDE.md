# 📁 Copy Files from Bolt to WebDevote - Step by Step

## ✅ **Your Site is Already Live!**

Your restaurant directory is working perfectly at:
**https://sw-florida-dines-res-na06.bolt.host/**

Now we just need to copy the files to WebDevote so you can use your custom domain.

---

## 📄 **Step 1: Get the Main HTML File**

1. **Go to:** https://sw-florida-dines-res-na06.bolt.host/
2. **Right-click on the page** → **"View Page Source"**
3. **Copy ALL the HTML code** (Ctrl+A, then Ctrl+C)
4. **In WebDevote File Manager:**
   - Go to your `public_html` folder
   - Create a new file called `index.html`
   - Paste the HTML code
   - Save the file

---

## 📁 **Step 2: Create the Assets Folder**

1. **In WebDevote File Manager:**
   - Go to `public_html` folder
   - Create a new folder called `assets`

---

## 🎨 **Step 3: Get the CSS File**

1. **From the HTML source you copied, find the CSS link** (looks like):
   ```html
   <link rel="stylesheet" href="/assets/index-JcCyOqNx.css">
   ```
2. **Go to:** https://sw-florida-dines-res-na06.bolt.host/assets/index-JcCyOqNx.css
3. **Copy ALL the CSS code** (Ctrl+A, then Ctrl+C)
4. **In WebDevote File Manager:**
   - Go to the `assets` folder you created
   - Create a new file called `index-JcCyOqNx.css`
   - Paste the CSS code
   - Save the file

---

## ⚙️ **Step 4: Get the JavaScript File**

1. **From the HTML source, find the JavaScript link** (looks like):
   ```html
   <script type="module" src="/assets/index-CaxRjjjo.js"></script>
   ```
2. **Go to:** https://sw-florida-dines-res-na06.bolt.host/assets/index-CaxRjjjo.js
3. **Copy ALL the JavaScript code** (Ctrl+A, then Ctrl+C)
4. **In WebDevote File Manager:**
   - Go to the `assets` folder
   - Create a new file called `index-CaxRjjjo.js`
   - Paste the JavaScript code
   - Save the file

---

## 🔄 **Step 5: Create the Redirects File**

1. **In WebDevote File Manager:**
   - Go to `public_html` folder
   - Create a new file called `_redirects`
   - Add this content:
   ```
   /*    /index.html   200
   ```
   - Save the file

---

## 📋 **Step 6: Your File Structure Should Look Like:**

```
public_html/
├── index.html
├── _redirects
└── assets/
    ├── index-JcCyOqNx.css
    └── index-CaxRjjjo.js
```

---

## ⚙️ **Step 7: Add Environment Variables in WebDevote**

In your WebDevote control panel, find "Environment Variables" or "Configuration" and add:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_existing_sendgrid_key_from_webdevote
SITE_URL=https://swfldines.com
```

---

## 🌐 **Step 8: Point Your Domain**

In **Namecheap** (where you bought the domain):
1. **Go to Domain List** → **Manage swfldines.com**
2. **Advanced DNS** tab
3. **Add CNAME record:**
   ```
   Type: CNAME
   Host: @
   Value: [your-webdevote-server-name]
   ```
4. **Add WWW CNAME:**
   ```
   Type: CNAME
   Host: www
   Value: [your-webdevote-server-name]
   ```

**Ask WebDevote support for the exact server name to point your domain to.**

---

## ✅ **Result:**

- ✅ **swfldines.com** shows your restaurant directory
- ✅ **All SendGrid settings** stay exactly the same
- ✅ **Professional domain** for your business
- ✅ **Ready to start making money!**

**Start with Step 1 - view the source of your live Bolt site to get the HTML code!**