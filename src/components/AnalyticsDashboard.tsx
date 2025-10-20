import React, { useEffect, useState } from 'react';
import { Eye, MousePointerClick, TrendingUp, Calendar } from 'lucide-react';
import { fetchRestaurantAnalytics } from '../utils/analytics';

interface AnalyticsDashboardProps {
  restaurantId: string;
  listingType: string;
  onUpgrade?: () => void;
}

interface ClicksByType {
  [key: string]: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ restaurantId, listingType, onUpgrade }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const data = await fetchRestaurantAnalytics(restaurantId, timeRange);
      setAnalytics(data);
      setLoading(false);
    };

    loadAnalytics();
  }, [restaurantId, timeRange]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const clicksByType = analytics?.clicks.reduce((acc: ClicksByType, click: any) => {
    acc[click.click_type] = (acc[click.click_type] || 0) + 1;
    return acc;
  }, {} as ClicksByType);

  const hasAccessToAdvanced = listingType === 'premium_plus';
  const hasAccessToBasic = ['premium', 'premium_plus'].includes(listingType);

  if (!hasAccessToBasic) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center">
        <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Analytics</h3>
        <p className="text-gray-600 mb-4">
          Upgrade to Premium or Spotlight to access visitor analytics and click tracking
        </p>
        <button
          onClick={onUpgrade}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === 7
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === 30
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
            {hasAccessToAdvanced && (
              <button
                onClick={() => setTimeRange(90)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === 90
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                90 Days
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics?.totalViews || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Last {timeRange} days</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
              <MousePointerClick className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics?.totalClicks || 0}</p>
            <p className="text-sm text-gray-500 mt-1">All interactions</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Engagement Rate</h3>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {analytics?.totalViews > 0
                ? Math.round((analytics?.totalClicks / analytics?.totalViews) * 100)
                : 0}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Clicks per view</p>
          </div>
        </div>

        {hasAccessToAdvanced && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(clicksByType || {}).map(([type, count]) => (
                <div key={type} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count as number}</div>
                  <div className="text-sm text-gray-600 capitalize">{type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasAccessToAdvanced && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center">
            <Calendar className="h-10 w-10 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock Advanced Analytics</h3>
            <p className="text-gray-600 mb-4">
              Upgrade to Spotlight tier for 90-day performance history and detailed click breakdowns
            </p>
            <button
              onClick={onUpgrade}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Upgrade to Spotlight
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
