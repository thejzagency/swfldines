/*
  # Ensure Email Sequence Triggers Exist

  1. Purpose
    - Automatically create email sequences when restaurants are added
    - Automatically create upsell sequences when restaurants are claimed
    - Ensures all restaurants get proper follow-up emails

  2. New Functions
    - `create_claim_reminder_sequence()` - Creates 3-step claim reminder sequence
    - `create_upsell_sequence()` - Creates 2-step upsell sequence for claimed restaurants

  3. New Triggers
    - `on_restaurant_insert` - Fires when new restaurant is added
    - `on_restaurant_claimed` - Fires when restaurant is claimed (owner_id changes from NULL to a value)

  4. How It Works
    - New restaurant added → creates claim reminder sequence (3 emails over 9 days)
    - Restaurant claimed → creates upsell sequence (2 emails over 14 days)
    - Sequences are processed daily by the email scheduler

  5. Security
    - Functions run with SECURITY DEFINER to bypass RLS
    - Only triggers can call these functions
*/

-- Function to create claim reminder sequence when restaurant is added
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
END;
$$;

-- Function to create upsell sequence when restaurant is claimed
CREATE OR REPLACE FUNCTION create_upsell_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  first_email_date timestamptz;
BEGIN
  -- Check if restaurant was just claimed (owner_id changed from NULL to a value)
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
END;
$$;

-- Trigger: Create claim reminder sequence when restaurant is inserted
DROP TRIGGER IF EXISTS on_restaurant_insert ON restaurants;
CREATE TRIGGER on_restaurant_insert
  AFTER INSERT ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION create_claim_reminder_sequence();

-- Trigger: Create upsell sequence when restaurant is claimed
DROP TRIGGER IF EXISTS on_restaurant_claimed ON restaurants;
CREATE TRIGGER on_restaurant_claimed
  AFTER UPDATE ON restaurants
  FOR EACH ROW
  WHEN (OLD.owner_id IS DISTINCT FROM NEW.owner_id)
  EXECUTE FUNCTION create_upsell_sequence();