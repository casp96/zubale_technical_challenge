import { theme } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const HORIZONTAL_PADDING = 16;
// Same calculation as in MasonryList
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: any;
}

export function Skeleton({
    width = '100%',
    height = 20,
    borderRadius = theme.borderRadius.md,
    style,
}: SkeletonProps) {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, borderRadius },
                animatedStyle,
                style,
            ]}
        />
    );
}

// Skeleton for MasonryCard
export function MasonryCardSkeleton({ height = 200 }: { height?: number }) {
    return (
        <View style={[styles.masonryCard, { width: CARD_WIDTH }]}>
            <Skeleton height={height} borderRadius={0} />
            <View style={styles.masonryContent}>
                <View style={styles.categoryRow}>
                    <Skeleton width={12} height={12} borderRadius={6} />
                    <View style={{ width: 8 }} />
                    <Skeleton width={60} height={12} />
                </View>
                <View style={{ height: theme.spacing.sm }} />
                <Skeleton width="90%" height={16} />
                <View style={{ height: theme.spacing.xs }} />
                <Skeleton width="60%" height={16} />
                <View style={{ height: theme.spacing.sm }} />
                <View style={styles.cardFooter}>
                    <Skeleton width={70} height={18} />
                    <Skeleton width={40} height={12} />
                </View>
            </View>
        </View>
    );
}

// Loading screen with two columns of skeletons (Masonry style)
export function LoadingScreen() {
    // Generate varied heights for left and right columns to mimic masonry
    const leftHeights = [180, 240, 160];
    const rightHeights = [220, 190, 210];

    return (
        <View style={styles.loadingContainer}>
            <View style={styles.columnsContainer}>
                {/* Left Column */}
                <View style={styles.column}>
                    {leftHeights.map((h, i) => (
                        <MasonryCardSkeleton key={`l-${i}`} height={h} />
                    ))}
                </View>

                {/* Right Column */}
                <View style={styles.column}>
                    {rightHeights.map((h, i) => (
                        <MasonryCardSkeleton key={`r-${i}`} height={h} />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: theme.colors.background.tertiary,
    },
    masonryCard: {
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    masonryContent: {
        padding: theme.spacing.md,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        paddingTop: theme.spacing.md,
        paddingHorizontal: HORIZONTAL_PADDING,
    },
    columnsContainer: {
        flexDirection: 'row',
        gap: COLUMN_GAP,
    },
    column: {
        flex: 1,
    }
});
