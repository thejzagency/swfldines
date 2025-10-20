/*
  # Fix Restaurant Claim Policy - Explicit Owner Check

  1. Changes
    - Drop existing UPDATE policy
    - Create new policy with explicit checks for claiming
    - Separate the logic for updating own restaurants vs claiming

  2. Security
    - Users can claim restaurants without an owner
    - Users can update restaurants they own
    - After claiming, the restaurant must belong to the user
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own restaurants or claim unclaimed ones" ON restaurants;

-- Create policy that explicitly handles both cases
CREATE POLICY "Allow restaurant updates and claims"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (
    -- Can update if they own it OR if it has no owner (claimable)
    (owner_id IS NULL) OR (owner_id = auth.uid())
  )
  WITH CHECK (
    -- After update, must be owned by current user
    (owner_id = auth.uid())
  );
