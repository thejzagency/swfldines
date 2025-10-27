/*
  # Add Google Place ID to Restaurants Table

  1. Changes
    - Add `google_place_id` column to restaurants table
    - This stores Google's unique identifier for each restaurant
    - Used to fetch reviews from Google Places API

  2. Important Notes
    - Column is nullable since not all restaurants may have a Google Place ID yet
    - Restaurant owners can add this when claiming their restaurant
    - Admins can add this when approving restaurants
*/

-- Add google_place_id column to restaurants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'google_place_id'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN google_place_id text;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_google_place_id ON restaurants(google_place_id);