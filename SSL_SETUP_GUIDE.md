# 🔒 SSL Certificate Setup for swfldines.com

## ✅ **Your Domain is Working!**

Great news - swfldines.com is loading your restaurant directory! Now we just need to make it secure (HTTPS).

## 🔧 **Method 1: Cloudflare (Recommended - FREE)**

### **Step 1: Sign up for Cloudflare**
1. **Go to [cloudflare.com](https://cloudflare.com)**
2. **Click "Sign up"**
3. **Create a free account**

### **Step 2: Add Your Domain**
1. **Click "Add a site"**
2. **Enter:** `swfldines.com`
3. **Choose "Free" plan**
4. **Cloudflare will scan your DNS records**

### **Step 3: Update Nameservers**
1. **Cloudflare will give you 2 nameservers** (like `ns1.cloudflare.com`)
2. **Go to Namecheap → Domain List → Manage swfldines.com**
3. **Change nameservers from default to Cloudflare's**
4. **Wait 24 hours for propagation**

### **Step 4: Enable SSL**
1. **In Cloudflare Dashboard → SSL/TLS**
2. **Set to "Full" or "Flexible"**
3. **SSL certificate activates automatically**

## 🔧 **Method 2: Let's Encrypt via WebDevote**

### **Contact WebDevote Support:**
"Hi, my domain swfldines.com is pointing to my hosting account but shows 'not secure'. Can you please install a free SSL certificate (Let's Encrypt) for swfldines.com and www.swfldines.com?"

Most hosting providers can install free SSL certificates in 5-10 minutes.

## 🔧 **Method 3: Keep Using Bolt's SSL**

### **Alternative DNS Setup:**
Instead of pointing to WebDevote, point directly to Bolt:

**Record 1:**
- **Type:** CNAME
- **Name:** @
- **Value:** sw-florida-dines-res-na06.bolt.host.
- **TTL:** 3600

**Record 2:**
- **Type:** CNAME  
- **Name:** www
- **Value:** sw-florida-dines-res-na06.bolt.host.
- **TTL:** 3600

This way you get Bolt's SSL certificate automatically.

## 🎯 **Recommended Approach:**

**Use Method 3** (point both @ and www to Bolt) because:
- ✅ **Instant SSL** - Bolt already has certificates
- ✅ **No waiting** for certificate installation
- ✅ **No additional setup** required
- ✅ **Professional HTTPS** immediately

## 📋 **To Switch to Method 3:**

1. **Delete your current @ A record** (75.2.60.5)
2. **Add @ CNAME record** pointing to `sw-florida-dines-res-na06.bolt.host.`
3. **Keep your www CNAME record** as is
4. **Wait 15 minutes** for DNS to update
5. **Visit swfldines.com** - should be secure!

**Which method would you prefer?**