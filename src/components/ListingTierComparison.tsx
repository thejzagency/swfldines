import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { MetaTags } from './MetaTags';
import { supabase } from '../lib/supabase';

export default function ListingTierComparison() {
  return (
    <>
      <MetaTags
        title="Pricing - SW Florida Dines | Restaurant Listing Plans"
        description="Choose the perfect plan for your restaurant. From free basic listings to premium featured placement with analytics. Plans starting at $29/month."
        url="https://www.swfldines.com/pricing"
      />
      <PricingContent />
    </>
  );
}

function PricingContent() {
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlotCounts();
  }, []);

  const fetchSlotCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('listing_type');

      if (error) throw error;

      const counts: Record<string, number> = {
        featured: 0,
        premium: 0,
        premium_plus: 0
      };

      data?.forEach(r => {
        if (r.listing_type && counts[r.listing_type] !== undefined) {
          counts[r.listing_type]++;
        }
      });

      setSlotCounts(counts);
    } catch (error) {
      console.error('Error fetching slot counts:', error);
    } finally {
      setLoading(false);
    }
  };
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic directory listing',
        'Restaurant name & address',
        'Cuisine type display',
        'Phone & email contact',
        'Business hours',
        'Standard search results'
      ]
    },
    {
      name: 'Featured',
      price: '$29',
      period: 'per month',
      priceId: 'price_1S6H4HGMtBdGqLf3YTPzUtzF',
      slotsTotal: 50,
      features: [
        'Everything in Free',
        '5 photo gallery images',
        'Full description section',
        'Website & social media links',
        'Menu URL link',
        'Featured badge display',
        'Priority in search results'
      ]
    },
    {
      name: 'Premium',
      price: '$59',
      period: 'per month',
      priceId: 'price_1S6H4zGMtBdGqLf3yIbZ572d',
      popular: true,
      slotsTotal: 20,
      features: [
        'Everything in Featured',
        '15 photo gallery images',
        'Features/amenities section',
        'Visitor analytics dashboard',
        'Click & engagement tracking',
        '30-day performance history',
        'Enhanced search visibility'
      ]
    },
    {
      name: 'Spotlight',
      price: '$99',
      period: 'per month',
      priceId: 'price_1S6H5oGMtBdGqLf3O3L2mvrY',
      slotsTotal: 5,
      features: [
        'Everything in Premium',
        'Unlimited photo gallery',
        'Top search placement',
        'Homepage featured spot',
        'Advanced analytics',
        '90-day performance history',
        'Detailed click breakdown',
        'Priority support'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Listing Tiers</h1>
        <p className="text-xl text-gray-600">
          Choose the perfect plan for your restaurant
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white rounded-lg shadow-sm p-8 ${
              tier.popular ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            {tier.popular && (
              <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
              <span className="text-gray-500 ml-2">{tier.period}</span>
            </div>
            {tier.slotsTotal && !loading && (
              <div className="mb-6">
                {(() => {
                  const tierKey = tier.name.toLowerCase().replace(' ', '_').replace('spotlight', 'premium_plus');
                  const slotsUsed = slotCounts[tierKey] || 0;
                  const slotsRemaining = tier.slotsTotal - slotsUsed;
                  const percentFull = (slotsUsed / tier.slotsTotal) * 100;

                  return (
                    <div className={`p-3 rounded-lg ${
                      slotsRemaining <= 3 ? 'bg-red-50 border border-red-200' :
                      slotsRemaining <= 10 ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${
                          slotsRemaining <= 3 ? 'text-red-800' :
                          slotsRemaining <= 10 ? 'text-yellow-800' :
                          'text-green-800'
                        }`}>
                          {slotsRemaining <= 3 ? 'Almost Full!' :
                           slotsRemaining <= 10 ? 'Filling Fast' :
                           'Available'}
                        </span>
                        <span className="text-xs font-medium text-gray-600">
                          {slotsRemaining} of {tier.slotsTotal} left
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            slotsRemaining <= 3 ? 'bg-red-600' :
                            slotsRemaining <= 10 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${percentFull}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-semibold ${
                tier.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
