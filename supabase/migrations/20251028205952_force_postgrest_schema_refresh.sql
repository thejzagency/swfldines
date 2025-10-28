/*
  # Force PostgREST Schema Cache Refresh

  1. Purpose
    - Force PostgREST to reload its schema cache
    - Ensures email_sequences table is recognized by the API layer
    - Fixes "relation does not exist" errors from frontend

  2. How it works
    - NOTIFY sends a signal to PostgREST to reload
    - Comment changes force migration system to recognize this
*/

-- Force PostgREST to reload schema immediately
NOTIFY pgrst, 'reload schema';

-- Add a comment to ensure this migration is recorded
COMMENT ON TABLE email_sequences IS 'Email automation sequences for restaurants - schema refreshed 2025-10-28';