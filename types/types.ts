// Marketplace Item Types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  distance: number; // in km
  category: Category;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  postedAt: string;
  urgent: boolean;
  featured: boolean;
}

export type Category = 
  | 'food_delivery'
  | 'shopping'
  | 'warehouse'
  | 'cleaning'
  | 'surveys'
  | 'delivery'
  | 'driving'
  | 'tech';

export const CATEGORIES: { key: Category; label: string; icon: string; color: string }[] = [
  { key: 'food_delivery', label: 'Food Delivery', icon: '🍔', color: '#FF6B6B' },
  { key: 'shopping', label: 'Shopping', icon: '🛒', color: '#4ECDC4' },
  { key: 'warehouse', label: 'Warehouse', icon: '📦', color: '#FFE66D' },
  { key: 'cleaning', label: 'Cleaning', icon: '🧹', color: '#95E1D3' },
  { key: 'surveys', label: 'Surveys', icon: '📋', color: '#DDA0DD' },
  { key: 'delivery', label: 'Delivery', icon: '🚚', color: '#87CEEB' },
  { key: 'driving', label: 'Driving', icon: '🚗', color: '#F0E68C' },
  { key: 'tech', label: 'Tech Support', icon: '💻', color: '#B8B8FF' },
];

// Filter State
export interface FilterState {
  priceRange: [number, number];
  distanceRange: [number, number];
  categories: Category[];
  searchQuery: string;
  sortBy: SortOption;
}

export type SortOption = 'price_asc' | 'price_desc' | 'distance' | 'rating' | 'recent';

export type ViewMode = 'list' | 'masonry';

// Default filter values
export const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 500],
  distanceRange: [0, 50],
  categories: [],
  searchQuery: '',
  sortBy: 'distance',
};

// Price and distance bounds
export const PRICE_BOUNDS = { min: 0, max: 500 };
export const DISTANCE_BOUNDS = { min: 0, max: 50 };
