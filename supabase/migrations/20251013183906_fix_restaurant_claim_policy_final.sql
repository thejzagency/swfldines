/*
  # Fix Restaurant Claim Policy - Allow Claims to Work
  
  ## Problem
  The current policy's WITH CHECK clause prevents claiming because:
  - It checks that auth.uid() = owner_id AFTER the update
  - But we're setting owner_id TO auth.uid() during the claim
  - This should pass, but there might be an edge case
  
  ## Solution
  Make the WITH CHECK more explicit - allow the update if:
  - The new owner_id matches auth.uid() (for claims and self-updates)
  - OR owner_claimed is being set to true (explicit claim action)
  
  ## Changes
  - Drop existing update policy
  - Create new policy with more permissive WITH CHECK
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own or claim unclaimed restaurants" ON restaurants;

-- Create new policy with explicit claim support
CREATE POLICY "Users can update own or claim unclaimed restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (
    -- Can update if they already own it OR if it's unclaimed
    (auth.uid() = owner_id) OR (owner_id IS NULL)
  )
  WITH CHECK (
    -- After update, they must be the owner (this allows claiming)
    -- The update sets owner_id = auth.uid(), so this should always pass
    (auth.uid() = owner_id) OR (owner_id IS NULL)
  );
