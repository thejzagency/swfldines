/*
  # Setup Automated Email Scheduler

  1. Purpose
    - Automatically process scheduled email sequences daily
    - Sends upsell emails to restaurant owners at the right time
    - Fully automated, no admin intervention needed

  2. Changes
    - Enable pg_cron extension for scheduled jobs
    - Create function to trigger email processing edge function
    - Set up daily cron job to run at 10 AM Eastern Time

  3. How It Works
    - Every day at 10 AM ET, the cron job triggers
    - Calls the process-scheduled-emails edge function
    - Sends any emails that are due based on email_sequences table
    - Updates sequence status and schedules next email

  4. Notes
    - Uses pg_net extension to make HTTP requests
    - Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    - Runs automatically without any admin action needed
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to process scheduled emails
CREATE OR REPLACE FUNCTION process_scheduled_emails_job()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  request_id bigint;
BEGIN
  -- Get Supabase URL and service role key from environment
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings don't exist, use hardcoded values (will be set by environment)
  IF supabase_url IS NULL THEN
    supabase_url := 'https://wiosivnwuqroaoqojlse.supabase.co';
  END IF;

  -- Make HTTP request to the edge function
  SELECT net.http_post(
    url := supabase_url || '/functions/v1/process-scheduled-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_role_key, '')
    ),
    body := '{}'::jsonb
  ) INTO request_id;

  -- Log the request
  RAISE NOTICE 'Triggered email processing job, request_id: %', request_id;
END;
$$;

-- Schedule the job to run daily at 10 AM Eastern Time (14:00 UTC during standard time, 15:00 UTC during daylight saving)
-- Using 14:00 UTC as a safe default that covers most of the year
SELECT cron.schedule(
  'process-scheduled-emails',
  '0 14 * * *',
  $$SELECT process_scheduled_emails_job();$$
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
