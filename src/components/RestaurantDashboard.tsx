import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Plus, Edit, Trash2, BarChart3, Crown } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import StripeCheckout from './StripeCheckout';

interface RestaurantDashboardProps {
  user: any;
  onBack: () => void;
}

export default function RestaurantDashboard({ user, onBack }: RestaurantDashboardProps) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchMyRestaurants();
  }, [user]);

  const fetchMyRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showUpgrade) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowUpgrade(false)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to My Restaurants
            </button>
          </div>
          <StripeCheckout user={user} restaurantId={restaurants[0]?.id} />
        </div>
      </div>
    );
  }

  if (selectedRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to My Restaurants
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedRestaurant.name}</h1>
            <p className="text-gray-600 mt-1">{selectedRestaurant.cuisine_type} • {selectedRestaurant.city}</p>
          </div>

          <AnalyticsDashboard
            restaurantId={selectedRestaurant.id}
            listingType={selectedRestaurant.listing_type}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Directory
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't claimed any restaurants yet</p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upgrade Section */}
            {restaurants.some(r => r.listing_type === 'free') && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Crown className="h-6 w-6 mr-2" />
                      <h3 className="text-xl font-bold">Upgrade Your Listing</h3>
                    </div>
                    <p className="text-blue-100">Get more visibility with Featured, Premium, or Spotlight plans</p>
                  </div>
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}

            {/* Restaurant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.cuisine_type}</p>
                    <p className="text-xs text-gray-500 mt-1">{restaurant.city}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      restaurant.listing_type === 'premium_plus' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                      restaurant.listing_type === 'premium' ? 'bg-purple-100 text-purple-800' :
                      restaurant.listing_type === 'featured' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {restaurant.listing_type === 'premium_plus' ? 'Spotlight' :
                       restaurant.listing_type === 'premium' ? 'Premium' :
                       restaurant.listing_type === 'featured' ? 'Featured' : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
                      restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.status}
                    </span>
                    <button
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
