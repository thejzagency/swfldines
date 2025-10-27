/*
  # Add google_place_id column to restaurants table

  1. Changes
    - Add `google_place_id` column to `restaurants` table
      - Type: text
      - Nullable: true (existing restaurants won't have this value)
      - Purpose: Store Google Places API Place ID for fetching reviews

  2. Notes
    - This column is used by the Google Reviews integration
    - Allows restaurants to link to their Google Business Profile
    - Used by the fetch-google-reviews edge function
*/

-- Add google_place_id column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS google_place_id text;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_google_place_id 
ON restaurants(google_place_id) 
WHERE google_place_id IS NOT NULL;