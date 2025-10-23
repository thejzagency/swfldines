/*
  # Force reload blog function for PostgREST

  1. Changes
    - Drop and recreate the get_published_blog_posts function
    - Add explicit grant to anon and authenticated roles
    - Notify PostgREST to reload schema cache
  
  2. Security
    - Function is SECURITY DEFINER to bypass RLS
    - Granted to anon and authenticated roles for public access
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS get_published_blog_posts();

-- Recreate the function with explicit grants
CREATE OR REPLACE FUNCTION get_published_blog_posts()
RETURNS TABLE(
  id uuid,
  title text,
  excerpt text,
  author text,
  published_at timestamp with time zone,
  image_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.excerpt,
    bp.author,
    bp.published_at,
    bp.image_url
  FROM blog_posts bp
  WHERE bp.status = 'published'
  ORDER BY bp.published_at DESC;
END;
$$;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_published_blog_posts() TO anon;
GRANT EXECUTE ON FUNCTION get_published_blog_posts() TO authenticated;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';