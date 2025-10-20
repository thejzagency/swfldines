# 🌐 Complete Custom Domain Setup Guide for Beginners

## What We're Doing:
Right now your site is at: `https://sw-florida-dines-res-na06.bolt.host/`
We want it to be at: `https://swfldines.com`

Think of it like changing your address - we're telling the internet where to find your website.

---

## 📋 **Step 1: Find Your Domain Registrar**

**Where did you buy swfldines.com?** Common places:
- **GoDaddy** (godaddy.com)
- **Namecheap** (namecheap.com) 
- **Google Domains** (domains.google.com)
- **Cloudflare** (cloudflare.com)
- **Network Solutions** (networksolutions.com)

**How to find out:**
1. Go to [whois.net](https://whois.net)
2. Type in `swfldines.com`
3. Look for "Registrar" - that's where you bought it

---

## 🔧 **Step 2: Access Your Domain Settings**

### **For GoDaddy:**
1. Go to [godaddy.com](https://godaddy.com)
2. Click **"Sign In"** (top right)
3. Enter your login details
4. Click **"My Products"**
5. Find `swfldines.com` and click **"DNS"** or **"Manage"**

### **For Namecheap:**
1. Go to [namecheap.com](https://namecheap.com)
2. Click **"Sign In"** (top right)
3. Go to **"Domain List"**
4. Find `swfldines.com` and click **"Manage"**
5. Click **"Advanced DNS"** tab

### **For Other Registrars:**
Look for terms like:
- **"DNS Management"**
- **"DNS Settings"** 
- **"Domain Management"**
- **"Advanced DNS"**

---

## 📡 **Step 3: Add DNS Records**

You'll see a table with columns like:
- **Type** (A, CNAME, MX, etc.)
- **Name** (or Host)
- **Value** (or Points to)
- **TTL** (Time to Live)

### **Add These Two Records:**

#### **Record 1: Main Domain (swfldines.com)**
```
Type: CNAME
Name: @ (or leave blank, or "swfldines.com")
Value: sw-florida-dines-res-na06.bolt.host
TTL: Automatic (or 3600)
```

#### **Record 2: WWW Subdomain (www.swfldines.com)**
```
Type: CNAME  
Name: www
Value: sw-florida-dines-res-na06.bolt.host
TTL: Automatic (or 3600)
```

### **Visual Example (GoDaddy):**
```
Type    | Name | Value                                    | TTL
--------|------|------------------------------------------|--------
CNAME   | @    | sw-florida-dines-res-na06.bolt.host     | 1 Hour
CNAME   | www  | sw-florida-dines-res-na06.bolt.host     | 1 Hour
```

---

## ⏰ **Step 4: Wait for DNS Propagation**

**How long it takes:**
- **Usually:** 15 minutes to 2 hours
- **Sometimes:** Up to 24 hours (rare)
- **Check progress:** Use [whatsmydns.net](https://whatsmydns.net) and enter `swfldines.com`

**What's happening:**
The internet is updating its "phone book" to point your domain to your website.

---

## 🧪 **Step 5: Test Your Domain**

After waiting 30 minutes, try:
1. **Type `swfldines.com` in your browser**
2. **Type `www.swfldines.com` in your browser**
3. **Both should show your restaurant directory!**

---

## 🔧 **Step 6: Update Supabase Settings (After Domain Works)**

Once your domain is working:

1. **Go to Supabase Dashboard → Authentication → Settings**
2. **Change Site URL to:** `https://swfldines.com`
3. **Update Redirect URLs to:**
   - `https://swfldines.com/**`
   - `https://www.swfldines.com/**`
4. **Click "Save"**

---

## 🚨 **Common Issues & Solutions:**

### **"I can't find DNS settings"**
- Look for "Advanced DNS", "DNS Management", or "Nameservers"
- Some registrars hide it under "Domain Settings" or "Technical Settings"
- Call your registrar's support if you can't find it

### **"It's not working after 2 hours"**
- Check [whatsmydns.net](https://whatsmydns.net) to see propagation status
- Make sure you used the exact value: `sw-florida-dines-res-na06.bolt.host`
- Try clearing your browser cache (Ctrl+F5)

### **"I see a parking page"**
- Your registrar might have a "parking page" enabled
- Look for "Domain Forwarding" or "URL Forwarding" settings
- Disable parking and use DNS records instead

---

## 📞 **Need Help?**

**If you get stuck:**
1. **Take a screenshot** of your DNS settings page
2. **Tell me which registrar** you're using (GoDaddy, Namecheap, etc.)
3. **I'll give you exact instructions** for your specific registrar

**Your restaurant directory is already live and working perfectly - we're just giving it a professional domain name!** 🌴