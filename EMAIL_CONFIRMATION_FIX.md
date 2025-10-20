# 📧 Email Confirmation Fix - Complete Guide

## ✅ **What You Need to Update in Supabase:**

### **1. Site URL (Settings → API):**
```
FROM: https://sw-florida-dines-res-na06.bolt.host
TO:   https://swfldines.com
```

### **2. Redirect URLs (Settings → API):**
Add these URLs:
```
https://swfldines.com/**
https://www.swfldines.com/**
```

### **3. Email Template (Authentication → Settings → Email Templates):**

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

## 🧪 **Testing Steps:**

1. **Update all Supabase settings above**
2. **Re-enable email confirmations**
3. **Test with a new email address**
4. **Check that confirmation emails are received**
5. **Verify confirmation links work properly**

## 🎯 **Expected Result:**

- ✅ **New users get confirmation emails**
- ✅ **Emails are branded for SW Florida Dines**
- ✅ **Confirmation links redirect to swfldines.com**
- ✅ **Professional user experience**

## 💼 **Production Ready:**

Once this is working:
- Restaurant owners can sign up professionally
- Email confirmations build trust
- Reduces spam and fake accounts
- Ready for real business launch