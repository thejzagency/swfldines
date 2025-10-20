import { supabase } from '../lib/supabase';

// Generate a session ID for tracking user sessions
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get current user ID if logged in
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Track restaurant view
export const trackRestaurantView = async (restaurantId: string) => {
  try {
    const userId = await getCurrentUserId();
    const { error } = await supabase
      .from('restaurant_views')
      .insert({
        restaurant_id: restaurantId,
        user_id: userId,
        session_id: getSessionId()
      });

    if (error) {
      console.error('View tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track view:', error);
  }
};

// Track restaurant click (phone, website, email, directions, menu)
export const trackRestaurantClick = async (restaurantId: string, clickType: string) => {
  try {
    const userId = await getCurrentUserId();
    const { error } = await supabase
      .from('restaurant_clicks')
      .insert({
        restaurant_id: restaurantId,
        click_type: clickType,
        user_id: userId,
        session_id: getSessionId()
      });

    if (error) {
      console.error('Click tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track click:', error);
  }
};

// Convenience functions for specific click types
export const trackPhoneClick = (restaurantId: string) => trackRestaurantClick(restaurantId, 'phone');
export const trackWebsiteClick = (restaurantId: string) => trackRestaurantClick(restaurantId, 'website');
export const trackEmailClick = (restaurantId: string) => trackRestaurantClick(restaurantId, 'email');
export const trackDirectionsClick = (restaurantId: string) => trackRestaurantClick(restaurantId, 'directions');
export const trackMenuClick = (restaurantId: string) => trackRestaurantClick(restaurantId, 'menu');

// Fetch analytics for a restaurant (for dashboard display)
export const fetchRestaurantAnalytics = async (restaurantId: string, days: number = 30) => {
  try {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const [viewsResult, clicksResult] = await Promise.all([
      supabase
        .from('restaurant_views')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .gte('viewed_at', dateFrom.toISOString()),
      supabase
        .from('restaurant_clicks')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .gte('clicked_at', dateFrom.toISOString())
    ]);

    if (viewsResult.error) throw viewsResult.error;
    if (clicksResult.error) throw clicksResult.error;

    return {
      views: viewsResult.data || [],
      clicks: clicksResult.data || [],
      totalViews: viewsResult.data?.length || 0,
      totalClicks: clicksResult.data?.length || 0
    };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return { views: [], clicks: [], totalViews: 0, totalClicks: 0 };
  }
};