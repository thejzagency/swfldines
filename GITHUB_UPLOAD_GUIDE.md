# 📁 GitHub Upload Guide - Copy & Paste Method

## 🎯 **Since You Can't Download Files:**

I'll provide you with the exact content of each file to copy and paste into GitHub.

## 📦 **Step 1: Upload Core Files to GitHub**

### **File 1: package.json**
**Create new file in GitHub:** `package.json`
**Content:**
```json
{
  "name": "sw-florida-dines",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@stripe/stripe-js": "^7.9.0",
    "@supabase/supabase-js": "^2.57.4",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "stripe": "^18.5.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### **File 2: index.html**
**Create new file in GitHub:** `index.html`
**Content:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SW Florida Dines - Southwest Florida's Premier Restaurant Directory</title>
    <meta name="description" content="Discover the best restaurants in Southwest Florida. From Naples to Fort Myers, find your next favorite dining experience with SW Florida Dines." />
    <meta property="og:title" content="SW Florida Dines - Restaurant Directory" />
    <meta property="og:description" content="Southwest Florida's premier restaurant directory featuring the best dining experiences from Naples to Fort Myers." />
    <meta property="og:url" content="https://www.swfldines.com" />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="https://www.swfldines.com" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### **File 3: netlify.toml**
**Create new file in GitHub:** `netlify.toml`
**Content:**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_SUPABASE_URL = "https://mdodphmrgzexowgqbqto.supabase.co"
  VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kb2RwaG1yZ3pleG93Z3FicXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTk1OTgsImV4cCI6MjA3NDEzNTU5OH0.ib1lV5Pv1cau3dLBTjXVAkz5ndOsiNGJWK8QBoAu3Oo"
  VITE_HUNTER_API_KEY = "4571bddc4d92dbfb6d5c910f4b40de70b6465fb6"
  SITE_URL = "https://swfldines.com"
```

---

## 📁 **Step 2: Create Folder Structure**

In your GitHub repository, create these folders:
- `src/`
- `src/components/`
- `src/hooks/`
- `src/utils/`
- `src/types/`
- `public/`
- `supabase/`
- `supabase/functions/`
- `supabase/migrations/`

---

## 📄 **Step 3: Upload Key Configuration Files**

I'll provide the content for each file in the next steps. Start with these core files:

### **vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### **public/favicon.svg**
```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="16" fill="#2563eb"/>
  <g transform="translate(8, 8)">
    <path d="M3 2L5 6H15L13 2H3Z" fill="white" stroke="white" stroke-width="0.5"/>
    <path d="M6 10V14H12V10" fill="none" stroke="white" stroke-width="1"/>
    <path d="M2 6L2 14L4 14L4 6" fill="white"/>
    <path d="M14 6L14 14L16 14L16 6" fill="white"/>
    <circle cx="9" cy="12" r="1" fill="white"/>
  </g>
</svg>
```

---

## 🚀 **Benefits of This Approach:**

### **✅ Automated Website Updates:**
- Make changes in development
- Push to GitHub
- Netlify auto-deploys to swfldines.com
- **Zero manual file copying!**

### **✅ Keep Working Email System:**
- SendGrid stays in WebDevote
- All your email configurations preserved
- Restaurant approval emails keep working
- No migration headaches

### **✅ Professional Development Workflow:**
- Version control with Git
- Automated deployments
- Easy rollbacks if needed
- Collaborate with developers easily

---

## 📧 **Email System Stays Exactly the Same:**

Your Supabase edge functions will continue using the SendGrid API key that's already working in WebDevote. Nothing changes with your email system!

**Ready to start uploading files to GitHub?**