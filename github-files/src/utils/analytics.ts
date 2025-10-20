import { supabase } from '../lib/supabase';

export interface AnalyticsEvent {
  restaurant_id: string;
  event_type: 'page_view' | 'phone_click' | 'website_click' | 'directions_click' | 'menu_view';
  user_id?: string;
  session_id: string;
  metadata?: Record<string, any>;
}

// Generate a session ID for tracking user sessions
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track analytics events
export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    const { error } = await supabase
      .from('restaurant_analytics')
      .insert([{
        ...event,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Analytics tracking error:', error);
    } else {
      console.log('✅ Tracked event:', event.event_type, 'for restaurant:', event.restaurant_id);
    }
  } catch (error) {
    console.error('Failed to track analytics event:', error);
  }
};

// Track page view when someone opens a restaurant modal/page
export const trackPageView = (restaurantId: string, userId?: string) => {
  trackEvent({
    restaurant_id: restaurantId,
    event_type: 'page_view',
    user_id: userId,
    session_id: getSessionId()
  });
};

// Track when someone clicks the phone number
export const trackPhoneClick = (restaurantId: string, userId?: string) => {
  trackEvent({
    restaurant_id: restaurantId,
    event_type: 'phone_click',
    user_id: userId,
    session_id: getSessionId()
  });
};

// Track when someone clicks "Visit Website"
export const trackWebsiteClick = (restaurantId: string, userId?: string) => {
  trackEvent({
    restaurant_id: restaurantId,
    event_type: 'website_click',
    user_id: userId,
    session_id: getSessionId()
  });
};

// Track when someone clicks "Get Directions"
export const trackDirectionsClick = (restaurantId: string, userId?: string) => {
  trackEvent({
    restaurant_id: restaurantId,
    event_type: 'directions_click',
    user_id: userId,
    session_id: getSessionId()
  });
};

// Track when someone views the menu
export const trackMenuView = (restaurantId: string, userId?: string) => {
  trackEvent({
    restaurant_id: restaurantId,
    event_type: 'menu_view',
    user_id: userId,
    session_id: getSessionId()
  });
};

// Track inquiries (when someone contacts the restaurant)
export const trackInquiry = async (restaurantId: string, inquiryType: string, userId?: string) => {
  try {
    const { error } = await supabase
      .from('restaurant_inquiries')
      .insert([{
        restaurant_id: restaurantId,
        inquiry_type: inquiryType,
        user_id: userId,
        session_id: getSessionId(),
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Inquiry tracking error:', error);
    } else {
      console.log('✅ Tracked inquiry for restaurant:', restaurantId);
    }
  } catch (error) {
    console.error('Failed to track inquiry:', error);
  }
};