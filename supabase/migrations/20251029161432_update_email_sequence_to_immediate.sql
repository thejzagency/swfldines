/*
  # Update Email Sequence Timing to Immediate

  1. Changes
    - Update claim reminder trigger to schedule first email immediately (instead of 3 days delay)
    - Sequence timing is now: immediate, +3 days, +7 days from previous email
    
  2. Notes
    - This only affects NEW restaurants added after this migration
    - Existing sequences in the email_sequences table are NOT modified
*/

-- Update the function to schedule first email immediately
CREATE OR REPLACE FUNCTION create_claim_reminder_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Only create sequence if restaurant has an email and is not claimed
  IF NEW.email IS NOT NULL AND NEW.owner_id IS NULL THEN
    -- Schedule first email immediately
    first_email_date := NOW();
    
    INSERT INTO email_sequences (
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
END;
$$;