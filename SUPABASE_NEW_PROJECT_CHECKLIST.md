# 🔧 Supabase New Project Configuration Checklist

## ✅ **What You Need to Configure in Your New Supabase Project:**

Since you switched from the old project to "SW FL Dines Production", here are the settings that need to be updated:

### **1. Authentication Settings**
**Go to: Authentication → Settings**

**Site URL:**
```
https://sw-florida-dines-res-na06.bolt.host
```

**Redirect URLs (add these):**
```
https://sw-florida-dines-res-na06.bolt.host/**
https://swfldines.com/**
https://www.swfldines.com/**
```

**Email Confirmation:**
- ✅ **Enable email confirmations** (toggle ON)
- ✅ **Secure email change** (toggle ON)

### **2. SMTP Settings**
**Go to: Authentication → Settings → SMTP Settings**

**Enable Custom SMTP:** ON

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

### **3. Rate Limiting**
**Go to: Authentication → Settings → Rate Limiting**

**Adjust these if you're hitting limits:**
- **Email signups:** 30 per hour (default is fine)
- **Password resets:** 30 per hour (default is fine)
- **Email OTP:** 30 per hour (default is fine)

### **4. Edge Functions Environment Variables**
**Go to: Edge Functions → Settings**

**Add these environment variables:**
```
SENDGRID_API_KEY=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
SITE_URL=https://swfldines.com
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### **5. Database Policies (if needed)**
**Go to: Database → Policies**

Make sure these policies exist:
- ✅ **restaurants:** "Anyone can read active restaurants"
- ✅ **user_profiles:** "Users can read own profile"
- ✅ **listing_tiers:** "Anyone can read active listing tiers"

### **6. API Settings**
**Go to: Settings → API**

**Verify these are correct:**
- ✅ **Project URL:** Should match your .env file
- ✅ **anon public key:** Should match your .env file
- ✅ **service_role key:** Keep this secret

---

## 🚨 **Most Likely Issues:**

### **Issue 1: SMTP Not Configured**
**Symptoms:** Email confirmations not sending
**Fix:** Add SendGrid SMTP settings above

### **Issue 2: Site URL Wrong**
**Symptoms:** Auth redirects failing
**Fix:** Update Site URL to your current domain

### **Issue 3: Rate Limits Hit**
**Symptoms:** "Too many requests" errors
**Fix:** Increase rate limits or wait

### **Issue 4: RLS Policies Missing**
**Symptoms:** "Permission denied" errors
**Fix:** Check Database → Policies

---

## 🎯 **Quick Test:**

After configuring the above:
1. **Try signing up** with a new email
2. **Check your email** for confirmation
3. **Login successfully**
4. **Browse restaurants** (should work)
5. **Access admin dashboard** (if you're admin)

---

**Which specific error are you seeing right now? I can help you fix the exact configuration issue.**