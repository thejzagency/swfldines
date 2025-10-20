import React from 'react';
import { Restaurant } from '../types';
import RestaurantCard from './RestaurantCard';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  loading?: boolean;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({ 
  restaurants, 
  onRestaurantClick, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">We couldn't find any restaurants matching your criteria.</p>
          <div className="text-sm text-gray-500">
            Try adjusting your search terms or filters to discover more options.
          </div>
        </div>
      </div>
    );
  }

  // Sort restaurants by listing type priority
  // Spotlight (premium_plus) gets top 3 placement guarantee
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const priority = { 'premium_plus': 4, 'premium': 3, 'featured': 2, 'free': 1 };
    return (priority[b.listing_type] || 0) - (priority[a.listing_type] || 0);
  });

  // Ensure Spotlight restaurants are always in top 3 positions
  const spotlightRestaurants = sortedRestaurants.filter(r => r.listing_type === 'premium_plus').slice(0, 3);
  const otherRestaurants = sortedRestaurants.filter(r => r.listing_type !== 'premium_plus');
  const finalOrder = [...spotlightRestaurants, ...otherRestaurants];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {finalOrder.map((restaurant, index) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={onRestaurantClick}
        />
      ))}
    </div>
  );
};

export default RestaurantGrid;