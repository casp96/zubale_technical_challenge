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
    paddingTop?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const COLUMN_GAP = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - COLUMN_GAP) / 2;
const ROW_GAP = 8;

// Helper to calculate total height of a card
const getCardHeight = (index: number) => {
    const imageHeight = getImageHeight(index);
    const contentHeight = 150;
    return imageHeight + contentHeight;
};

export function MasonryList({ items, refreshing, onRefresh, scrollY, paddingTop = 0 }: MasonryListProps) {
    const insets = useSafeAreaInsets();

    // 1. Pre-calculate layout for ALL items (Layout Phase)
    const { layoutItems, totalHeight } = useMemo(() => {
        const layouts = [];
        const colHeights = [0, 0];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const cardHeight = getCardHeight(i);
            const colIndex = colHeights[0] <= colHeights[1] ? 0 : 1;
            const currentTop = colHeights[colIndex];
            const left = colIndex === 0 ? 0 : COLUMN_WIDTH + COLUMN_GAP;

            layouts.push({
                item,
                index: i,
                top: currentTop + paddingTop + theme.spacing.md,
                left,
                height: cardHeight,
                columnIndex: colIndex,
                bottom: currentTop + paddingTop + theme.spacing.md + cardHeight
            });

            colHeights[colIndex] += cardHeight + ROW_GAP;
        }

        return {
            layoutItems: layouts,
            totalHeight: Math.max(colHeights[0], colHeights[1])
        };
    }, [items, paddingTop]);

    // 2. Visible Range State (Windowing Phase)
    const [renderRange, setRenderRange] = useState({ start: 0, end: 1200 });

    const updateWindow = (currentScrollY: number) => {
        const buffer = 1200;
        const visibleStart = currentScrollY - buffer;
        const visibleEnd = currentScrollY + Dimensions.get('window').height + buffer;
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
    const visibleItems = useMemo(() => {
        const res = [];
        const avgHeight = 250;
        const estimatedIndex = Math.floor(renderRange.start / avgHeight) * 2;
        const startIndex = Math.max(0, estimatedIndex - 50);

        for (let i = startIndex; i < layoutItems.length; i++) {
            const layout = layoutItems[i];
            if (layout.top > renderRange.end + 2000) break;
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
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                { height: totalHeight + paddingTop + insets.bottom + theme.spacing['3xl'] },
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
    },
});
