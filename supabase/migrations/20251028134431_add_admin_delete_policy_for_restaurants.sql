/*
  # Add Admin Delete Policy for Restaurants

  1. Changes
    - Add RLS policy allowing admins to delete any restaurant
    - Admins are identified via user_profiles.role = 'admin'
  
  2. Security
    - Policy restricted to authenticated users only
    - Admin status verified via JOIN with user_profiles table
    - Existing user delete policy remains unchanged
*/

-- Drop existing restrictive delete policy if needed and recreate with admin access
DROP POLICY IF EXISTS "Admins can delete any restaurant" ON restaurants;

CREATE POLICY "Admins can delete any restaurant"
  ON restaurants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
  );
