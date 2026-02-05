import { FilterPanel } from '@/components/marketplace/FilterPanel';
import { Header, HEADER_MAX_HEIGHT } from '@/components/marketplace/Header';
import { ItemCard } from '@/components/marketplace/ItemCard';
import { MasonryList } from '@/components/marketplace/MasonryList';
import { LoadingScreen } from '@/components/ui/Skeleton';
import { theme } from '@/constants/theme';
import {
  useFilteredItems,
  useIsFilterPanelOpen,
  useIsLoading,
  useMarketplaceStore,
  useViewMode,
} from '@/store/store';
import { MarketplaceItem } from '@/types/types';
import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Use FlatList for simplicity and type safety (Single Column)
const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<MarketplaceItem>
);

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();

  // Use reactive hooks from store
  const isLoading = useIsLoading();
  const filteredItems = useFilteredItems();
  const isFilterPanelOpen = useIsFilterPanelOpen();
  const viewMode = useViewMode();

  const {
    initializeStore,
    setFilterPanelOpen,
  } = useMarketplaceStore();

  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = React.useState(false);

  // Added constant for total top offset to accommodate absolute header
  const LIST_PADDING_TOP = HEADER_MAX_HEIGHT + insets.top;

  // Initialize store on mount
  useEffect(() => {
    const init = async () => {
      await initializeStore();
    };
    init();
  }, [initializeStore]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      initializeStore();
      setRefreshing(false);
    }, 1000);
  }, [initializeStore]);

  // Open filter panel
  const openFilterPanel = useCallback(() => {
    setFilterPanelOpen(true);
  }, [setFilterPanelOpen]);

  // Close filter panel
  const closeFilterPanel = useCallback(() => {
    setFilterPanelOpen(false);
  }, [setFilterPanelOpen]);

  // Scroll handler for standard list
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Render item for standard list
  const renderItem = useCallback(({ item, index }: { item: MarketplaceItem; index: number }) => {
    return <ItemCard item={item} index={index} />;
  }, []);

  // Key extractor
  const keyExtractor = useCallback((item: MarketplaceItem) => item.id, []);

  // Get item layout for performance optimization (Fixed height for list)
  const getItemLayout = useCallback((_data: any, index: number) => ({
    length: 320, // Approx height of ItemCard + margin
    offset: 320 * index,
    index,
  }), []);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header is absolute, rendered here for zIndex visibility */}
      <Header
        scrollY={scrollY}
        itemCount={filteredItems.length}
        onFilterPress={openFilterPanel}
      />

      {/* Conditional Rendering based on ViewMode */}
      {viewMode === 'list' ? (
        <AnimatedFlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: LIST_PADDING_TOP + theme.spacing.md,
              paddingBottom: insets.bottom + theme.spacing.xl
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.accent.primary}
              colors={[theme.colors.accent.primary]}
            />
          }
          // Performance optimizations for single column
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}
          getItemLayout={getItemLayout}
        />
      ) : (
        <MasonryList
          items={filteredItems}
          refreshing={refreshing}
          onRefresh={onRefresh}
          scrollY={scrollY}
          paddingTop={LIST_PADDING_TOP}
        />
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={closeFilterPanel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  listContent: {
    // Top padding handled dynamically via contentContainerStyle
  },
});
