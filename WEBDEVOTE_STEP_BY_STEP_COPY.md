# 📁 Copy Files to WebDevote - Step by Step

## ✅ **Step 1: Create index.html in WebDevote**

You already have the HTML source! Now create it in WebDevote:

1. **In WebDevote File Manager → public_html folder**
2. **Create new file called `index.html`**
3. **Paste this exact content:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SW Florida Dines - Southwest Florida's Premier Restaurant Directory</title>
    <meta name="description" content="Discover the best restaurants in Southwest Florida. From Naples to Fort Myers, find your next favorite dining experience with SW Florida Dines." />
    <meta property="og:title" content="SW Florida Dines - Restaurant Directory" />
    <meta property="og:description" content="Southwest Florida's premier restaurant directory featuring the best dining experiences from Naples to Fort Myers." />
    <meta property="og:url" content="https://swfldines.com" />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="https://swfldines.com" />
    <script type="module" crossorigin src="/assets/index-CaxRjjjo.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-JcCyOqNx.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**Note:** I removed the Bolt badge script since you're moving to your own hosting.

---

## 📁 **Step 2: Create assets folder**

1. **In WebDevote File Manager → public_html**
2. **Create new folder called `assets`**

---

## 🎨 **Step 3: Get the CSS file**

1. **Open this URL in a new tab:**
   ```
   https://sw-florida-dines-res-na06.bolt.host/assets/index-JcCyOqNx.css
   ```

2. **You'll see all the CSS code**
3. **Select ALL the CSS code** (Ctrl+A)
4. **Copy it** (Ctrl+C)
5. **In WebDevote File Manager → public_html/assets/**
6. **Create new file called `index-JcCyOqNx.css`**
7. **Paste the CSS code**
8. **Save the file**

---

## ⚙️ **Step 4: Get the JavaScript file**

1. **Open this URL in a new tab:**
   ```
   https://sw-florida-dines-res-na06.bolt.host/assets/index-CaxRjjjo.js
   ```

2. **You'll see all the JavaScript code**
3. **Select ALL the JavaScript code** (Ctrl+A)
4. **Copy it** (Ctrl+C)
5. **In WebDevote File Manager → public_html/assets/**
6. **Create new file called `index-CaxRjjjo.js`**
7. **Paste the JavaScript code**
8. **Save the file**

---

## 🔄 **Step 5: Create _redirects file**

1. **In WebDevote File Manager → public_html**
2. **Create new file called `_redirects`** (no extension)
3. **Add this content:**
   ```
   /*    /index.html   200
   ```
4. **Save the file**

---

## 📋 **Step 6: Your File Structure Should Be:**

```
public_html/
├── index.html
├── _redirects
└── assets/
    ├── index-JcCyOqNx.css
    └── index-CaxRjjjo.js
```

---

## ⚙️ **Step 7: Add Environment Variables**

In your WebDevote control panel, add these environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_existing_sendgrid_key_from_webdevote
SITE_URL=https://swfldines.com
```

---

## 🌐 **Step 8: Point Your Domain**

In **Namecheap** (where you bought swfldines.com):
1. **Domain List → Manage swfldines.com**
2. **Advanced DNS tab**
3. **Add CNAME records** pointing to your WebDevote server

**Ask WebDevote support for the exact server name to point your domain to.**

---

**Start with Step 3 - open that CSS URL to get the stylesheet code!**