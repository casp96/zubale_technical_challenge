import { theme } from '@/constants/theme';
import { MarketplaceItem } from '@/types/types';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    SharedValue,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getImageHeight, MasonryCard } from './MasonryCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const HORIZONTAL_PADDING = 16;
// Calculate card height including content (for layout purposes)
const getCardTotalHeight = (index: number): number => {
    const imageHeight = getImageHeight(index);
    const contentHeight = 130; // Approximate content height
    return imageHeight + contentHeight + theme.spacing.md; // + margin bottom
};

interface MasonryListProps {
    items: MarketplaceItem[];
    refreshing: boolean;
    onRefresh: () => void;
    scrollY: SharedValue<number>;
}

export function MasonryList({ items, refreshing, onRefresh, scrollY }: MasonryListProps) {
    const insets = useSafeAreaInsets();

    // Internal pagination state to prevent rendering 10k items at once
    const [renderLimit, setRenderLimit] = useState(20);

    // Reset limit when refreshing or items change largely
    useEffect(() => {
        if (refreshing) {
            setRenderLimit(20);
        }
    }, [refreshing]);

    // Split items into two columns using greedy algorithm
    // Only process UP TO renderLimit
    const { leftColumn, rightColumn } = useMemo(() => {
        const left: { item: MarketplaceItem; index: number }[] = [];
        const right: { item: MarketplaceItem; index: number }[] = [];
        let leftHeight = 0;
        let rightHeight = 0;

        // Slice items for performance
        const visibleItems = items.slice(0, renderLimit);

        visibleItems.forEach((item, index) => {
            const cardHeight = getCardTotalHeight(index);

            if (leftHeight <= rightHeight) {
                left.push({ item, index });
                leftHeight += cardHeight;
            } else {
                right.push({ item, index });
                rightHeight += cardHeight;
            }
        });

        return { leftColumn: left, rightColumn: right };
    }, [items, renderLimit]);

    const loadMore = () => {
        if (renderLimit < items.length) {
            setRenderLimit(prev => Math.min(prev + 20, items.length));
        }
    };

    // Scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;

            // Simple infinite scroll detection
            const contentHeight = event.contentSize.height;
            const layoutHeight = event.layoutMeasurement.height;
            const contentOffsetY = event.contentOffset.y;

            // Load more when close to bottom (within 2 screens)
            if (contentHeight - layoutHeight - contentOffsetY < layoutHeight * 2) {
                runOnJS(loadMore)();
            }
        },
    });

    return (
        <Animated.ScrollView
            style={{ flex: 1 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                { paddingBottom: insets.bottom + theme.spacing['3xl'] },
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
            <View style={styles.columnsContainer}>
                {/* Left Column */}
                <View style={styles.column}>
                    {leftColumn.map(({ item, index }) => (
                        <MasonryCard
                            key={item.id}
                            item={item}
                            index={index}
                            columnIndex={0}
                        />
                    ))}
                </View>

                {/* Right Column */}
                <View style={styles.column}>
                    {rightColumn.map(({ item, index }) => (
                        <MasonryCard
                            key={item.id}
                            item={item}
                            index={index}
                            columnIndex={1}
                        />
                    ))}
                </View>
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: theme.spacing.md,
        paddingHorizontal: HORIZONTAL_PADDING,
    },
    columnsContainer: {
        flexDirection: 'row',
        gap: COLUMN_GAP,
    },
    column: {
        flex: 1,
    },
});
