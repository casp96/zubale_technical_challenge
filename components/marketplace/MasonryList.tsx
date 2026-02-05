import { theme } from '@/constants/theme';
import { MarketplaceItem } from '@/types/types';
import React, { useMemo, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    SharedValue,
    useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getImageHeight, MasonryCard } from './MasonryCard';

interface MasonryListProps {
    items: MarketplaceItem[];
    refreshing: boolean;
    onRefresh: () => void;
    scrollY: SharedValue<number>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const COLUMN_GAP = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - COLUMN_GAP) / 2;
const ROW_GAP = 8; // Reduced gap for tighter layout

// Helper to calculate total height of a card
const getCardHeight = (index: number) => {
    const imageHeight = getImageHeight(index);
    // Tuned content height: decreased from 160 to 150 to reduce whitespace 
    // while keeping it safe enough to prevent overlap.
    const contentHeight = 150;
    return imageHeight + contentHeight;
};

export function MasonryList({ items, refreshing, onRefresh, scrollY }: MasonryListProps) {
    const insets = useSafeAreaInsets();

    // 1. Pre-calculate layout for ALL items (Layout Phase)
    // This runs once when items change, which is fast enough for 10k items in JS
    const { layoutItems, totalHeight } = useMemo(() => {
        const layouts = [];
        const colHeights = [0, 0]; // Height of left and right columns

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const cardHeight = getCardHeight(i);

            // Greedy: Place in shorter column
            const colIndex = colHeights[0] <= colHeights[1] ? 0 : 1;
            // const top = colHeights[colIndex] + (i > 1 ? ROW_GAP : 0); // Add gap if not first item
            // Actually simpler: just track bottom.
            // Correct approach: layout top is current column height.
            // New column height is top + cardHeight + ROW_GAP.

            const currentTop = colHeights[colIndex];
            const left = colIndex === 0 ? 0 : COLUMN_WIDTH + COLUMN_GAP;

            layouts.push({
                item,
                index: i,
                top: currentTop,
                left,
                height: cardHeight,
                columnIndex: colIndex,
                bottom: currentTop + cardHeight
            });

            // Update column height including the gap for the *next* item
            colHeights[colIndex] += cardHeight + ROW_GAP;
        }

        return {
            layoutItems: layouts,
            totalHeight: Math.max(colHeights[0], colHeights[1])
        };
    }, [items]);

    // 2. Visible Range State (Windowing Phase)
    // We only render items overlapping with the "window"
    const [renderRange, setRenderRange] = useState({ start: 0, end: 1000 }); // Initial buffer

    const updateWindow = (currentScrollY: number) => {
        const buffer = 1000; // Render buffer (pixels)
        const visibleStart = currentScrollY - buffer;
        const visibleEnd = currentScrollY + Dimensions.get('window').height + buffer;

        // Optimize: Use simple linear approximation or binary search if needed.
        // Since we need to check intersection, and items aren't perfectly sorted by Top (scrambled columns),
        // filtering is safer. For 10k items, filter might be slightly heavy per frame (16ms).
        // Optimization: We know index i roughly corresponds to Y position.

        // Let's use `renderRange` as indices to subset `layoutItems`?
        // No, layoutItems are sorted by index, not position.
        // Let's create a "Sorted by Top" index for fast lookup?
        // Actually, just throttling the update is usually enough.

        setRenderRange({ start: visibleStart, end: visibleEnd });
    };

    // Throttled scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            runOnJS(updateWindow)(event.contentOffset.y);
        },
    });

    // 3. Render visible items
    // Filter items that overlap with current window
    const visibleItems = useMemo(() => {
        // Optimization: Filter logic 
        // Iterate and pick. 
        // For extremely large lists, we'd use a spatial index, but for 10k, reduced frequency is ok.
        const res = [];
        // Optimization: We can limit scan range based on average height
        // Approx index = scrollY / averageHeight * 2 (columns)
        const avgHeight = 250;
        const estimatedIndex = Math.floor(renderRange.start / avgHeight) * 2;
        const startIndex = Math.max(0, estimatedIndex - 50);

        for (let i = startIndex; i < layoutItems.length; i++) {
            const layout = layoutItems[i];

            // Stop early if we are way past the visible area?
            // Only if sorted by Top. They are roughly sorted.
            if (layout.top > renderRange.end + 2000) break; // Heuristic break

            if (layout.bottom >= renderRange.start && layout.top <= renderRange.end) {
                res.push(layout);
            }
        }
        return res;
    }, [layoutItems, renderRange]);

    return (
        <Animated.ScrollView
            style={{ flex: 1 }}
            onScroll={scrollHandler}
            scrollEventThrottle={32} // Reduce frequency to approx 30fps for JS updates
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                { height: totalHeight + insets.bottom + theme.spacing['3xl'] },
            ]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.colors.accent.primary}
                    colors={[theme.colors.accent.primary]}
                />
            }
        >
            <View style={styles.content}>
                {visibleItems.map((layout) => (
                    <View
                        key={layout.item.id}
                        style={{
                            position: 'absolute',
                            top: layout.top,
                            left: layout.left,
                            width: COLUMN_WIDTH,
                            height: layout.height,
                        }}
                    >
                        <MasonryCard
                            item={layout.item}
                            index={layout.index}
                            columnIndex={layout.columnIndex}
                        />
                    </View>
                ))}
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // Height set dynamically
    },
    content: {
        position: 'relative',
        marginHorizontal: HORIZONTAL_PADDING,
        marginTop: theme.spacing.md,
    },
});
