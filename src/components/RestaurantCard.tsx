import React from 'react';
import { MapPin, Phone, Clock, Star, ExternalLink, Crown } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600 bg-green-50';
      case '$$': return 'text-yellow-600 bg-yellow-50';
      case '$$$': return 'text-orange-600 bg-orange-50';
      case '$$$$': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600';
    }
  };

  const getListingBadge = () => {
    switch (restaurant.listing_type) {
      case 'featured':
        return (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Featured
          </div>
        );
      case 'premium':
        return (
          <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </div>
        );
      case 'premium_plus':
        return (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Premium+
          </div>
        );
      default:
        return null;
    }
  };

  const primaryImage = restaurant.images[0] || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => onClick(restaurant)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={primaryImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {getListingBadge()}
        {restaurant.owner_claimed && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Claimed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {restaurant.name}
          </h3>
          <span className={`text-sm font-bold px-2 py-1 rounded-full ${getPriceRangeColor(restaurant.price_range)}`}>
            {restaurant.price_range}
          </span>
        </div>

        <p className="text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {restaurant.cuisine_type}
            </span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{restaurant.city}, FL</span>
          </div>

          {restaurant.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              {restaurant.status === 'pending' ? 'Pending Approval' : 'Claimed'}
            </div>
          )}
        </div>

        {/* Features */}
        {restaurant.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {restaurant.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {restaurant.features.length > 3 && (
              <span className="text-gray-500 text-xs">+{restaurant.features.length - 3} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-md ${
            restaurant.status === 'pending' 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            {restaurant.status === 'pending' ? 'Pending Approval' : 'View Details'}
          </button>
          {restaurant.website && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(restaurant.website, '_blank');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-all transform hover:scale-105"
              title="Visit Website"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;