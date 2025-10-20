# Supabase Setup Guide for SW Florida Dines

## 🚀 Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with GitHub or email
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name:** `sw-florida-dines`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

### 2. Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Update Environment Variables
Replace the placeholder values in your `.env` file:

```bash
# Replace these with your actual Supabase values
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Keep your SendGrid key as is
SENDGRID_API_KEY=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
SITE_URL=https://swfldines.com
```

### 4. Database Setup (Automatic)
The database tables and sample data will be created automatically using the migration files already in your project. No manual setup needed!

### 5. Test Connection
After updating your `.env` file:
1. Refresh your application
2. The error should disappear
3. You should see sample restaurants in the directory

## 🔧 Troubleshooting

**Still getting "Failed to fetch"?**
- Double-check your VITE_SUPABASE_URL (must start with https://)
- Verify your VITE_SUPABASE_ANON_KEY is the "anon public" key, not the service role key
- Make sure there are no extra spaces in your .env file
- Try refreshing the page after updating .env

**Database tables not created?**
- Go to Supabase Dashboard → SQL Editor
- Check if tables exist in the left sidebar
- If not, the migrations should run automatically when you first access the app

## 📞 Need Help?
If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project is "Active" (not paused)
3. Make sure you're using the correct project URL and anon key

---

**Once configured, your restaurant directory will have:**
- ✅ Full database with sample restaurants
- ✅ User authentication system  
- ✅ Admin dashboard access
- ✅ Restaurant claim functionality
- ✅ Email integration ready