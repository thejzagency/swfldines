/*
  # Fix Restaurant INSERT Policy for CSV Uploads

  1. Problem
    - CSV uploads fail because INSERT policy requires auth.uid() = owner_id
    - Unclaimed restaurants have owner_id = NULL, so policy fails
    - This blocks legitimate CSV uploads of new restaurants

  2. Solution
    - Update INSERT policy to allow:
      a) Users inserting restaurants they own (auth.uid() = owner_id)
      b) Users inserting unclaimed restaurants (owner_id IS NULL)
      c) Admins can insert any restaurant

  3. Security
    - Still prevents users from creating restaurants owned by others
    - Allows legitimate CSV uploads of unclaimed restaurants
    - Admins maintain full control
*/

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create restaurants" ON restaurants;

-- Create new, more flexible INSERT policy
CREATE POLICY "Users can create restaurants"
  ON restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if owner_id is NULL (unclaimed restaurant)
    owner_id IS NULL
    OR
    -- Allow if user is the owner
    auth.uid() = owner_id
    OR
    -- Allow if user is an admin
    EXISTS (
      SELECT 1 
      FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
  );