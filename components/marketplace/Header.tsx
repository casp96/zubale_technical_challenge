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

export function Header({ scrollY, itemCount, onFilterPress }: HeaderProps) {
    const insets = useSafeAreaInsets();
    const filters = useFilters();
    const viewMode = useViewMode();
    const { setFilters, setViewMode } = useMarketplaceStore();

    // Animated header background
    const headerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, 100],
            [0, 1],
            Extrapolation.CLAMP
        );

        return {
            backgroundColor: `rgba(10, 10, 15, ${opacity * 0.95})`,
        };
    });

    // Animated title scale
    const titleStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.9],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            [0, 100],
            [0, -4],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }, { translateY }],
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
        <Animated.View style={[styles.container, { paddingTop: insets.top }, headerStyle]}>
            {/* Title Row */}
            <View style={styles.titleRow}>
                <Animated.View style={titleStyle}>
                    <Image
                        source={require('@/assets/images/logo/logo_zubale_2023.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </Animated.View>

                {/* Cart Button */}
                <CartButton />
            </View>

            {/* Search Row */}
            <View style={styles.searchRow}>
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
            </View>

            <Text style={[styles.subtitle, { marginLeft: 4, marginTop: 8 }]}>
                {itemCount.toLocaleString()} productos disponibles
            </Text>
        </Animated.View>
    );
}

// Separated component to avoid re-rendering entire header when cart changes
function CartButton() {
    const { cart, toggleCart } = useMarketplaceStore();
    const count = cart.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <Pressable
            style={styles.cartButton}
            onPress={toggleCart}
        >
            <FontAwesome
                name="shopping-cart"
                size={24}
                color={theme.colors.text.primary}
            />
            {count > 0 && (
                <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{count}</Text>
                </View>
            )}
        </Pressable>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
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
        marginTop: theme.spacing.xs,
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
    cartButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
});
