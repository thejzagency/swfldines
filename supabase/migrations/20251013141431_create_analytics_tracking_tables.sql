/*
  # Create Analytics Tracking Tables

  1. New Tables
    - `restaurant_views`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurants)
      - `viewed_at` (timestamptz)
      - `user_id` (uuid, nullable, foreign key to auth.users)
      - `session_id` (text, for anonymous tracking)
    
    - `restaurant_clicks`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurants)
      - `click_type` (text, e.g., 'website', 'phone', 'email', 'directions')
      - `clicked_at` (timestamptz)
      - `user_id` (uuid, nullable, foreign key to auth.users)
      - `session_id` (text, for anonymous tracking)

  2. Indexes
    - Index on restaurant_views.restaurant_id for fast lookups
    - Index on restaurant_views.viewed_at for time-based queries
    - Index on restaurant_clicks.restaurant_id for fast lookups
    - Index on restaurant_clicks.clicked_at for time-based queries

  3. Security
    - Enable RLS on both tables
    - Allow anyone to insert views and clicks (anonymous tracking)
    - Allow restaurant owners to read their own restaurant's analytics
    - Allow admins to read all analytics
*/

-- Create restaurant_views table
CREATE TABLE IF NOT EXISTS restaurant_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL
);

-- Create restaurant_clicks table
CREATE TABLE IF NOT EXISTS restaurant_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  click_type text NOT NULL,
  clicked_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurant_views_restaurant_id ON restaurant_views(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_views_viewed_at ON restaurant_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_restaurant_clicks_restaurant_id ON restaurant_clicks(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_clicks_clicked_at ON restaurant_clicks(clicked_at);

-- Enable RLS
ALTER TABLE restaurant_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (for tracking)
CREATE POLICY "Anyone can insert restaurant views"
  ON restaurant_views FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can insert restaurant clicks"
  ON restaurant_clicks FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Allow restaurant owners to view their own analytics
CREATE POLICY "Restaurant owners can view their own analytics"
  ON restaurant_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = restaurant_views.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can view their own click analytics"
  ON restaurant_clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = restaurant_clicks.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Allow admins to view all analytics
CREATE POLICY "Admins can view all analytics"
  ON restaurant_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can view all click analytics"
  ON restaurant_clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );