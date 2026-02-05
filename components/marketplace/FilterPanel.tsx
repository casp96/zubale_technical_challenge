import { categoryColors, theme } from '@/constants/theme';
import { useFilters, useMarketplaceStore } from '@/store/store';
import { CATEGORIES, Category, SortOption } from '@/types/types';
import React, { useCallback, useMemo } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.75;

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
    { key: 'distance', label: '📍 Distancia' },
    { key: 'price_asc', label: '💰 Menor precio' },
    { key: 'price_desc', label: '💎 Mayor precio' },
    { key: 'rating', label: '⭐ Mejor calificado' },
    { key: 'recent', label: '🕐 Más reciente' },
];

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
    const filters = useFilters();
    const { setFilters, resetFilters } = useMarketplaceStore();

    const translateY = useSharedValue(PANEL_HEIGHT);

    React.useEffect(() => {
        translateY.value = withSpring(isOpen ? 0 : PANEL_HEIGHT, {
            damping: 20,
            stiffness: 200,
        });
    }, [isOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [PANEL_HEIGHT, 0],
            [0, 1],
            Extrapolation.CLAMP
        ),
        pointerEvents: isOpen ? 'auto' : 'none',
    }));

    // Pan gesture for closing
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 100 || event.velocityY > 500) {
                translateY.value = withSpring(PANEL_HEIGHT);
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0);
            }
        });

    // Category toggle
    const toggleCategory = useCallback((category: Category) => {
        const current = filters.categories;
        const updated = current.includes(category)
            ? current.filter(c => c !== category)
            : [...current, category];
        setFilters({ categories: updated });
    }, [filters.categories, setFilters]);

    // Price range handlers
    const setPriceMin = useCallback((value: number) => {
        setFilters({ priceRange: [value, filters.priceRange[1]] });
    }, [filters.priceRange, setFilters]);

    const setPriceMax = useCallback((value: number) => {
        setFilters({ priceRange: [filters.priceRange[0], value] });
    }, [filters.priceRange, setFilters]);

    // Distance range handlers
    const setDistanceMin = useCallback((value: number) => {
        setFilters({ distanceRange: [value, filters.distanceRange[1]] });
    }, [filters.distanceRange, setFilters]);

    const setDistanceMax = useCallback((value: number) => {
        setFilters({ distanceRange: [filters.distanceRange[0], value] });
    }, [filters.distanceRange, setFilters]);

    // Sort handler
    const setSortBy = useCallback((sortBy: SortOption) => {
        setFilters({ sortBy });
    }, [setFilters]);

    // Reset handler
    const handleReset = useCallback(() => {
        resetFilters();
    }, [resetFilters]);

    // Active filters count
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
        if (filters.distanceRange[0] > 0 || filters.distanceRange[1] < 50) count++;
        if (filters.categories.length > 0) count++;
        if (filters.sortBy !== 'distance') count++;
        return count;
    }, [filters]);

    return (
        <>
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Panel */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.panel, animatedStyle]}>
                    {/* Handle */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtros</Text>
                        {activeFiltersCount > 0 && (
                            <Pressable onPress={handleReset} style={styles.resetButton}>
                                <Text style={styles.resetText}>Limpiar ({activeFiltersCount})</Text>
                            </Pressable>
                        )}
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Sort By */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ordenar por</Text>
                            <View style={styles.sortOptions}>
                                {SORT_OPTIONS.map(option => (
                                    <Pressable
                                        key={option.key}
                                        style={[
                                            styles.sortChip,
                                            filters.sortBy === option.key && styles.sortChipActive,
                                        ]}
                                        onPress={() => setSortBy(option.key)}
                                    >
                                        <Text style={[
                                            styles.sortChipText,
                                            filters.sortBy === option.key && styles.sortChipTextActive,
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Categories */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Categorías</Text>
                            <View style={styles.categoriesGrid}>
                                {CATEGORIES.map(category => {
                                    const isSelected = filters.categories.includes(category.key);
                                    const color = categoryColors[category.key];

                                    return (
                                        <Pressable
                                            key={category.key}
                                            style={[
                                                styles.categoryChip,
                                                isSelected && { backgroundColor: color + '30', borderColor: color },
                                            ]}
                                            onPress={() => toggleCategory(category.key)}
                                        >
                                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                                            <Text style={[
                                                styles.categoryLabel,
                                                isSelected && { color },
                                            ]}>
                                                {category.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Price Range */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                            </Text>
                            <View style={styles.rangeButtons}>
                                {[0, 50, 100, 200, 300, 500].map(value => (
                                    <Pressable
                                        key={`price-${value}`}
                                        style={[
                                            styles.rangeButton,
                                            filters.priceRange[1] === value && styles.rangeButtonActive,
                                        ]}
                                        onPress={() => setPriceMax(value)}
                                    >
                                        <Text style={[
                                            styles.rangeButtonText,
                                            filters.priceRange[1] === value && styles.rangeButtonTextActive,
                                        ]}>
                                            ${value}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Distance Range */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Distancia: {filters.distanceRange[0]} - {filters.distanceRange[1]} km
                            </Text>
                            <View style={styles.rangeButtons}>
                                {[5, 10, 20, 30, 40, 50].map(value => (
                                    <Pressable
                                        key={`distance-${value}`}
                                        style={[
                                            styles.rangeButton,
                                            filters.distanceRange[1] === value && styles.rangeButtonActive,
                                        ]}
                                        onPress={() => setDistanceMax(value)}
                                    >
                                        <Text style={[
                                            styles.rangeButtonText,
                                            filters.distanceRange[1] === value && styles.rangeButtonTextActive,
                                        ]}>
                                            {value} km
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Spacer */}
                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Apply Button */}
                    <View style={styles.footer}>
                        <Pressable style={styles.applyButton} onPress={onClose}>
                            <Text style={styles.applyButtonText}>Aplicar filtros</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.overlay,
        zIndex: 100,
    },
    panel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: PANEL_HEIGHT,
        backgroundColor: theme.colors.background.secondary,
        borderTopLeftRadius: theme.borderRadius['2xl'],
        borderTopRightRadius: theme.borderRadius['2xl'],
        zIndex: 101,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.border.default,
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
    },
    resetButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.md,
    },
    resetText: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
    },
    section: {
        marginTop: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        marginBottom: theme.spacing.md,
    },
    sortOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    sortChip: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    sortChipActive: {
        backgroundColor: theme.colors.accent.primary + '20',
        borderColor: theme.colors.accent.primary,
    },
    sortChipText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.sm,
    },
    sortChipTextActive: {
        color: theme.colors.accent.primary,
        fontWeight: theme.typography.weights.semibold,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        gap: theme.spacing.xs,
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryLabel: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.sm,
    },
    rangeButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    rangeButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    rangeButtonActive: {
        backgroundColor: theme.colors.accent.secondary + '20',
        borderColor: theme.colors.accent.secondary,
    },
    rangeButtonText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.sm,
    },
    rangeButtonTextActive: {
        color: theme.colors.accent.secondary,
        fontWeight: theme.typography.weights.semibold,
    },
    footer: {
        padding: theme.spacing.xl,
        paddingBottom: theme.spacing['3xl'],
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.subtle,
    },
    applyButton: {
        backgroundColor: theme.colors.accent.primary,
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
    },
    applyButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
    },
});
