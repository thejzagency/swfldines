# 📁 WebDevote Deployment Files

## Your Production Files Are Ready!

Since you can't download from the development environment, here are the exact files you need to create in your WebDevote File Manager:

---

## 📄 **File 1: index.html**

**Location:** Upload to `public_html/index.html`

**Content:** (This is your main website file)
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
    <script type="module" crossorigin src="/assets/index-8XduJkBp.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-JcCyOqNx.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## 📄 **File 2: _redirects**

**Location:** Upload to `public_html/_redirects`

**Content:** (This makes your single-page app work properly)
```
/*    /index.html   200
```

---

## 📁 **Folder: assets**

**Location:** Create folder `public_html/assets/`

You'll need to create this folder and upload the CSS and JavaScript files to it. Since you can't download them, I'll need to deploy to a temporary location first so you can access them.

---

## 🚀 **Alternative: Deploy to Bolt First, Then Copy**

Since you can't download the files directly, here's the best approach:

1. **I'll deploy to Bolt hosting** (gives you a permanent URL)
2. **You can view the source** of that live site
3. **Copy the file contents** from the live site
4. **Paste them into WebDevote File Manager**
5. **Point your Namecheap domain** to WebDevote

This way you keep all your WebDevote/SendGrid setup intact!

**Should I deploy to Bolt hosting first so you can access the built files?**