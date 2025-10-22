import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CSVUploader from './CSVUploader';
import BlogManager from './BlogManager';
import {
  ArrowLeft,
  Check,
  X,
  Mail,
  Building,
  Users,
  DollarSign,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Upload,
  FileText
} from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

type AdminView = 'overview' | 'restaurants' | 'users' | 'subscriptions' | 'analytics' | 'csv_upload' | 'blog';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    activeRestaurants: 0,
    pendingRestaurants: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    totalClicks: 0,
    viewsLast30Days: 0,
    clicksLast30Days: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRestaurants(),
        fetchUsers(),
        fetchSubscriptions(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('status, listing_type');

      const { data: userData } = await supabase
        .from('user_profiles')
        .select('id');

      const { data: subData } = await supabase
        .from('stripe_subscriptions')
        .select('status');

      const { count: totalViews } = await supabase
        .from('restaurant_views')
        .select('*', { count: 'exact', head: true });

      const { count: totalClicks } = await supabase
        .from('restaurant_clicks')
        .select('*', { count: 'exact', head: true });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: viewsLast30Days } = await supabase
        .from('restaurant_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', thirtyDaysAgo.toISOString());

      const { count: clicksLast30Days } = await supabase
        .from('restaurant_clicks')
        .select('*', { count: 'exact', head: true })
        .gte('clicked_at', thirtyDaysAgo.toISOString());

      const totalRestaurants = restaurantData?.length || 0;
      const activeRestaurants = restaurantData?.filter(r => r.status === 'active').length || 0;
      const pendingRestaurants = restaurantData?.filter(r => r.status === 'pending').length || 0;
      const totalUsers = userData?.length || 0;
      const activeSubscriptions = subData?.filter(s => s.status === 'active').length || 0;

      setStats({
        totalRestaurants,
        activeRestaurants,
        pendingRestaurants,
        totalUsers,
        activeSubscriptions,
        monthlyRevenue: activeSubscriptions * 49.99,
        totalViews: totalViews || 0,
        totalClicks: totalClicks || 0,
        viewsLast30Days: viewsLast30Days || 0,
        clicksLast30Days: clicksLast30Days || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproveRestaurant = async (restaurantId: string) => {
    try {
      console.log('Attempting to approve restaurant:', restaurantId);
      console.log('Current user:', user);

      const { data, error } = await supabase
        .from('restaurants')
        .update({ status: 'active' })
        .eq('id', restaurantId)
        .select();

      if (error) {
        console.error('Approval error details:', error);
        alert(`Failed to approve restaurant: ${error.message}\n\nCheck console for details.`);
        throw error;
      }

      console.log('Restaurant approved successfully:', data);
      alert('Restaurant approved!');
      fetchAllData();
    } catch (error: any) {
      console.error('Error approving restaurant:', error);
      console.error('Error code:', error?.code);
      console.error('Error details:', error?.details);
      console.error('Error hint:', error?.hint);
    }
  };

  const handleRejectRestaurant = async (restaurantId: string) => {
    if (!confirm('Are you sure you want to reject this restaurant?')) return;

    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ status: 'inactive' })
        .eq('id', restaurantId);

      if (error) throw error;
      alert('Restaurant rejected');
      fetchAllData();
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      alert('Failed to reject restaurant');
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    if (!confirm('Are you sure you want to DELETE this restaurant? This cannot be undone!')) return;

    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurantId);

      if (error) throw error;
      alert('Restaurant deleted');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Failed to delete restaurant');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      alert('User role updated');
      fetchAllData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to DELETE this user? This cannot be undone!')) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      alert('User deleted');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleCancelSubscription = async (customerId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const { error } = await supabase
        .from('stripe_subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true
        })
        .eq('customer_id', customerId);

      if (error) throw error;
      alert('Subscription cancelled');
      fetchAllData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const exportData = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Restaurants</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalRestaurants}</p>
              <p className="text-sm text-green-600 mt-2">
                {stats.activeRestaurants} active, {stats.pendingRestaurants} pending
              </p>
            </div>
            <Building className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500 mt-2">Registered accounts</p>
            </div>
            <Users className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeSubscriptions}</p>
              <p className="text-sm text-green-600 mt-2">
                ${stats.monthlyRevenue.toFixed(2)}/mo revenue
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Site-Wide Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Views</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">All-time</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">All-time</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Views (30d)</p>
            <p className="text-2xl font-bold text-green-600">{stats.viewsLast30Days.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Clicks (30d)</p>
            <p className="text-2xl font-bold text-green-600">{stats.clicksLast30Days.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
        {restaurants.filter(r => r.status === 'pending').length === 0 ? (
          <p className="text-gray-500">No pending restaurants</p>
        ) : (
          <div className="space-y-3">
            {restaurants.filter(r => r.status === 'pending').map(restaurant => (
              <div key={restaurant.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600">{restaurant.cuisine_type} • {restaurant.city}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(restaurant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveRestaurant(restaurant.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRestaurant(restaurant.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderRestaurants = () => {
    const filteredRestaurants = restaurants.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => exportData(restaurants, 'restaurants.csv')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuisine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRestaurants.map(restaurant => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{restaurant.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {restaurant.cuisine_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {restaurant.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      restaurant.listing_type === 'premium_plus' ? 'bg-purple-100 text-purple-800' :
                      restaurant.listing_type === 'premium' ? 'bg-blue-100 text-blue-800' :
                      restaurant.listing_type === 'featured' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {restaurant.listing_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
                      restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {restaurant.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRestaurant(restaurant.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRestaurant(restaurant.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <button
          onClick={() => exportData(users, 'users.csv')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(userProfile => (
              <tr key={userProfile.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {userProfile.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    userProfile.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userProfile.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateUserRole(
                        userProfile.id,
                        userProfile.role === 'admin' ? 'user' : 'admin'
                      )}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      {userProfile.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                    {userProfile.email !== user.email && (
                      <button
                        onClick={() => handleDeleteUser(userProfile.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Subscription Management</h3>
        <button
          onClick={() => exportData(subscriptions, 'subscriptions.csv')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono text-xs">
                  {sub.customer_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    sub.status === 'active' ? 'bg-green-100 text-green-800' :
                    sub.status === 'canceled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono text-xs">
                  {sub.price_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {sub.current_period_end ?
                    new Date(sub.current_period_end * 1000).toLocaleDateString() :
                    'N/A'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleCancelSubscription(sub.customer_id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Logged in as {user.email}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchAllData}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'restaurants', label: 'Restaurants', icon: Building },
              { id: 'csv_upload', label: 'CSV Upload', icon: Upload },
              { id: 'blog', label: 'Blog', icon: FileText },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'subscriptions', label: 'Subscriptions', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as AdminView)}
                className={`flex items-center px-4 py-3 border-b-2 font-medium transition-colors ${
                  currentView === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading admin data...</p>
          </div>
        ) : (
          <>
            {currentView === 'overview' && renderOverview()}
            {currentView === 'restaurants' && renderRestaurants()}
            {currentView === 'csv_upload' && <CSVUploader onUploadComplete={fetchAllData} />}
            {currentView === 'blog' && <BlogManager />}
            {currentView === 'users' && renderUsers()}
            {currentView === 'subscriptions' && renderSubscriptions()}
          </>
        )}
      </div>
    </div>
  );
}
