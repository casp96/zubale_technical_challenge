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
  technicalDetails?: Record<string, string>; // New field for product details
}

export interface CartItem {
  item: MarketplaceItem;
  quantity: number;
}

export type Category =
  | 'electronics'
  | 'clothing'
  | 'home'
  | 'beauty'
  | 'toys'
  | 'sports'
  | 'books'
  | 'automotive';

export const CATEGORIES: { key: Category; label: string; icon: string; color: string }[] = [
  { key: 'electronics', label: 'Electrónica', icon: '📱', color: '#3B82F6' },
  { key: 'clothing', label: 'Ropa', icon: '👕', color: '#EC4899' },
  { key: 'home', label: 'Hogar', icon: '🏠', color: '#10B981' },
  { key: 'beauty', label: 'Belleza', icon: '💄', color: '#F59E0B' },
  { key: 'toys', label: 'Juguetes', icon: '🎮', color: '#8B5CF6' },
  { key: 'sports', label: 'Deportes', icon: '⚽', color: '#EF4444' },
  { key: 'books', label: 'Libros', icon: '📚', color: '#6366F1' },
  { key: 'automotive', label: 'Autos', icon: '🚗', color: '#6B7280' },
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
