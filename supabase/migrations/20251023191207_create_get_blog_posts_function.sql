/*
  # Create Function to Get Blog Posts
  
  1. Changes
    - Create a database function to fetch published blog posts
    - This bypasses PostgREST schema cache issues
    - Function is immediately available to the REST API
  
  2. Security
    - Function is accessible to anon and authenticated roles
    - Only returns published posts
*/

-- Drop function if it exists
DROP FUNCTION IF EXISTS get_published_blog_posts();

-- Create function to get published blog posts
CREATE OR REPLACE FUNCTION get_published_blog_posts()
RETURNS TABLE (
  id uuid,
  title text,
  excerpt text,
  author text,
  published_at timestamptz,
  image_url text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    title,
    excerpt,
    author,
    published_at,
    image_url
  FROM blog_posts
  WHERE status = 'published'
  ORDER BY published_at DESC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_published_blog_posts() TO anon;
GRANT EXECUTE ON FUNCTION get_published_blog_posts() TO authenticated;