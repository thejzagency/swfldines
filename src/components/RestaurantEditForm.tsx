import React, { useState } from 'react';
import { Save, X, Crown, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RestaurantEditFormProps {
  restaurant: any;
  onUpdate: (restaurant: any) => void;
}

export default function RestaurantEditForm({ restaurant, onUpdate }: RestaurantEditFormProps) {
  const [loading, setLoading] = useState(false);
  const listingType = restaurant.listing_type || 'free';

  const hasDescriptionAccess = ['featured', 'premium', 'premium_plus'].includes(listingType);
  const hasWebsiteAccess = ['featured', 'premium', 'premium_plus'].includes(listingType);
  const hasSocialAccess = ['featured', 'premium', 'premium_plus'].includes(listingType);
  const hasMenuUrlAccess = ['featured', 'premium', 'premium_plus'].includes(listingType);
  const hasFeaturesAccess = ['premium', 'premium_plus'].includes(listingType);

  const [formData, setFormData] = useState({
    name: restaurant.name || '',
    description: restaurant.description || '',
    cuisine_type: restaurant.cuisine_type || '',
    price_range: restaurant.price_range || '$$',
    phone: restaurant.phone || '',
    email: restaurant.email || '',
    website: restaurant.website || '',
    address: restaurant.address || '',
    city: restaurant.city || '',
    state: restaurant.state || 'FL',
    zip_code: restaurant.zip_code || '',
    hours_monday: restaurant.hours?.monday || '',
    hours_tuesday: restaurant.hours?.tuesday || '',
    hours_wednesday: restaurant.hours?.wednesday || '',
    hours_thursday: restaurant.hours?.thursday || '',
    hours_friday: restaurant.hours?.friday || '',
    hours_saturday: restaurant.hours?.saturday || '',
    hours_sunday: restaurant.hours?.sunday || '',
    features: restaurant.features?.join(', ') || '',
    menu_url: restaurant.menu_url || '',
    facebook_url: restaurant.facebook_url || '',
    instagram_url: restaurant.instagram_url || '',
    twitter_url: restaurant.twitter_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city) {
      alert('Please fill in required fields: Name, Address, and City');
      return;
    }

    setLoading(true);

    try {
      const hours: any = {};
      if (formData.hours_monday) hours.monday = formData.hours_monday;
      if (formData.hours_tuesday) hours.tuesday = formData.hours_tuesday;
      if (formData.hours_wednesday) hours.wednesday = formData.hours_wednesday;
      if (formData.hours_thursday) hours.thursday = formData.hours_thursday;
      if (formData.hours_friday) hours.friday = formData.hours_friday;
      if (formData.hours_saturday) hours.saturday = formData.hours_saturday;
      if (formData.hours_sunday) hours.sunday = formData.hours_sunday;

      const features = formData.features
        ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
        : [];

      const updateData: any = {
        name: formData.name,
        cuisine_type: formData.cuisine_type || '',
        price_range: formData.price_range,
        phone: formData.phone || '',
        email: formData.email || '',
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code || '',
        hours,
        updated_at: new Date().toISOString()
      };

      if (hasDescriptionAccess) {
        updateData.description = formData.description || '';
      }

      if (hasWebsiteAccess) {
        updateData.website = formData.website || '';
      }

      if (hasSocialAccess) {
        updateData.facebook_url = formData.facebook_url || '';
        updateData.instagram_url = formData.instagram_url || '';
        updateData.twitter_url = formData.twitter_url || '';
      }

      if (hasMenuUrlAccess) {
        updateData.menu_url = formData.menu_url || '';
      }

      if (hasFeaturesAccess) {
        updateData.features = features;
      }

      const { data, error } = await supabase
        .from('restaurants')
        .update(updateData)
        .eq('id', restaurant.id)
        .select()
        .single();

      if (error) throw error;

      alert('Restaurant details updated successfully!');
      onUpdate(data);
    } catch (error: any) {
      console.error('Error updating restaurant:', error);
      alert(`Failed to update restaurant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const LockedField = ({ children, locked, requiredTier }: { children: React.ReactNode; locked: boolean; requiredTier: string }) => {
    if (!locked) return <>{children}</>;

    return (
      <div className="relative">
        <div className="pointer-events-none opacity-50">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-5 rounded-lg">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-blue-600">
            <div className="flex items-center space-x-2 text-sm">
              <Crown className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-gray-900">Upgrade to {requiredTier}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Restaurant Details</h2>
        <p className="text-gray-600 mb-6">Update your restaurant information below</p>
        {listingType === 'free' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Free Tier:</span> Some fields are locked. Upgrade to Featured or higher to access all features.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="The Perfect Bistro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine Type
          </label>
          <input
            type="text"
            name="cuisine_type"
            value={formData.cuisine_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Italian, Mexican, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select
            name="price_range"
            value={formData.price_range}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="$">$ - Budget Friendly</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Upscale</option>
            <option value="$$$$">$$$$ - Fine Dining</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="(239) 555-1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="info@restaurant.com"
          />
        </div>

        <LockedField locked={!hasWebsiteAccess} requiredTier="Featured">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website {!hasWebsiteAccess && <Lock className="inline h-3 w-3 ml-1" />}
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={!hasWebsiteAccess}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="https://restaurant.com"
            />
          </div>
        </LockedField>
      </div>

      <LockedField locked={!hasDescriptionAccess} requiredTier="Featured">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description {!hasDescriptionAccess && <Lock className="inline h-3 w-3 ml-1" />}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!hasDescriptionAccess}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Tell us about this restaurant..."
          />
        </div>
      </LockedField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Fort Myers"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="FL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="33901"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours of Operation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {day}
              </label>
              <input
                type="text"
                name={`hours_${day}`}
                value={formData[`hours_${day}` as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="11:00 AM - 10:00 PM"
              />
            </div>
          ))}
        </div>
      </div>

      <LockedField locked={!hasFeaturesAccess} requiredTier="Premium">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features (comma-separated) {!hasFeaturesAccess && <Lock className="inline h-3 w-3 ml-1" />}
          </label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
            disabled={!hasFeaturesAccess}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Outdoor Seating, Delivery, Reservations"
          />
        </div>
      </LockedField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LockedField locked={!hasMenuUrlAccess} requiredTier="Featured">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu URL {!hasMenuUrlAccess && <Lock className="inline h-3 w-3 ml-1" />}
            </label>
            <input
              type="url"
              name="menu_url"
              value={formData.menu_url}
              onChange={handleChange}
              disabled={!hasMenuUrlAccess}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="https://restaurant.com/menu"
            />
          </div>
        </LockedField>

        <LockedField locked={!hasSocialAccess} requiredTier="Featured">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL {!hasSocialAccess && <Lock className="inline h-3 w-3 ml-1" />}
            </label>
            <input
              type="url"
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleChange}
              disabled={!hasSocialAccess}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="https://facebook.com/restaurant"
            />
          </div>
        </LockedField>

        <LockedField locked={!hasSocialAccess} requiredTier="Featured">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL {!hasSocialAccess && <Lock className="inline h-3 w-3 ml-1" />}
            </label>
            <input
              type="url"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              disabled={!hasSocialAccess}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="https://instagram.com/restaurant"
            />
          </div>
        </LockedField>

        <LockedField locked={!hasSocialAccess} requiredTier="Featured">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter URL {!hasSocialAccess && <Lock className="inline h-3 w-3 ml-1" />}
            </label>
            <input
              type="url"
              name="twitter_url"
              value={formData.twitter_url}
              onChange={handleChange}
              disabled={!hasSocialAccess}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="https://twitter.com/restaurant"
            />
          </div>
        </LockedField>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
