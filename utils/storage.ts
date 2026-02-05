import { DEFAULT_FILTERS, FilterState, ViewMode } from '@/types/types';

// Simple in-memory storage for demo (MMKV can be used in production)
class SimpleStorage {
  private data: Map<string, string | number> = new Map();

  set(key: string, value: string | number): void {
    this.data.set(key, value);
  }

  getString(key: string): string | undefined {
    const value = this.data.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  getNumber(key: string): number | undefined {
    const value = this.data.get(key);
    return typeof value === 'number' ? value : undefined;
  }

  delete(key: string): void {
    this.data.delete(key);
  }

  clearAll(): void {
    this.data.clear();
  }
}

// Use simple storage for demo - replace with MMKV for production
export const storage = new SimpleStorage();

// Storage keys
const KEYS = {
  FILTERS: 'marketplace.filters',
  VIEW_MODE: 'marketplace.viewMode',
  LAST_SYNC: 'marketplace.lastSync',
  FAVORITES: 'marketplace.favorites',
} as const;

// Filter persistence
export function saveFilters(filters: FilterState): void {
  storage.set(KEYS.FILTERS, JSON.stringify(filters));
}

export function loadFilters(): FilterState {
  const stored = storage.getString(KEYS.FILTERS);
  if (stored) {
    try {
      return JSON.parse(stored) as FilterState;
    } catch {
      return DEFAULT_FILTERS;
    }
  }
  return DEFAULT_FILTERS;
}

// View mode persistence
export function saveViewMode(mode: ViewMode): void {
  storage.set(KEYS.VIEW_MODE, mode);
}

export function loadViewMode(): ViewMode {
  return (storage.getString(KEYS.VIEW_MODE) as ViewMode) || 'list';
}

// Favorites management
export function getFavorites(): string[] {
  const stored = storage.getString(KEYS.FAVORITES);
  if (stored) {
    try {
      return JSON.parse(stored) as string[];
    } catch {
      return [];
    }
  }
  return [];
}

export function addFavorite(itemId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(itemId)) {
    favorites.push(itemId);
    storage.set(KEYS.FAVORITES, JSON.stringify(favorites));
  }
}

export function removeFavorite(itemId: string): void {
  const favorites = getFavorites().filter(id => id !== itemId);
  storage.set(KEYS.FAVORITES, JSON.stringify(favorites));
}

export function isFavorite(itemId: string): boolean {
  return getFavorites().includes(itemId);
}

// Cache management
export function getLastSyncTime(): number | null {
  const value = storage.getNumber(KEYS.LAST_SYNC);
  return value || null;
}

export function setLastSyncTime(): void {
  storage.set(KEYS.LAST_SYNC, Date.now());
}

export function clearCache(): void {
  storage.clearAll();
}
