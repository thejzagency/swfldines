# 📧 Enable Email Confirmation for SW Florida Dines

## Why Email Confirmation is Important:
- ✅ **Prevents fake accounts** and spam signups
- ✅ **Verifies restaurant owners** are legitimate
- ✅ **Builds trust** with professional email verification
- ✅ **Required for production** restaurant directory

## 🔧 **Step 1: Enable Email Confirmation in Supabase**

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → Settings**
3. **Find "Email Confirmation"** section
4. **Toggle ON "Enable email confirmations"**
5. **Click "Save"**

## 📧 **Step 2: Configure Email Templates**

In the same Authentication → Settings page:

1. **Scroll to "Email Templates"**
2. **Click "Confirm signup"**
3. **Customize the email template:**

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

4. **Update the subject line:** "Confirm your SW Florida Dines account"

## 🔗 **Step 3: Set Redirect URLs**

In Authentication → Settings:

1. **Site URL:** `https://sw-florida-dines-res-na06.bolt.host`
2. **Redirect URLs:** Add these:
   - `https://sw-florida-dines-res-na06.bolt.host/**`

## 📱 **Step 4: Update Your App to Handle Confirmation**

The app already has an `EmailConfirmationPage` component that will handle the confirmation flow automatically.

## ✅ **Step 5: Test the Flow**

1. **Sign up with a new email** (not admin@swfldines.com)
2. **Check your email** for the confirmation message
3. **Click the confirmation link**
4. **You should see the "Email Confirmed!" page**
5. **You can now login normally**

## 🔧 **For Your Admin Account:**

Since you already created `admin@swfldines.com` without confirmation:
1. **It should still work** (existing accounts aren't affected)
2. **If you have issues,** delete the account and recreate it
3. **New signups will require email confirmation**

## 💼 **Production Benefits:**

With email confirmation enabled:
- ✅ **Restaurant owners must verify** their email addresses
- ✅ **Reduces spam** and fake claims
- ✅ **Professional appearance** with branded confirmation emails
- ✅ **Better deliverability** for your approval emails

This is definitely the right approach for a production restaurant directory!