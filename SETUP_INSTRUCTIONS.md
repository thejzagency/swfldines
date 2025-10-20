# 🚀 SW Florida Dines Setup Instructions

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up/login** with GitHub or email
4. **Click "New Project"**
5. **Fill in project details:**
   - Name: `sw-florida-dines`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to your users (US East recommended)
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for setup to complete

## Step 2: Get Your Credentials

1. **In your Supabase dashboard, go to Settings → API**
2. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Update Environment Variables

1. **Open the `.env` file in your project**
2. **Replace the placeholder values:**

```bash
# Replace these with your actual Supabase values
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Keep these as-is for now
SENDGRID_API_KEY=your_sendgrid_api_key_here
VITE_HUNTER_API_KEY=your_hunter_io_api_key_here
SITE_URL=https://swfldines.com
```

## Step 4: Restart Development Server

After updating your `.env` file:
1. **Stop the current server** (Ctrl+C)
2. **Restart with:** `npm run dev`
3. **The error should disappear**
4. **You should see sample restaurants in the directory**

## ✅ What Happens Automatically

Once Supabase is connected:
- ✅ Database tables are created automatically
- ✅ Sample restaurant data is inserted
- ✅ User authentication is enabled
- ✅ Admin access is configured
- ✅ All features become available

## 🔧 Troubleshooting

**Still getting "Failed to fetch"?**
- Double-check your `VITE_SUPABASE_URL` (must start with https://)
- Verify your `VITE_SUPABASE_ANON_KEY` is the "anon public" key
- Make sure there are no extra spaces in your .env file
- Restart the development server after changes

**Database tables not created?**
- The migrations run automatically when you first access the app
- Check Supabase Dashboard → Table Editor to see if tables exist
- If tables are missing, they'll be created on first database query

## 🎯 Next Steps After Setup

1. **Test the application** - Browse restaurants, try search/filters
2. **Test authentication** - Sign up for an account
3. **Access admin dashboard** - Login and go to admin panel
4. **Add real restaurant data** - Use the CSV template in admin dashboard
5. **Configure email system** - Set up SendGrid for approval emails

---

**Need help?** Check the browser console for detailed error messages or contact support.