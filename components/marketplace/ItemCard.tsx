import { categoryColors, theme } from '@/constants/theme';
import { CATEGORIES, MarketplaceItem } from '@/types/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface ItemCardProps {
    item: MarketplaceItem;
    index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Blurhash placeholder for images
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

function ItemCardComponent({ item, index }: ItemCardProps) {
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: interpolate(pressed.value, [0, 1], [1, 0.95]),
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        pressed.value = withSpring(1);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        pressed.value = withSpring(0);
    };

    const handlePress = () => {
        router.push({
            pathname: '/detail/[id]',
            params: { id: item.id },
        });
    };

    const categoryInfo = CATEGORIES.find(c => c.key === item.category);
    const categoryColor = categoryColors[item.category] || theme.colors.accent.primary;

    // Format relative time
    const getRelativeTime = () => {
        const now = new Date();
        const posted = new Date(item.postedAt);
        const diffHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));

        if (diffHours < 1) return 'Hace un momento';
        if (diffHours < 24) return `Hace ${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Ayer';
        return `Hace ${diffDays} días`;
    };

    return (
        <AnimatedPressable
            style={[styles.container, animatedStyle]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
        >
            {/* Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    placeholder={BLURHASH}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />

                {/* Featured Badge */}
                {item.featured && (
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>⭐ Destacado</Text>
                    </View>
                )}

                {/* Urgent Badge */}
                {item.urgent && (
                    <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>🔥 Urgente</Text>
                    </View>
                )}

                {/* Distance */}
                <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>📍 {item.distance} km</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Category Badge */}
                <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                    <Text style={styles.categoryEmoji}>{categoryInfo?.icon}</Text>
                    <Text style={[styles.categoryText, { color: categoryColor }]}>
                        {categoryInfo?.label}
                    </Text>
                </View>

                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>

                {/* Location */}
                <Text style={styles.location} numberOfLines={1}>
                    {item.location}
                </Text>

                {/* Footer: Price + Rating */}
                <View style={styles.footer}>
                    <Text style={styles.price}>${item.price.toFixed(0)}</Text>

                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingStar}>★</Text>
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                    </View>
                </View>

                {/* Posted Time */}
                <Text style={styles.postedTime}>{getRelativeTime()}</Text>
            </View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.xl,
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        ...theme.shadows.md,
    },
    imageContainer: {
        height: 160,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    featuredBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        left: theme.spacing.sm,
        backgroundColor: theme.colors.accent.primary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
    },
    featuredText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.semibold,
    },
    urgentBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: theme.colors.status.error,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
    },
    urgentText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.semibold,
    },
    distanceBadge: {
        position: 'absolute',
        bottom: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    distanceText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.medium,
    },
    content: {
        padding: theme.spacing.lg,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
        marginBottom: theme.spacing.sm,
    },
    categoryEmoji: {
        fontSize: 12,
        marginRight: 4,
    },
    categoryText: {
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.semibold,
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        marginBottom: theme.spacing.xs,
        lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.tight,
    },
    location: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.sm,
        marginBottom: theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    price: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingStar: {
        color: '#FFD700',
        fontSize: theme.typography.sizes.md,
        marginRight: 2,
    },
    ratingText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
    reviewCount: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.sm,
        marginLeft: 2,
    },
    postedTime: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.xs,
    },
});

// Memoize component to prevent unnecessary re-renders
export const ItemCard = memo(ItemCardComponent, (prev, next) => {
    return prev.item.id === next.item.id;
});
