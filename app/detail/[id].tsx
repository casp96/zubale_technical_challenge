import { categoryColors, theme } from '@/constants/theme';
import { getItemById } from '@/data/mockData';
import { useMarketplaceStore } from '@/store/store';
import { CATEGORIES } from '@/types/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    Extrapolation,
    FadeIn,
    interpolate,
    SlideInUp,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);
    const { addToCart, favorites, toggleFavorite } = useMarketplaceStore();

    const item = getItemById(id || '');

    if (!item) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Item no encontrado</Text>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    const categoryInfo = CATEGORIES.find(c => c.key === item.category);
    const categoryColor = categoryColors[item.category] || theme.colors.accent.primary;

    // Scroll handler
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Parallax effect for header image
    const headerImageStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [-100, 0, HEADER_HEIGHT],
            [-50, 0, HEADER_HEIGHT * 0.5],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            scrollY.value,
            [-100, 0],
            [1.5, 1],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }, { scale }],
        };
    });

    // Back button style
    const backButtonStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolate(
            scrollY.value,
            [0, 100],
            [0, 1],
            Extrapolation.CLAMP
        );

        return {
            backgroundColor: `rgba(10, 10, 15, ${backgroundColor * 0.9})`,
        };
    });

    // Format relative time
    const getRelativeTime = () => {
        const now = new Date();
        const posted = new Date(item.postedAt);
        const diffHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));

        if (diffHours < 1) return 'Hace un momento';
        if (diffHours < 24) return `Hace ${diffHours} horas`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Ayer';
        return `Hace ${diffDays} días`;
    };

    return (
        <View style={styles.container}>
            {/* Header Image */}
            <Animated.View style={[styles.headerImage, headerImageStyle]}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={StyleSheet.absoluteFill}
                    placeholder={BLURHASH}
                    contentFit="cover"
                    transition={300}
                />
                <View style={styles.imageOverlay} />
            </Animated.View>

            {/* Back Button */}
            <Animated.View style={[styles.backButtonContainer, { top: insets.top + 8 }, backButtonStyle]}>
                <Pressable
                    style={styles.iconButton}
                    onPress={() => router.back()}
                >
                    <FontAwesome name="arrow-left" size={20} color={theme.colors.text.primary} />
                </Pressable>
            </Animated.View>

            {/* Favorite Button */}
            <View style={[styles.shareButtonContainer, { top: insets.top + 8 }]}>
                <Pressable
                    style={styles.iconButton}
                    onPress={() => item.id && toggleFavorite(item.id)}
                >
                    <FontAwesome
                        name={favorites.includes(item.id) ? "star" : "star-o"}
                        size={20}
                        color={favorites.includes(item.id) ? "#FFD700" : theme.colors.text.primary}
                    />
                </Pressable>
            </View>

            {/* Content */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
            >
                {/* Main Card */}
                <Animated.View
                    style={styles.contentCard}
                    entering={SlideInUp.delay(100).springify()}
                >
                    {/* Badges Row */}
                    <View style={styles.badgesRow}>
                        {/* Category Badge */}
                        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                            <Text style={styles.categoryEmoji}>{categoryInfo?.icon}</Text>
                            <Text style={[styles.categoryText, { color: categoryColor }]}>
                                {categoryInfo?.label}
                            </Text>
                        </View>

                        {item.urgent && (
                            <View style={styles.urgentBadge}>
                                <Text style={styles.urgentText}>🔥 Urgente</Text>
                            </View>
                        )}

                        {item.featured && (
                            <View style={styles.featuredBadge}>
                                <Text style={styles.featuredText}>⭐ Destacado</Text>
                            </View>
                        )}
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{item.title}</Text>

                    {/* Location & Time */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <FontAwesome name="map-marker" size={14} color={theme.colors.text.tertiary} />
                            <Text style={styles.metaText}>{item.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome name="clock-o" size={14} color={theme.colors.text.tertiary} />
                            <Text style={styles.metaText}>{getRelativeTime()}</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>${item.price.toFixed(0)}</Text>
                            <Text style={styles.statLabel}>Precio</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{item.distance} km</Text>
                            <Text style={styles.statLabel}>Distancia</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.ratingValue}>
                                <Text style={styles.statValue}>{item.rating.toFixed(1)}</Text>
                                <Text style={styles.ratingStar}>★</Text>
                            </View>
                            <Text style={styles.statLabel}>{item.reviewCount} reseñas</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    {/* Technical Details */}
                    {item.technicalDetails && (
                        <>
                            <Text style={styles.sectionTitle}>Ficha Técnica</Text>
                            <View style={styles.specsContainer}>
                                {Object.entries(item.technicalDetails).map(([key, value], index) => (
                                    <View key={key} style={[
                                        styles.specRow,
                                        index % 2 === 0 && styles.specRowAlt
                                    ]}>
                                        <Text style={styles.specLabel}>{key}</Text>
                                        <Text style={styles.specValue}>{value}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Shipping & Delivery (Replacing Benefits) */}
                    <Text style={styles.sectionTitle}>Envío y Entrega</Text>
                    <View style={styles.benefitsGrid}>
                        {[
                            { icon: '🚚', label: 'Envío Gratis', sub: 'En pedidos > $500' },
                            { icon: '🛡️', label: 'Garantía', sub: '30 días de devolución' },
                            { icon: '⚡', label: 'Entrega Full', sub: 'Llega mañana' },
                            { icon: '💳', label: 'Meses sin intereses', sub: 'Hasta 12 meses' },
                        ].map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                                <View>
                                    <Text style={styles.benefitLabel}>{benefit.label}</Text>
                                    <Text style={styles.benefitSub}>{benefit.sub}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Spacer for CTA */}
                    <View style={{ height: 100 }} />
                </Animated.View>
            </Animated.ScrollView>

            {/* CTA Footer */}
            <Animated.View
                style={[styles.ctaFooter, { paddingBottom: insets.bottom + 16 }]}
                entering={FadeIn.delay(300)}
            >
                <View style={styles.ctaContent}>
                    <View>
                        <Text style={styles.ctaPrice}>${item.price.toFixed(0)}</Text>
                        <Text style={styles.ctaSubtext}>Mejor precio garantizado</Text>
                    </View>
                    <Pressable
                        style={styles.ctaButton}
                        onPress={() => addToCart(item)}
                    >
                        <Text style={styles.ctaButtonText}>Comprar Ahora</Text>
                        <FontAwesome name="shopping-cart" size={16} color={theme.colors.text.primary} />
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.lg,
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.accent.primary,
        borderRadius: theme.borderRadius.lg,
    },
    backButtonText: {
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weights.semibold,
    },
    headerImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButtonContainer: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
    },
    shareButtonContainer: {
        position: 'absolute',
        right: 16,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentCard: {
        backgroundColor: theme.colors.background.secondary,
        borderTopLeftRadius: theme.borderRadius['2xl'],
        borderTopRightRadius: theme.borderRadius['2xl'],
        marginTop: -24,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        minHeight: SCREEN_HEIGHT - HEADER_HEIGHT + 100,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        gap: theme.spacing.xs,
    },
    categoryEmoji: {
        fontSize: 14,
    },
    categoryText: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
    urgentBadge: {
        backgroundColor: theme.colors.status.error + '20',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
    },
    urgentText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
    featuredBadge: {
        backgroundColor: theme.colors.accent.primary + '20',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
    },
    featuredText: {
        color: theme.colors.accent.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
        marginBottom: theme.spacing.md,
        lineHeight: theme.typography.sizes['2xl'] * 1.3,
    },
    metaRow: {
        flexDirection: 'row',
        gap: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    metaText: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.sm,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
    },
    statLabel: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.xs,
        marginTop: theme.spacing.xs,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border.default,
    },
    ratingValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingStar: {
        color: '#FFD700',
        fontSize: theme.typography.sizes.lg,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.subtle,
        marginVertical: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        marginBottom: theme.spacing.md,
    },
    description: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.md,
        lineHeight: theme.typography.sizes.md * 1.6,
        marginBottom: theme.spacing.md,
    },
    requirementsList: {
        marginBottom: theme.spacing.xl,
    },
    requirementItem: {
        paddingVertical: theme.spacing.sm,
    },
    requirementText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.md,
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    benefitItem: {
        width: '47%',
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    benefitIcon: {
        fontSize: 28,
        marginBottom: theme.spacing.sm,
    },
    benefitLabel: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
    benefitSub: {
        color: theme.colors.text.tertiary,
        fontSize: 10,
    },
    specsContainer: {
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    specRow: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },
    specRowAlt: {
        backgroundColor: theme.colors.background.secondary,
    },
    specLabel: {
        flex: 1,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
    specValue: {
        flex: 1.5,
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        textAlign: 'right',
    },
    ctaFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background.secondary,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.subtle,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
    },
    ctaContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ctaPrice: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
    },
    ctaSubtext: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.sm,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.accent.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
    },
    ctaButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
    },
});
