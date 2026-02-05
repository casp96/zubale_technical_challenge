import { theme } from '@/constants/theme';
import { useFilters, useMarketplaceStore, useViewMode } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
    scrollY: SharedValue<number>;
    itemCount: number;
    onFilterPress: () => void;
}

export const HEADER_MAX_HEIGHT = 160;
export const HEADER_MIN_HEIGHT = 72;

export function Header({ scrollY, itemCount, onFilterPress }: HeaderProps) {
    const insets = useSafeAreaInsets();
    const filters = useFilters();
    const viewMode = useViewMode();
    const { setFilters, setViewMode } = useMarketplaceStore();

    // Animated header background & bottom border
    const headerStyle = useAnimatedStyle(() => {
        const bgOpacity = interpolate(
            scrollY.value,
            [0, 80],
            [0, 0.98],
            Extrapolation.CLAMP
        );

        const borderOpacity = interpolate(
            scrollY.value,
            [80, 120],
            [0, 0.15],
            Extrapolation.CLAMP
        );

        const height = interpolate(
            scrollY.value,
            [0, 100],
            [HEADER_MAX_HEIGHT + insets.top, HEADER_MIN_HEIGHT + insets.top],
            Extrapolation.CLAMP
        );

        return {
            backgroundColor: `rgba(10, 10, 15, ${bgOpacity})`,
            borderBottomColor: `rgba(255, 255, 255, ${borderOpacity})`,
            height,
            zIndex: 1000,
        };
    });

    // Animate the entire Logo/Title Row collapse
    const titleRowStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, 50],
            [1, 0],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            [0, 100],
            [0, -40],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.8],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [
                { translateY },
                { scale }
            ],
            position: 'absolute',
            top: insets.top + theme.spacing.md,
            left: theme.spacing.lg,
            right: theme.spacing.lg,
        };
    });

    // Search Row (Always Sticky, slides up to clear logo)
    const searchRowStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, 100],
            [80, 8], // Land 8px below insets.top
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }],
            position: 'absolute',
            top: insets.top,
            left: theme.spacing.lg,
            right: theme.spacing.lg,
        };
    });

    // Subtitle fade out on scroll
    const subtitleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, 50],
            [1, 0],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            [0, 80],
            [130, 100],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
            position: 'absolute',
            top: insets.top,
            left: theme.spacing.lg + 4,
        };
    });

    // Search handler
    const handleSearch = useCallback((text: string) => {
        setFilters({ searchQuery: text });
    }, [setFilters]);

    // Toggle view mode
    const toggleViewMode = useCallback(() => {
        setViewMode(viewMode === 'list' ? 'masonry' : 'list');
    }, [viewMode, setViewMode]);

    // Count active filters
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
        if (filters.distanceRange[0] > 0 || filters.distanceRange[1] < 50) count++;
        if (filters.categories.length > 0) count++;
        return count;
    }, [filters]);

    return (
        <Animated.View style={[styles.container, headerStyle]}>
            {/* Title Row (Collapsible) */}
            <Animated.View style={[styles.titleRow, titleRowStyle]}>
                <Image
                    source={require('@/assets/images/logo/logo_zubale_2023.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
            </Animated.View>

            {/* Subtitle (Fades out) */}
            <Animated.Text style={[styles.subtitle, { marginLeft: 4 }, subtitleStyle]}>
                {itemCount.toLocaleString()} productos disponibles
            </Animated.Text>

            {/* Search + Controls Row (Slides up) */}
            <Animated.View style={[styles.searchRow, searchRowStyle]}>
                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <FontAwesome
                        name="search"
                        size={16}
                        color={theme.colors.text.tertiary}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar productos..."
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={filters.searchQuery}
                        onChangeText={handleSearch}
                        returnKeyType="search"
                    />
                    {filters.searchQuery.length > 0 && (
                        <Pressable onPress={() => handleSearch('')}>
                            <FontAwesome
                                name="times-circle"
                                size={16}
                                color={theme.colors.text.tertiary}
                            />
                        </Pressable>
                    )}
                </View>

                {/* Filter Button */}
                <Pressable
                    style={styles.filterButton}
                    onPress={onFilterPress}
                >
                    <FontAwesome
                        name="sliders"
                        size={18}
                        color={theme.colors.text.primary}
                    />
                    {activeFiltersCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                        </View>
                    )}
                </Pressable>

                {/* View Mode Toggle */}
                <Pressable
                    style={styles.filterButton}
                    onPress={toggleViewMode}
                >
                    <FontAwesome
                        name={viewMode === 'list' ? 'th-large' : 'list'}
                        size={18}
                        color={theme.colors.text.primary}
                    />
                </Pressable>

                {/* Cart Button (Always visible) */}
                <CartButton scrollY={scrollY} />
            </Animated.View>
        </Animated.View>
    );
}

// Separated component to avoid re-rendering entire header when cart changes
function CartButton({ scrollY }: { scrollY: SharedValue<number> }) {
    const { cart, toggleCart } = useMarketplaceStore();
    const count = cart.reduce((acc, i) => acc + i.quantity, 0);

    const cartAnimationStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, 100],
            [-68, 0],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }],
        };
    });

    return (
        <Animated.View style={cartAnimationStyle}>
            <Pressable
                style={styles.cartButtonGrid}
                onPress={toggleCart}
            >
                <FontAwesome
                    name="shopping-cart"
                    size={22}
                    color={theme.colors.text.primary}
                />
                {count > 0 && (
                    <View style={styles.cartBadgeSmall}>
                        <Text style={styles.filterBadgeText}>{count}</Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 36,
        marginLeft: -4,
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes['3xl'],
        fontWeight: theme.typography.weights.bold,
    },
    subtitle: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.sm,
    },
    viewModeButton: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    searchRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    searchIcon: {
        marginRight: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        height: 44,
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.md,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.accent.secondary,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadgeText: {
        color: theme.colors.text.inverse,
        fontSize: 10,
        fontWeight: theme.typography.weights.bold,
    },
    cartButtonGrid: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    cartBadgeSmall: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.accent.secondary,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
});