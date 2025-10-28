/*
  # Fix Trigger Permissions - Simple Approach V2

  1. Problem
    - Trigger functions cannot use set_config('role', ...) 
    - Functions run as SECURITY DEFINER but need explicit grants

  2. Solution
    - Grant INSERT/UPDATE directly to the function owner (postgres)
    - Remove role switching attempts
    - Rely on SECURITY DEFINER to bypass RLS

  3. Security
    - Functions still run as SECURITY DEFINER
    - Only triggers can invoke these functions
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS create_claim_reminder_sequence() CASCADE;
DROP FUNCTION IF EXISTS create_upsell_sequence() CASCADE;

-- Grant permissions to postgres role (function owner)
GRANT INSERT, UPDATE ON email_sequences TO postgres;

-- Recreate claim reminder function (simpler, no role switching)
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
    -- Schedule first email for 3 days from now
    first_email_date := NOW() + INTERVAL '3 days';
    
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
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create email sequence: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate upsell function (simpler, no role switching)
CREATE OR REPLACE FUNCTION create_upsell_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Check if restaurant was just claimed
  IF OLD.owner_id IS NULL AND NEW.owner_id IS NOT NULL AND NEW.email IS NOT NULL THEN
    -- Schedule first email for 7 days from now
    first_email_date := NOW() + INTERVAL '7 days';
    
    -- Cancel any active claim reminder sequences
    UPDATE email_sequences
    SET status = 'cancelled'
    WHERE restaurant_id = NEW.id
      AND sequence_type = 'claim_reminder'
      AND status = 'active';
    
    -- Create upsell sequence
    INSERT INTO email_sequences (
      restaurant_id,
      sequence_type,
      current_step,
      total_steps,
      status,
      next_email_scheduled_at
    ) VALUES (
      NEW.id,
      'upsell',
      0,
      2,
      'active',
      first_email_date
    );
    
    RAISE NOTICE 'Created upsell sequence for restaurant: %', NEW.name;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create upsell sequence: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER on_restaurant_insert
  AFTER INSERT ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION create_claim_reminder_sequence();

CREATE TRIGGER on_restaurant_claimed
  AFTER UPDATE ON restaurants
  FOR EACH ROW
  WHEN (OLD.owner_id IS DISTINCT FROM NEW.owner_id)
  EXECUTE FUNCTION create_upsell_sequence();