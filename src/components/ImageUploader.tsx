import React, { useState } from 'react';
import { Upload, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  restaurantId: string;
  currentImages: string[];
  listingType: 'free' | 'featured' | 'premium' | 'premium_plus';
  onImagesUpdate: (images: string[]) => void;
}

const IMAGE_LIMITS = {
  free: 0,
  featured: 5,
  premium: 15,
  premium_plus: 999
};

export function ImageUploader({ restaurantId, currentImages, listingType, onImagesUpdate }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxImages = IMAGE_LIMITS[listingType];
  const remainingSlots = maxImages - currentImages.length;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (currentImages.length >= maxImages) {
      setError(`You've reached your plan's image limit (${maxImages} images). Upgrade to add more.`);
      return;
    }

    if (files.length > remainingSlots) {
      setError(`You can only upload ${remainingSlots} more image(s) with your current plan.`);
      return;
    }

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 5MB limit`);
        }

        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${restaurantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      const newImages = [...currentImages, ...uploadedUrls];

      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ images: newImages })
        .eq('id', restaurantId);

      if (updateError) throw updateError;

      onImagesUpdate(newImages);
    } catch (err: any) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/restaurant-images/')[1];

      if (fileName) {
        await supabase.storage
          .from('restaurant-images')
          .remove([fileName]);
      }

      const newImages = currentImages.filter(img => img !== imageUrl);

      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ images: newImages })
        .eq('id', restaurantId);

      if (updateError) throw updateError;

      onImagesUpdate(newImages);
    } catch (err: any) {
      setError(err.message);
      console.error('Delete error:', err);
    }
  };

  if (maxImages === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Upgrade to Add Photos</h4>
            <p className="text-blue-800 text-sm mb-4">
              Photo galleries are available on Featured plans and above. Upgrade your listing to showcase your restaurant with beautiful images.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Photo Gallery</h3>
          <p className="text-sm text-gray-600">
            {currentImages.length} of {maxImages} {maxImages === 999 ? '(Unlimited)' : 'images used'}
          </p>
        </div>

        {currentImages.length < maxImages && (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Images'}
            </div>
          </label>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {currentImages.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images yet</p>
          <p className="text-sm text-gray-500">Upload images to showcase your restaurant</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Restaurant ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">Image Guidelines</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Maximum file size: 5MB per image</li>
          <li>• Accepted formats: JPG, PNG, WebP</li>
          <li>• Recommended dimensions: 1200x800px or higher</li>
          <li>• Use high-quality, well-lit photos of your food and venue</li>
        </ul>
      </div>
    </div>
  );
}
