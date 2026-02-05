import { generateMockData } from '@/data/mockData';
import {
    CartItem,
    DEFAULT_FILTERS,
    FilterState,
    MarketplaceItem,
    ViewMode
} from '@/types/types';
import {
    getFavorites,
    loadCart,
    loadFilters,
    loadSession,
    loadViewMode,
    saveCart,
    saveFavorites,
    saveFilters,
    saveSession,
    saveViewMode
} from '@/utils/storage';
import { create } from 'zustand';

interface MarketplaceStore {
    // Data
    items: MarketplaceItem[];
    cart: CartItem[]; // Grouped cart items
    isLoading: boolean;

    // Filters
    filters: FilterState;
    isFilterPanelOpen: boolean;
    isCartOpen: boolean; // Slider visibility

    // View
    viewMode: ViewMode;
    favorites: string[]; // Favorite product IDs
    isLoggedIn: boolean; // User session state

    // Actions
    initializeStore: () => Promise<void>;
    setFilters: (filters: Partial<FilterState>) => Promise<void>;
    resetFilters: () => Promise<void>;
    toggleFilterPanel: () => void;
    setFilterPanelOpen: (open: boolean) => void;

    // Cart Actions
    toggleCart: () => void;
    addToCart: (item: MarketplaceItem) => Promise<void>;
    updateQuantity: (itemId: string, delta: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;

    // Favorite Actions
    toggleFavorite: (productId: string) => Promise<void>;

    // Session Actions
    setIsLoggedIn: (isLoggedIn: boolean) => Promise<void>;

    setViewMode: (mode: ViewMode) => Promise<void>;

    // Computed (using selectors)
    getFilteredItems: () => MarketplaceItem[];
    getCartTotal: () => number;
}

// Filtering function - optimized for performance
function filterItems(items: MarketplaceItem[], filters: FilterState): MarketplaceItem[] {
    const startTime = performance.now();

    let result = items;

    // Price filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
        result = result.filter(
            item => item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
        );
    }

    // Distance filter
    if (filters.distanceRange[0] > 0 || filters.distanceRange[1] < 50) {
        result = result.filter(
            item => item.distance >= filters.distanceRange[0] && item.distance <= filters.distanceRange[1]
        );
    }

    // Category filter
    if (filters.categories.length > 0) {
        result = result.filter(item => filters.categories.includes(item.category));
    }

    // Search filter
    if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        result = result.filter(
            item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query)
        );
    }

    // Sort
    result = sortItems(result, filters.sortBy);

    const endTime = performance.now();
    console.log(`[Store] Filtered ${items.length} -> ${result.length} items in ${(endTime - startTime).toFixed(2)}ms`);

    return result;
}

function sortItems(items: MarketplaceItem[], sortBy: import('@/types/types').SortOption): MarketplaceItem[] {
    const sorted = [...items];

    switch (sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'distance':
            return sorted.sort((a, b) => a.distance - b.distance);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'recent':
            const timeA = (d: string) => new Date(d).getTime();
            return sorted.sort((a, b) => timeA(b.postedAt) - timeA(a.postedAt));
        default:
            return sorted;
    }
}

// Create the store
export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
    // Initial state
    items: [],
    cart: [],
    isLoading: true,
    filters: DEFAULT_FILTERS,
    isFilterPanelOpen: false,
    isCartOpen: false,
    viewMode: 'masonry',
    favorites: [],
    isLoggedIn: false,

    // Initialize store with data
    initializeStore: async () => {
        console.log('[Store] Initializing...');

        // Load items first
        const startTime = performance.now();
        const items = generateMockData(10000);
        console.log(`[Store] Generated ${items.length} items in ${(performance.now() - startTime).toFixed(2)}ms`);

        // Load persistent data in parallel
        const [filters, viewMode, favorites, cart, isLoggedIn] = await Promise.all([
            loadFilters(),
            loadViewMode(),
            getFavorites(),
            loadCart() as Promise<CartItem[]>,
            loadSession()
        ]);

        set({
            items,
            filters,
            viewMode,
            favorites,
            cart,
            isLoggedIn,
            isLoading: false,
        });
        console.log('[Store] Full state restored from persistence');
    },

    // Update filters
    setFilters: async (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };

        await saveFilters(updatedFilters);
        set({ filters: updatedFilters });
    },

    // Reset filters to default
    resetFilters: async () => {
        await saveFilters(DEFAULT_FILTERS);
        set({ filters: DEFAULT_FILTERS });
    },

    // Toggle filter panel
    toggleFilterPanel: () => {
        set(state => ({ isFilterPanelOpen: !state.isFilterPanelOpen }));
    },

    setFilterPanelOpen: (open) => {
        set({ isFilterPanelOpen: open });
    },

    // Cart Actions
    toggleCart: () => {
        set(state => ({ isCartOpen: !state.isCartOpen }));
    },

    addToCart: async (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find(i => i.item.id === item.id);

        let newCart;
        if (existingItem) {
            newCart = currentCart.map(i =>
                i.item.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            );
        } else {
            newCart = [...currentCart, { item, quantity: 1 }];
        }

        await saveCart(newCart);
        set({
            cart: newCart,
            isCartOpen: true // Auto open cart when adding
        });
    },

    updateQuantity: async (itemId, delta) => {
        const currentCart = get().cart;
        const newCart = currentCart.map(i => {
            if (i.item.id === itemId) {
                const newQty = Math.max(0, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(i => i.quantity > 0);

        await saveCart(newCart);
        set({ cart: newCart });
    },

    removeFromCart: async (itemId) => {
        const newCart = get().cart.filter(i => i.item.id !== itemId);
        await saveCart(newCart);
        set({ cart: newCart });
    },

    clearCart: async () => {
        await saveCart([]);
        set({ cart: [] });
    },

    toggleFavorite: async (productId) => {
        const currentFavorites = get().favorites;
        const isFav = currentFavorites.includes(productId);
        let newFavorites;

        if (isFav) {
            newFavorites = currentFavorites.filter(id => id !== productId);
        } else {
            newFavorites = [...currentFavorites, productId];
        }

        await saveFavorites(newFavorites);
        set({ favorites: newFavorites });
    },

    setIsLoggedIn: async (isLoggedIn) => {
        await saveSession(isLoggedIn);
        set({ isLoggedIn });
    },

    setViewMode: async (mode) => {
        await saveViewMode(mode);
        set({ viewMode: mode });
    },

    // Get filtered items (computed)
    getFilteredItems: () => {
        const { items, filters } = get();
        return filterItems(items, filters);
    },

    getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
    }
}));


// Selector hooks for optimized re-renders
export const useFilteredItems = () => {
    const items = useMarketplaceStore(state => state.items);
    const filters = useMarketplaceStore(state => state.filters);

    // Memoize filtering at component level using useMemo
    return filterItems(items, filters);
};

export const useFilters = () => useMarketplaceStore(state => state.filters);
export const useIsLoading = () => useMarketplaceStore(state => state.isLoading);
export const useIsFilterPanelOpen = () => useMarketplaceStore(state => state.isFilterPanelOpen);
export const useViewMode = () => useMarketplaceStore(state => state.viewMode);
