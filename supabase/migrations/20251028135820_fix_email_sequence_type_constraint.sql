/*
  # Fix Email Sequence Type Constraint

  1. Changes
    - Drop old constraint that only allowed 'verification', 'upsell', 'engagement'
    - Add new constraint that allows 'claim_reminder', 'upsell', 'engagement'
    - This matches the trigger functions that create sequences

  2. Reason
    - The trigger functions create 'claim_reminder' sequences but the constraint didn't allow it
    - This was causing restaurant inserts to fail
*/

-- Drop the old constraint
ALTER TABLE email_sequences
DROP CONSTRAINT IF EXISTS email_sequences_sequence_type_check;

-- Add new constraint with correct sequence types
ALTER TABLE email_sequences
ADD CONSTRAINT email_sequences_sequence_type_check
CHECK (sequence_type = ANY (ARRAY['claim_reminder'::text, 'upsell'::text, 'engagement'::text]));