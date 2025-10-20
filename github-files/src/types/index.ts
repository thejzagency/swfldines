export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  phone: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  hours?: RestaurantHours;
  features: string[];
  images: string[];
  menu_url?: string;
  rating?: number;
  review_count?: number;
  listing_type: 'free' | 'featured' | 'premium' | 'premium_plus';
  owner_claimed: boolean;
  owner_id?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface RestaurantHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'restaurant_owner' | 'user';
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}