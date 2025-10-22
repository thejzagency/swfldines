/*
  # Create Restaurant Images Storage Bucket
  
  1. Storage Setup
    - Create public bucket for restaurant images
    - Set file size limit to 5MB per image
    - Allow only image file types
    - Enable image transformation
  
  2. Security
    - RLS policies for authenticated users to upload
    - Public read access for all images
    - Restaurant owners can only manage their own restaurant images
*/

-- Create storage bucket for restaurant images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'restaurant-images',
  'restaurant-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Restaurant owners can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'restaurant-images' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Allow restaurant owners to delete their own images
CREATE POLICY "Restaurant owners can delete their images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'restaurant-images' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Allow public read access to all restaurant images
CREATE POLICY "Public can view restaurant images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'restaurant-images');
