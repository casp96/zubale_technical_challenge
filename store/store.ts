import { generateMockData } from '@/data/mockData';
import {
    DEFAULT_FILTERS,
    FilterState,
    MarketplaceItem,
    SortOption,
    ViewMode
} from '@/types/types';
import { loadFilters, loadViewMode, saveFilters, saveViewMode } from '@/utils/storage';
import { create } from 'zustand';

interface MarketplaceStore {
    // Data
    items: MarketplaceItem[];
    isLoading: boolean;

    // Filters
    filters: FilterState;
    isFilterPanelOpen: boolean;

    // View
    viewMode: ViewMode;

    // Actions
    initializeStore: () => void;
    setFilters: (filters: Partial<FilterState>) => void;
    resetFilters: () => void;
    toggleFilterPanel: () => void;
    setFilterPanelOpen: (open: boolean) => void;
    setViewMode: (mode: ViewMode) => void;

    // Computed (using selectors)
    getFilteredItems: () => MarketplaceItem[];
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

function sortItems(items: MarketplaceItem[], sortBy: SortOption): MarketplaceItem[] {
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
            return sorted.sort((a, b) =>
                new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
            );
        default:
            return sorted;
    }
}

// Create the store
export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
    // Initial state
    items: [],
    isLoading: true,
    filters: DEFAULT_FILTERS,
    isFilterPanelOpen: false,
    viewMode: 'list',

    // Initialize store with data
    initializeStore: () => {
        console.log('[Store] Initializing...');
        // Use setTimeout to allow UI to render first
        setTimeout(() => {
            const startTime = performance.now();
            const items = generateMockData(10000);
            console.log(`[Store] Generated ${items.length} items in ${(performance.now() - startTime).toFixed(2)}ms`);
            const filters = loadFilters();
            const viewMode = loadViewMode();

            set({
                items,
                filters,
                viewMode,
                isLoading: false,
            });
            console.log('[Store] State updated with items');
        }, 100);
    },

    // Update filters
    setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };

        saveFilters(updatedFilters);
        set({ filters: updatedFilters });
    },

    // Reset filters to default
    resetFilters: () => {
        saveFilters(DEFAULT_FILTERS);
        set({ filters: DEFAULT_FILTERS });
    },

    // Toggle filter panel
    toggleFilterPanel: () => {
        set(state => ({ isFilterPanelOpen: !state.isFilterPanelOpen }));
    },

    setFilterPanelOpen: (open) => {
        set({ isFilterPanelOpen: open });
    },

    setViewMode: (mode) => {
        saveViewMode(mode);
        set({ viewMode: mode });
    },

    // Get filtered items (computed)
    getFilteredItems: () => {
        const { items, filters } = get();
        return filterItems(items, filters);
    },
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
