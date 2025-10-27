/*
  # Force schema cache refresh for google_place_id column

  1. Changes
    - Add a comment to the google_place_id column to force PostgREST schema cache reload
    - This is a workaround for the schema cache not recognizing the newly added column

  2. Notes
    - The column already exists, we're just forcing Supabase to recognize it
    - This triggers a schema reload in PostgREST
*/

-- Add comment to force schema cache refresh
COMMENT ON COLUMN restaurants.google_place_id IS 'Google Places API Place ID for fetching reviews and ratings';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';