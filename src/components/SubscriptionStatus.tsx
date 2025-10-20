import React from 'react';
import { Crown } from 'lucide-react';

interface SubscriptionStatusProps {
  user: any;
}

export default function SubscriptionStatus({ user }: SubscriptionStatusProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Crown className="h-4 w-4 text-yellow-500" />
      <span className="text-gray-600">Free Plan</span>
    </div>
  );
}
