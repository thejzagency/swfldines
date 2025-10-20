import React, { useState } from 'react';
import { Filter, MapPin, DollarSign, Clock } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  cuisine: string;
  priceRange: string;
  city: string;
  features: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: '',
    priceRange: '',
    city: '',
    features: []
  });

  const cuisines = [
    'American', 'Italian', 'Mexican', 'Asian', 'Seafood', 'Steakhouse',
    'Mediterranean', 'Caribbean', 'BBQ', 'Fine Dining', 'Casual Dining'
  ];

  const cities = [
    'Naples', 'Fort Myers', 'Bonita Springs', 'Estero', 'Cape Coral',
    'Sanibel', 'Captiva', 'Marco Island', 'Punta Gorda', 'Port Charlotte'
  ];

  const features = [
    'Outdoor Seating', 'Live Music', 'Happy Hour', 'Brunch', 'Late Night',
    'Waterfront', 'Pet Friendly', 'Takeout', 'Delivery', 'Catering'
  ];

  const priceRanges = [
    { label: '$', value: '$' },
    { label: '$$', value: '$$' },
    { label: '$$$', value: '$$$' },
    { label: '$$$$', value: '$$$$' }
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    handleFilterChange('features', newFeatures);
  };

  const clearFilters = () => {
    const emptyFilters = { cuisine: '', priceRange: '', city: '', features: [] };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  // Show active filters count
  const activeFiltersCount = [
    filters.cuisine,
    filters.priceRange, 
    filters.city,
    ...filters.features
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeFiltersCount > 0 
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </span>
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>
          
          {/* Quick Filters - Always Visible */}
          <div className="mt-4 flex flex-wrap gap-2">
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
            >
              <option value="">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            
            <div className="flex space-x-1">
              {priceRanges.map(price => (
                <button
                  key={price.value}
                  onClick={() => handleFilterChange('priceRange', filters.priceRange === price.value ? '' : price.value)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    filters.priceRange === price.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white shadow-sm'
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Extended Filters */}
          {isOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {features.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.features.includes(feature)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;