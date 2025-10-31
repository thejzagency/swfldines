/*
  # Remove Email Sequence Automation

  1. Context
    - Email sequences are now handled by SendGrid Marketing automation
    - Users are added to SendGrid lists via add-to-sendgrid-list edge function
    - SendGrid handles all email timing, sending, and tracking

  2. Changes
    - Drop cron job for processing scheduled emails
    - Drop triggers for creating email sequences
    - Drop functions for email sequence management
    - Drop email_sequences table (no longer needed)
    - Keep email_logs table (still useful for manual email tracking)

  3. Notes
    - This removes all duplicate email automation logic
    - All emails now flow through SendGrid Marketing automation only
*/

-- Drop cron job (if exists)
DO $$
BEGIN
  PERFORM cron.unschedule('process-scheduled-emails');
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Cron job process-scheduled-emails does not exist, skipping';
END $$;

-- Drop triggers
DROP TRIGGER IF EXISTS on_restaurant_insert ON public.restaurants;
DROP TRIGGER IF EXISTS on_restaurant_claimed ON public.restaurants;

-- Drop functions
DROP FUNCTION IF EXISTS public.create_claim_reminder_sequence() CASCADE;
DROP FUNCTION IF EXISTS public.create_upsell_sequence() CASCADE;

-- Drop email_sequences table
DROP TABLE IF EXISTS public.email_sequences CASCADE;

-- Email logs table is kept for tracking manual admin emails
-- No changes needed to email_logs table
