import React from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { Crown, Star, Zap, AlertCircle } from 'lucide-react';

export function SubscriptionStatus() {
  const { subscription, loading, getSubscriptionName, isActive } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600">No active subscription</span>
        </div>
      </div>
    );
  }

  const planName = getSubscriptionName();
  const getIcon = () => {
    if (planName?.includes('Spotlight')) return Crown;
    if (planName?.includes('Premium')) return Star;
    if (planName?.includes('Featured')) return Zap;
    return Star;
  };

  const Icon = getIcon();
  const statusColor = isActive() ? 'text-green-600' : 'text-yellow-600';
  const bgColor = isActive() ? 'bg-green-50' : 'bg-yellow-50';

  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${statusColor} mr-2`} />
          <div>
            <h3 className="font-medium text-gray-900">
              {planName || 'Subscription Plan'}
            </h3>
            <p className={`text-sm ${statusColor} capitalize`}>
              {subscription.subscription_status.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        {subscription.cancel_at_period_end && (
          <div className="text-right">
            <p className="text-sm text-orange-600 font-medium">
              Cancels at period end
            </p>
          </div>
        )}
      </div>
    </div>
  );
}