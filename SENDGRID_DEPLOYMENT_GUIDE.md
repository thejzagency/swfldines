# 📧 SendGrid Email Setup & Deployment Guide

## 🚀 Step 1: Deploy the Edge Function

The edge function has been created in your project. Now you need to deploy it to Supabase:

### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref mdodphmrgzexowgqbqto

# Deploy the edge function
supabase functions deploy send-approval-email
```

### Option B: Manual Deployment via Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/mdodphmrgzexowgqbqto)
2. Navigate to **Edge Functions** in the left sidebar
3. Click **"New Function"**
4. Name it: `send-approval-email`
5. Copy the code from `supabase/functions/send-approval-email/index.ts`
6. Click **"Deploy Function"**

## 🔑 Step 2: Add SendGrid API Key to Supabase

1. **Go to your Supabase project settings:**
   - Visit: https://supabase.com/dashboard/project/mdodphmrgzexowgqbqto/settings/functions
   - Or navigate to **Project Settings** → **Edge Functions**

2. **Add Environment Variables:**
   - Click **"Add new variable"**
   - **Name:** `SENDGRID_API_KEY`
   - **Value:** `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`
   - Click **"Save"**

3. **Optional - Add Site URL:**
   - **Name:** `SITE_URL`
   - **Value:** `https://swfldines.com` (or your domain)

## 🧪 Step 3: Test the Email Function

After deployment:

1. **Go to your website footer**
2. **Click "Test Email System"**
3. **Enter your email address**
4. **Click "Send Test Email"**
5. **Check your inbox (and spam folder)**

## ✅ Expected Results

**If successful, you should see:**
- ✅ "Test email sent successfully!"
- 📧 Professional restaurant approval email in your inbox
- 🎉 Beautiful HTML email with SW Florida Dines branding

**If it fails, the test will show specific error messages like:**
- ❌ "SendGrid API key not configured" → Add the API key to Supabase
- ❌ "Function not deployed" → Deploy the edge function first
- ❌ "Invalid API key" → Check your SendGrid API key

## 🔧 Troubleshooting

### Function Not Found Error
- Make sure you deployed the edge function to Supabase
- Check the function name is exactly: `send-approval-email`

### SendGrid API Key Error
- Verify the API key is added to Supabase environment variables
- Make sure the key starts with `SG.`
- Check that your SendGrid account is verified

### Email Not Received
- Check your spam/junk folder
- Verify the sender email `noreply@swfldines.com` isn't blocked
- Try sending to a different email address

## 📞 Need Help?

If you're still having issues:
1. Check the Supabase Edge Functions logs in your dashboard
2. Look at the browser console for detailed error messages
3. Verify your SendGrid account status at sendgrid.com

---

**Once this is working, your restaurant approval emails will be sent automatically when you approve claims in the admin dashboard! 🎉**