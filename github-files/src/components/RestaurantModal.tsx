import React from 'react';
import { X, MapPin, Phone, Globe, Clock, Star, Crown, ExternalLink, Building, CheckCircle } from 'lucide-react';
import { Restaurant } from '../types';
import { trackPageView, trackPhoneClick, trackWebsiteClick, trackDirectionsClick, trackMenuView } from '../utils/analytics';

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimRestaurant?: (restaurantId: string) => void;
  user?: any;
}

const RestaurantModal: React.FC<RestaurantModalProps> = ({ restaurant, isOpen, onClose, onClaimRestaurant, user }) => {
  // Track page view when modal opens
  React.useEffect(() => {
    if (isOpen && restaurant) {
      trackPageView(restaurant.id, user?.id);
    }
  }, [isOpen, restaurant, user]);

  if (!isOpen || !restaurant) return null;

  const getListingBadge = () => {
    switch (restaurant.listing_type) {
      case 'featured':
        return (
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Crown className="h-4 w-4 mr-1" />
            Featured
          </span>
        );
      case 'premium':
        return (
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Crown className="h-4 w-4 mr-1" />
            Premium
          </span>
        );
      case 'premium_plus':
        return (
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Crown className="h-4 w-4 mr-1" />
            Premium+
          </span>
        );
      default:
        return null;
    }
  };

  const formatHours = (hours: any) => {
    if (!hours) return 'Hours not available';
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      const dayHours = hours[day];
      if (!dayHours) return null;
      return (
        <div key={day} className="flex justify-between">
          <span className="capitalize font-medium">{day}:</span>
          <span>{dayHours}</span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
            {getListingBadge()}
            {restaurant.owner_claimed && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Claimed by Owner
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {restaurant.images.length > 0 ? (
              restaurant.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${restaurant.name} ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))
            ) : (
              <img
                src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={restaurant.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {restaurant.cuisine_type}
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {restaurant.price_range}
                  </span>
                </div>
                {restaurant.rating && (
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <Star className="h-5 w-5 mr-1 fill-current text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                    {restaurant.review_count && (
                      <span className="text-gray-600 ml-1">({restaurant.review_count} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{restaurant.description}</p>

              {/* Features */}
              {restaurant.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact & Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Hours</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{restaurant.address}</div>
                    <div className="text-gray-600">{restaurant.city}, {restaurant.state} {restaurant.zip_code}</div>
                  </div>
                </div>

                {restaurant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <a 
                      href={`tel:${restaurant.phone}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => trackPhoneClick(restaurant.id, user?.id)}
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      onClick={() => trackWebsiteClick(restaurant.id, user?.id)}
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}

                {restaurant.hours && (
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <span className="font-medium">Hours</span>
                    </div>
                    <div className="ml-8 space-y-1 text-sm text-gray-600">
                      {formatHours(restaurant.hours)}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {restaurant.phone && (
                  <button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={() => {
                      trackPhoneClick(restaurant.id, user?.id);
                      window.location.href = `tel:${restaurant.phone}`;
                    }}
                  >
                    Call Now
                  </button>
                )}
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    trackDirectionsClick(restaurant.id, user?.id);
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address + ', ' + restaurant.city + ', ' + restaurant.state)}`, '_blank');
                  }}
                >
                  Get Directions
                </button>
                {restaurant.menu_url && (
                  <button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={() => {
                      trackMenuView(restaurant.id, user?.id);
                      window.open(restaurant.menu_url, '_blank');
                    }}
                  >
                    View Menu
                  </button>
                )}
                
                {/* Claim Restaurant Button - only show if not already claimed */}
                {!restaurant.owner_claimed && onClaimRestaurant && (
                  <div className="space-y-2">
                    {user ? (
                      <button 
                        onClick={() => onClaimRestaurant(restaurant.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Claim This Restaurant (Free)
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-800 text-sm font-medium">
                            🔐 Login Required to Claim Restaurant
                          </p>
                          <p className="text-blue-700 text-xs mt-1">
                            Create an account to claim and manage your restaurant listing
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            onClose();
                            // This will trigger the auth modal in the parent component
                            window.dispatchEvent(new CustomEvent('show-auth'));
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Login to Claim Restaurant
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal;