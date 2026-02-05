import { DEFAULT_FILTERS, FilterState, ViewMode } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const KEYS = {
  FILTERS: 'marketplace.filters',
  VIEW_MODE: 'marketplace.viewMode',
  LAST_SYNC: 'marketplace.lastSync',
  FAVORITES: 'marketplace.favorites',
  CART: 'marketplace.cart',
  SESSION: 'marketplace.session',
} as const;

// Helper to log storage operations
const log = (op: string, key: string, value: any) => {
  console.log(`[Storage] ${op} | ${key} |`, value);
};

// Filter persistence
export async function saveFilters(filters: FilterState): Promise<void> {
  log('SAVE', KEYS.FILTERS, 'filters updated');
  await AsyncStorage.setItem(KEYS.FILTERS, JSON.stringify(filters));
}

export async function loadFilters(): Promise<FilterState> {
  const stored = await AsyncStorage.getItem(KEYS.FILTERS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as FilterState;
      log('LOAD', KEYS.FILTERS, 'filters loaded');
      return parsed;
    } catch {
      return DEFAULT_FILTERS;
    }
  }
  return DEFAULT_FILTERS;
}

// View mode persistence
export async function saveViewMode(mode: ViewMode): Promise<void> {
  log('SAVE', KEYS.VIEW_MODE, mode);
  await AsyncStorage.setItem(KEYS.VIEW_MODE, mode);
}

export async function loadViewMode(): Promise<ViewMode> {
  const mode = (await AsyncStorage.getItem(KEYS.VIEW_MODE) as ViewMode) || 'masonry';
  log('LOAD', KEYS.VIEW_MODE, mode);
  return mode;
}

// Cart persistence
export async function saveCart(cart: any[]): Promise<void> {
  log('SAVE', KEYS.CART, `${cart.length} items`);
  await AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart));
}

export async function loadCart(): Promise<any[]> {
  const stored = await AsyncStorage.getItem(KEYS.CART);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as any[];
      log('LOAD', KEYS.CART, `${parsed.length} items`);
      return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

// Session persistence
export async function saveSession(isLoggedIn: boolean): Promise<void> {
  log('SAVE', KEYS.SESSION, isLoggedIn);
  await AsyncStorage.setItem(KEYS.SESSION, isLoggedIn ? 'true' : 'false');
}

export async function loadSession(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(KEYS.SESSION);
  const isLoggedIn = stored === 'true';
  log('LOAD', KEYS.SESSION, isLoggedIn);
  return isLoggedIn;
}

// Favorites management
export async function getFavorites(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(KEYS.FAVORITES);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as string[];
      log('LOAD', KEYS.FAVORITES, `${parsed.length} items`);
      return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

export async function saveFavorites(favorites: string[]): Promise<void> {
  log('SAVE', KEYS.FAVORITES, `${favorites.length} items`);
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
}

export async function addFavorite(itemId: string): Promise<void> {
  const favorites = await getFavorites();
  if (!favorites.includes(itemId)) {
    favorites.push(itemId);
    await saveFavorites(favorites);
  }
}

export async function removeFavorite(itemId: string): Promise<void> {
  const favorites = (await getFavorites()).filter(id => id !== itemId);
  await saveFavorites(favorites);
}

export async function isFavorite(itemId: string): Promise<boolean> {
  return (await getFavorites()).includes(itemId);
}

// Cache management
export async function getLastSyncTime(): Promise<number | null> {
  const value = await AsyncStorage.getItem(KEYS.LAST_SYNC);
  return value ? parseInt(value, 10) : null;
}

export async function setLastSyncTime(): Promise<void> {
  await AsyncStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
}

export async function clearCache(): Promise<void> {
  await AsyncStorage.clear();
}
