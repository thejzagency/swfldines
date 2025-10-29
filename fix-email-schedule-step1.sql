/*
  STEP 1: FIX EMAIL SCHEDULE FOR FUTURE RESTAURANTS

  Changes schedule from: 3 days, +3 days, +7 days
  To: Immediate, +3 days, +7 days

  INSTRUCTIONS:
  1. Go to https://supabase.com/dashboard/project/wiosivnwuqroaoqojlse
  2. Click "SQL Editor" in the left sidebar
  3. Click "New Query"
  4. Copy and paste this ENTIRE file
  5. Click "Run" or press Cmd/Ctrl + Enter
*/

-- Update the claim reminder function to send IMMEDIATELY
CREATE OR REPLACE FUNCTION public.create_claim_reminder_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Only create sequence if restaurant has an email and is not claimed
  IF NEW.email IS NOT NULL AND NEW.owner_id IS NULL THEN
    -- Schedule first email IMMEDIATELY (now)
    first_email_date := NOW();

    INSERT INTO public.email_sequences (
      restaurant_id,
      sequence_type,
      current_step,
      total_steps,
      status,
      next_email_scheduled_at
    ) VALUES (
      NEW.id,
      'claim_reminder',
      0,
      3,
      'active',
      first_email_date
    );

    RAISE NOTICE 'Created claim reminder sequence for restaurant: %', NEW.name;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create email sequence: %', SQLERRM;
    RETURN NEW;
END;
$$;

SELECT 'Email schedule fixed: Immediate, +3 days, +7 days' as status;
