# 📊 Real Analytics Setup Instructions

## Step 1: Copy This SQL Code

Copy the SQL code below and paste it into your Supabase SQL Editor:

```sql
-- Analytics Tables for Real Tracking
-- This creates the tables needed for real analytics data

-- Table for tracking all user interactions with restaurants
CREATE TABLE IF NOT EXISTS restaurant_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'phone_click', 'website_click', 'directions_click', 'menu_view')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Table for tracking customer inquiries and conversions
CREATE TABLE IF NOT EXISTS restaurant_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  inquiry_type text NOT NULL DEFAULT 'general',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  contact_method text, -- phone, email, form, etc.
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurant_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for restaurant_analytics
CREATE POLICY "Anyone can insert analytics events"
  ON restaurant_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Restaurant owners can read own analytics"
  ON restaurant_analytics FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_analytics.restaurant_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all analytics"
  ON restaurant_analytics FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for restaurant_inquiries
CREATE POLICY "Anyone can insert inquiries"
  ON restaurant_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Restaurant owners can read own inquiries"
  ON restaurant_inquiries FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_inquiries.restaurant_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all inquiries"
  ON restaurant_inquiries FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurant_analytics_restaurant_id ON restaurant_analytics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_analytics_event_type ON restaurant_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_restaurant_analytics_created_at ON restaurant_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_restaurant_inquiries_restaurant_id ON restaurant_inquiries(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_inquiries_created_at ON restaurant_inquiries(created_at);

-- Fix pricing while we're at it
UPDATE listing_tiers SET price = 59 WHERE name = 'Premium';
UPDATE listing_tiers SET price = 99 WHERE name = 'Premium Plus';
```

## Step 2: Run the SQL

1. In your Supabase SQL Editor (where you took the screenshot)
2. Click "New query" 
3. Paste the SQL code above
4. Click "Run" button
5. You should see "Success. No rows returned" or similar

## Step 3: Test the Analytics

After running the SQL:
- Visit a restaurant page on your site
- Click phone, website, or directions buttons
- Go to the restaurant dashboard → Analytics tab
- You should see real data instead of zeros!

## What This Does:

✅ **Creates real analytics tracking tables**
✅ **Fixes pricing in database** (Premium $59, Premium+ $99)  
✅ **Sets up security policies** so restaurant owners only see their own data
✅ **Creates database indexes** for fast analytics queries
✅ **Enables real-time tracking** of user interactions

After running this SQL, your analytics will be 100% real data! 🚀