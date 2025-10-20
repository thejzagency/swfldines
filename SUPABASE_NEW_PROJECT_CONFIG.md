# 🔧 Supabase "SW FL Dines Production" Configuration Checklist

## ✅ **Critical Settings You Need to Configure:**

Since you switched to the new "SW FL Dines Production" project, here are ALL the settings that need to be updated:

---

## **1. Authentication Settings**
**Go to: Authentication → Settings**

### **Site URL:**
```
https://sw-florida-dines-res-na06.bolt.host
```

### **Redirect URLs (add ALL of these):**
```
https://sw-florida-dines-res-na06.bolt.host/**
https://swfldines.com/**
https://www.swfldines.com/**
```

### **Email Settings:**
- ✅ **Enable email confirmations** (toggle ON)
- ✅ **Secure email change** (toggle ON)
- ✅ **Enable email change** (toggle ON)

---

## **2. SMTP Settings (CRITICAL)**
**Go to: Authentication → Settings → SMTP Settings**

**Enable Custom SMTP:** ✅ **ON**

**SMTP Configuration:**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: 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
```

**Sender Email:**
```
noreply@swfldines.com
```

**Sender Name:**
```
SW Florida Dines
```

---

## **3. Rate Limiting (You mentioned this)**
**Go to: Authentication → Settings → Rate Limiting**

**Increase these limits:**
- **Email signups:** 100 per hour (increase from default 30)
- **Password resets:** 100 per hour (increase from default 30)
- **Email OTP:** 100 per hour (increase from default 30)
- **SMS OTP:** 100 per hour (increase from default 30)

---

## **4. Edge Functions Environment Variables**
**Go to: Edge Functions → Settings → Environment Variables**

**Add these environment variables:**
```
SENDGRID_API_KEY=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
SITE_URL=https://swfldines.com
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

## **5. Email Templates**
**Go to: Authentication → Settings → Email Templates**

### **Confirm Signup Template:**
**Subject:** `Confirm your SW Florida Dines account`

**Template:**
```html
<h2>Welcome to SW Florida Dines!</h2>
<p>Thank you for creating an account with SW Florida Dines, Southwest Florida's premier restaurant directory.</p>
<p>Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
<p>Once confirmed, you'll be able to:</p>
<ul>
  <li>✅ Claim restaurant listings</li>
  <li>✅ Access your restaurant dashboard</li>
  <li>✅ Upload photos and manage your listings</li>
  <li>✅ Respond to customer reviews</li>
</ul>
<p>Welcome to the SW Florida Dines family!</p>
<p>The SW Florida Dines Team<br>
<a href="https://swfldines.com">swfldines.com</a></p>
```

---

## **6. Database Policies (Check These)**
**Go to: Database → Policies**

**Make sure these policies exist:**
- ✅ **restaurants:** "Anyone can read active restaurants"
- ✅ **user_profiles:** "Users can read own profile"
- ✅ **listing_tiers:** "Anyone can read active listing tiers"

---

## **7. API Settings (Verify)**
**Go to: Settings → API**

**Copy these values to your .env file:**
- ✅ **Project URL:** Should start with `https://`
- ✅ **anon public key:** Should start with `eyJhbGciOi`

---

## **8. Security Settings**
**Go to: Settings → Security**

**JWT Settings:**
- **JWT expiry:** 3600 (1 hour)
- **Refresh token rotation:** ✅ **Enabled**

---

## 🚨 **Most Common Issues After Project Switch:**

### **Issue 1: SMTP Not Working**
**Symptoms:** "Failed to send confirmation email"
**Fix:** Configure SMTP settings above

### **Issue 2: Rate Limits Hit**
**Symptoms:** "Too many requests" errors
**Fix:** Increase rate limits above

### **Issue 3: Wrong Site URL**
**Symptoms:** Auth redirects failing
**Fix:** Update Site URL to current domain

### **Issue 4: Missing Environment Variables**
**Symptoms:** Edge functions failing
**Fix:** Add environment variables above

---

## 🎯 **Quick Test After Configuration:**

1. **Try signing up** with a new email
2. **Check your email** for confirmation
3. **Click confirmation link**
4. **Login successfully**
5. **Browse restaurants** (should work)
6. **Access admin dashboard** (if you're admin)

---

## 📧 **If Emails Still Don't Work:**

**Go to: Authentication → Settings → SMTP Settings**

**Alternative SMTP (if SendGrid fails):**
```
Host: smtp.gmail.com
Port: 587
Username: your-gmail@gmail.com
Password: your-app-password
```

---

**Which specific error are you seeing right now? I can help you fix the exact configuration issue!**