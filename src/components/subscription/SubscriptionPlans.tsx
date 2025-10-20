import React, { useState } from 'react';
import { stripeProducts } from '../../stripe-config';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Check, Crown, Star, Zap } from 'lucide-react';

interface SubscriptionPlansProps {
  onSuccess?: () => void;
}

export function SubscriptionPlans({ onSuccess }: SubscriptionPlansProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      setError('Please log in to subscribe');
      return;
    }

    setLoading(priceId);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode: 'subscription',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(null);
    }
  };

  const getIcon = (name: string) => {
    if (name.includes('Spotlight')) return Crown;
    if (name.includes('Premium')) return Star;
    if (name.includes('Featured')) return Zap;
    return Check;
  };

  const getFeatures = (name: string) => {
    if (name.includes('Spotlight')) {
      return [
        'Homepage spotlight placement',
        'Maximum visibility',
        'Priority in all searches',
        'Enhanced listing features',
        'Analytics dashboard',
        'Priority support'
      ];
    }
    if (name.includes('Premium')) {
      return [
        'Premium placement',
        'Enhanced features',
        'Priority in search results',
        'Photo gallery',
        'Social media integration',
        'Basic analytics'
      ];
    }
    if (name.includes('Featured')) {
      return [
        'Featured listing badge',
        'Higher search ranking',
        'Basic enhanced features',
        'Standard support'
      ];
    }
    return [];
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Restaurant Listing Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Increase your restaurant's visibility and attract more customers with our premium listing options.
          </p>
        </div>

        {error && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stripeProducts.map((product) => {
            const Icon = getIcon(product.name);
            const features = getFeatures(product.name);
            const isPopular = product.name.includes('Premium');
            const isLoading = loading === product.priceId;

            return (
              <div
                key={product.priceId}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  isPopular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-center mb-6">
                    {product.description}
                  </p>

                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(product.priceId)}
                    disabled={isLoading || !user}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? 'Processing...' : user ? 'Subscribe Now' : 'Login to Subscribe'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!user && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>{' '}
              to subscribe to a plan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}