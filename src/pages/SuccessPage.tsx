import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

export function SuccessPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
        } else {
          setSubscription(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, navigate]);

  const getSubscriptionName = () => {
    if (!subscription?.price_id) return 'Your Plan';
    const product = getProductByPriceId(subscription.price_id);
    return product?.name || 'Your Plan';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your subscription. Your payment has been processed successfully.
        </p>

        {loading ? (
          <div className="mb-6">
            <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4 mx-auto"></div>
          </div>
        ) : subscription ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Subscription Details</h3>
            <p className="text-gray-600">
              <strong>Plan:</strong> {getSubscriptionName()}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {subscription.subscription_status}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-700">
              Your subscription is being processed. You'll receive a confirmation email shortly.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Return to Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            View All Plans
          </button>
        </div>
      </div>
    </div>
  );
}