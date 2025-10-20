/*
  # Add Social Media Fields to Restaurants

  1. Changes
    - Add `facebook_url` field for Facebook page links
    - Add `instagram_url` field for Instagram profile links
    - Add `twitter_url` field for Twitter profile links
    - Add `linkedin_url` field for LinkedIn page links
    - Add `youtube_url` field for YouTube channel links
    
  2. Notes
    - All fields are optional (nullable)
    - Default values are empty strings
    - These fields will be used for social media integration and display
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'facebook_url'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN facebook_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'instagram_url'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN instagram_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'twitter_url'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN twitter_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN linkedin_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'youtube_url'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN youtube_url text DEFAULT '';
  END IF;
END $$;