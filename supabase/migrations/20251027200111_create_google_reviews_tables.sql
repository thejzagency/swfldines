/*
  # Create Google Reviews Storage System

  1. New Tables
    - `google_reviews`
      - `id` (uuid, primary key) - unique identifier for each review
      - `restaurant_id` (uuid, foreign key) - links to restaurants table
      - `google_place_id` (text) - Google's unique place identifier
      - `author_name` (text) - reviewer's name
      - `author_photo_url` (text, nullable) - reviewer's profile photo
      - `rating` (integer) - star rating (1-5)
      - `text` (text, nullable) - review text content
      - `time` (bigint) - unix timestamp of review
      - `relative_time_description` (text) - e.g., "2 weeks ago"
      - `created_at` (timestamptz) - when we fetched this review
      - `updated_at` (timestamptz) - when we last updated this review
    
    - `restaurant_google_data`
      - `restaurant_id` (uuid, primary key, foreign key) - links to restaurants table
      - `google_place_id` (text) - Google's unique place identifier
      - `rating` (numeric) - overall Google rating (e.g., 4.5)
      - `user_ratings_total` (integer) - total number of ratings
      - `last_fetched_at` (timestamptz) - when we last fetched data from Google
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access (reviews are public data)
    - Only authenticated users can write (via Edge Functions)
    
  3. Indexes
    - Index on restaurant_id for fast lookups
    - Index on google_place_id for deduplication
    - Index on last_fetched_at for cache management

  4. Important Notes
    - Reviews are cached to minimize API costs
    - Data refreshes every 24 hours automatically
    - Stores up to 5 most recent reviews per restaurant
*/

-- Create google_reviews table
CREATE TABLE IF NOT EXISTS google_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  google_place_id text NOT NULL,
  author_name text NOT NULL,
  author_photo_url text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text,
  time bigint NOT NULL,
  relative_time_description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create restaurant_google_data table
CREATE TABLE IF NOT EXISTS restaurant_google_data (
  restaurant_id uuid PRIMARY KEY REFERENCES restaurants(id) ON DELETE CASCADE,
  google_place_id text NOT NULL UNIQUE,
  rating numeric(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
  user_ratings_total integer DEFAULT 0,
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_google_reviews_restaurant_id ON google_reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_google_reviews_place_id ON google_reviews(google_place_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_google_data_last_fetched ON restaurant_google_data(last_fetched_at);
CREATE INDEX IF NOT EXISTS idx_restaurant_google_data_place_id ON restaurant_google_data(google_place_id);

-- Enable Row Level Security
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_google_data ENABLE ROW LEVEL SECURITY;

-- Public can read reviews (they're public data)
CREATE POLICY "Anyone can view Google reviews"
  ON google_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view restaurant Google data"
  ON restaurant_google_data FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert/update (via Edge Functions)
CREATE POLICY "Authenticated users can insert reviews"
  ON google_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
  ON google_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON google_reviews FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert restaurant Google data"
  ON restaurant_google_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update restaurant Google data"
  ON restaurant_google_data FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_google_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_google_reviews_timestamp
  BEFORE UPDATE ON google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_google_reviews_updated_at();

CREATE TRIGGER update_restaurant_google_data_timestamp
  BEFORE UPDATE ON restaurant_google_data
  FOR EACH ROW
  EXECUTE FUNCTION update_google_reviews_updated_at();