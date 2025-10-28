/*
  # Fix Email Sequences RLS WITH CHECK Clause

  1. Problem
    - "System can manage email sequences" policy has NULL with_check
    - This blocks INSERT operations from triggers
    - Frontend CSV uploads trigger the insert, which then fails

  2. Solution
    - Recreate policy with explicit WITH CHECK (true)
    - Ensures both USING and WITH CHECK are set

  3. Security
    - Policy still restricted to authenticated users
    - Trigger functions run as SECURITY DEFINER
*/

-- Drop and recreate the system policy with explicit WITH CHECK
DROP POLICY IF EXISTS "System can manage email sequences" ON email_sequences;

CREATE POLICY "System can manage email sequences"
  ON email_sequences
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);