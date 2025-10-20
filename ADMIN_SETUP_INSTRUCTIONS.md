# 🔐 Admin Account Setup Instructions

## The Issue
You're getting "Invalid login credentials" because you don't have an admin account set up yet.

## 🎯 **Quick Fix (2 steps):**

### **Step 1: Sign Up for an Account**
1. **Go to your live site:** https://sw-florida-dines-res-na06.bolt.host/
2. **Click "Sign In"** in the top right
3. **Click "Sign up"** to create a new account
4. **Use this email:** `admin@swfldines.com`
5. **Create a password** (save it!)
6. **Fill in your name**
7. **Click "Create Account"**

### **Step 2: Make Yourself Admin**
1. **Go to your Supabase Dashboard → SQL Editor**
2. **Copy this SQL code:**
   ```sql
   UPDATE user_profiles 
   SET role = 'admin', updated_at = now()
   WHERE email = 'admin@swfldines.com';
   ```
3. **Paste it and click "Run"**
4. **You should see "1 row updated"**

### **Step 3: Login as Admin**
1. **Go back to your site**
2. **Login with:** `admin@swfldines.com` and your password
3. **You should now see the "Admin" button** in the header
4. **Click "Admin"** to access the dashboard

## 🔧 **Alternative: Use Your Own Email**

If you prefer to use your own email instead:

1. **Sign up with your own email** (like `yourname@gmail.com`)
2. **Run this SQL instead:**
   ```sql
   UPDATE user_profiles 
   SET role = 'admin', updated_at = now()
   WHERE email = 'yourname@gmail.com';
   ```
3. **Replace `yourname@gmail.com` with your actual email**

## ✅ **After Setup:**

Once you're logged in as admin, you can:
- ✅ **Access the admin dashboard**
- ✅ **Add restaurants via CSV upload**
- ✅ **Launch automated email campaigns**
- ✅ **Process restaurant claims**
- ✅ **Start generating revenue!**

---

**The system is working perfectly - you just need to create the admin account first!**