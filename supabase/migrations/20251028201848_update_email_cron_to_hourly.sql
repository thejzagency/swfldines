/*
  # Update Email Processing to Run Every Hour

  1. Purpose
    - Change email processing from once daily to every hour
    - Ensures faster email delivery and better responsiveness
    - Maintains full automation with zero manual intervention

  2. Changes
    - Unschedule the old daily job
    - Create new hourly job that runs at the top of every hour
    - Uses existing process_scheduled_emails_job() function

  3. Schedule
    - Old: Once per day at 10 AM ET (14:00 UTC)
    - New: Every hour at minute 0 (00:00, 01:00, 02:00, etc.)

  4. Benefits
    - Emails sent within 1 hour of being due
    - More responsive to new restaurant additions
    - Better user experience for restaurant owners
*/

-- Unschedule the old daily job
SELECT cron.unschedule('process-scheduled-emails') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'process-scheduled-emails'
);

-- Schedule new hourly job
SELECT cron.schedule(
  'process-scheduled-emails-hourly',
  '0 * * * *',  -- Run every hour at minute 0
  $$SELECT process_scheduled_emails_job();$$
);

COMMENT ON FUNCTION process_scheduled_emails_job() IS 'Automated email processing - runs every hour to send scheduled emails';
