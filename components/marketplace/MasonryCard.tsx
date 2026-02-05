import { categoryColors, theme } from '@/constants/theme';
import { useMarketplaceStore } from '@/store/store';
import { CATEGORIES, MarketplaceItem } from '@/types/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface MasonryCardProps {
    item: MarketplaceItem;
    index: number;
    columnIndex: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BLURHASH = 'L6PZfSjY~qof_3t7t7R*4nof%Mt7';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 16px padding on each side + 16px gap

// Variable heights for true masonry effect
const getImageHeight = (index: number): number => {
    const heights = [140, 180, 120, 200, 160, 220, 130, 190, 150, 170];
    return heights[index % heights.length];
};

function MasonryCardComponent({ item, index, columnIndex }: MasonryCardProps) {
    const scale = useSharedValue(1);
    const imageHeight = useMemo(() => getImageHeight(index), [index]);

    const quantity = useMarketplaceStore(state =>
        state.cart.find(i => i.item.id === item.id)?.quantity || 0
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const handlePress = () => {
        router.push({
            pathname: '/detail/[id]',
            params: { id: item.id },
        });
    };

    const categoryInfo = CATEGORIES.find(c => c.key === item.category);
    const categoryColor = categoryColors[item.category] || theme.colors.accent.primary;

    // Format price with commas
    const formattedPrice = item.price.toLocaleString('en-US');

    // Calculate discount (fake for demo)
    const hasDiscount = index % 4 === 0;
    const originalPrice = hasDiscount ? Math.round(item.price * 1.3) : null;

    return (
        <AnimatedPressable
            style={[styles.container, animatedStyle]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
        >
            {/* Image with variable height */}
            <View style={[styles.imageContainer, { height: imageHeight }]}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    placeholder={BLURHASH}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />

                {/* Quantity Badge */}
                {quantity > 0 && (
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityBadgeText}>{quantity}</Text>
                    </View>
                )}

                {/* Featured Badge */}
                {item.featured && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.badgeText}>⭐ TOP</Text>
                    </View>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-30%</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Category dot */}
                <View style={styles.categoryRow}>
                    <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                    <Text style={[styles.categoryText, { color: categoryColor }]} numberOfLines={1}>
                        {categoryInfo?.label}
                    </Text>
                </View>

                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>

                {/* Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>${formattedPrice}</Text>
                    {originalPrice && (
                        <Text style={styles.originalPrice}>${originalPrice.toLocaleString()}</Text>
                    )}
                </View>

                {/* Rating & Reviews */}
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                </View>

                {/* Shipping info */}
                <Text style={styles.shipping}>
                    {item.distance < 10 ? '🚚 Envío gratis' : `📍 ${item.distance}km`}
                </Text>
            </View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        ...theme.shadows.sm,
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
        backgroundColor: theme.colors.background.tertiary,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    quantityBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: theme.colors.accent.secondary,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 1.5,
        borderColor: theme.colors.text.primary,
    },
    quantityBadgeText: {
        color: theme.colors.text.primary,
        fontSize: 10,
        fontWeight: theme.typography.weights.bold,
    },
    featuredBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        left: theme.spacing.sm,
        backgroundColor: theme.colors.accent.primary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    badgeText: {
        color: theme.colors.text.primary,
        fontSize: 10,
        fontWeight: theme.typography.weights.bold,
    },
    discountBadge: {
        position: 'absolute',
        bottom: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: theme.colors.status.error,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    discountText: {
        color: theme.colors.text.primary,
        fontSize: 10,
        fontWeight: theme.typography.weights.bold,
    },
    content: {
        padding: theme.spacing.md,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    categoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: theme.spacing.xs,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: theme.typography.weights.medium,
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
        marginBottom: theme.spacing.xs,
        lineHeight: theme.typography.sizes.sm * 1.3,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    price: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
    },
    originalPrice: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.sm,
        textDecorationLine: 'line-through',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    ratingStar: {
        color: '#FFD700',
        fontSize: 12,
        marginRight: 2,
    },
    ratingText: {
        color: theme.colors.text.primary,
        fontSize: 11,
        fontWeight: theme.typography.weights.medium,
    },
    reviewCount: {
        color: theme.colors.text.tertiary,
        fontSize: 11,
        marginLeft: 2,
    },
    shipping: {
        color: theme.colors.status.success,
        fontSize: 10,
        fontWeight: theme.typography.weights.medium,
    },
});

export const MasonryCard = memo(MasonryCardComponent);

export { getImageHeight };

