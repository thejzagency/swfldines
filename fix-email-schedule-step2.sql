/*
  STEP 2: RESCHEDULE EXISTING EMAIL SEQUENCES TO SEND IMMEDIATELY

  This updates the 3 restaurants you just uploaded to send their first
  email immediately instead of waiting 3 days.

  INSTRUCTIONS:
  1. Go to https://supabase.com/dashboard/project/wiosivnwuqroaoqojlse
  2. Click "SQL Editor" in the left sidebar
  3. Click "New Query"
  4. Copy and paste this ENTIRE file
  5. Click "Run" or press Cmd/Ctrl + Enter
*/

-- Update all active claim reminder sequences at step 0 to send NOW
UPDATE public.email_sequences
SET
  next_email_scheduled_at = NOW(),
  updated_at = NOW()
WHERE
  sequence_type = 'claim_reminder'
  AND current_step = 0
  AND status = 'active';

-- Show what was updated
SELECT
  es.id,
  r.name as restaurant_name,
  es.sequence_type,
  es.current_step,
  es.next_email_scheduled_at,
  'Rescheduled to send immediately' as status
FROM email_sequences es
JOIN restaurants r ON r.id = es.restaurant_id
WHERE
  es.sequence_type = 'claim_reminder'
  AND es.current_step = 0
  AND es.status = 'active';
