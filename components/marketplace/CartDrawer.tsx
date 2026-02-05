import { theme } from '@/constants/theme';
import { useMarketplaceStore } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

export function CartDrawer() {
    const insets = useSafeAreaInsets();
    const {
        cart,
        isCartOpen,
        toggleCart,
        updateQuantity,
        removeFromCart,
        getCartTotal
    } = useMarketplaceStore();

    const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

    const translateX = useSharedValue(DRAWER_WIDTH);

    useEffect(() => {
        if (isCartOpen) {
            translateX.value = withTiming(0, { duration: 300 });
        } else {
            translateX.value = withTiming(DRAWER_WIDTH, { duration: 300 });
        }
    }, [isCartOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    if (!isCartOpen && translateX.value === DRAWER_WIDTH) return null;

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <Pressable
                    style={styles.backdrop}
                    onPress={toggleCart}
                >
                    <Animated.View style={[styles.backdropFill]} />
                </Pressable>
            )}

            {/* Drawer */}
            <Animated.View style={[styles.drawer, { paddingTop: insets.top }, animatedStyle]}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Tu Carrito ({totalItems})</Text>
                    <Pressable onPress={toggleCart} style={styles.closeButton}>
                        <FontAwesome name="times" size={20} color={theme.colors.text.secondary} />
                    </Pressable>
                </View>

                {/* Items List */}
                <ScrollView
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {cart.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome name="shopping-cart" size={48} color={theme.colors.text.tertiary} />
                            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                            <Text style={styles.emptySubtext}>¡Agrega productos increíbles!</Text>
                        </View>
                    ) : (
                        cart.map((cartItem, index) => (
                            <View key={`${cartItem.item.id}-${index}`} style={styles.cartItem}>
                                <Image
                                    source={{ uri: cartItem.item.imageUrl }}
                                    style={styles.itemImage}
                                    contentFit="cover"
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemTitle} numberOfLines={2}>{cartItem.item.title}</Text>
                                    <View style={styles.itemPriceRow}>
                                        <Text style={styles.itemPrice}>${cartItem.item.price.toFixed(0)}</Text>

                                        <View style={styles.quantityControls}>
                                            <Pressable
                                                onPress={() => updateQuantity(cartItem.item.id, -1)}
                                                style={styles.qtyButton}
                                            >
                                                <FontAwesome name="minus" size={12} color={theme.colors.text.secondary} />
                                            </Pressable>
                                            <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                                            <Pressable
                                                onPress={() => updateQuantity(cartItem.item.id, 1)}
                                                style={styles.qtyButton}
                                            >
                                                <FontAwesome name="plus" size={12} color={theme.colors.text.secondary} />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => removeFromCart(cartItem.item.id)}
                                    style={styles.removeButton}
                                >
                                    <FontAwesome name="trash-o" size={20} color={theme.colors.status.error} />
                                </Pressable>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Footer */}
                <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${getCartTotal().toFixed(0)}</Text>
                    </View>
                    <Pressable
                        style={[styles.checkoutButton, cart.length === 0 && styles.checkoutButtonDisabled]}
                        onPress={() => {
                            toggleCart();
                            router.push('/checkout');
                        }}
                        disabled={cart.length === 0}
                    >
                        <Text style={styles.checkoutText}>Pagar Ahora</Text>
                        <FontAwesome name="credit-card" size={16} color={theme.colors.text.primary} />
                    </Pressable>
                </View>

            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    // ... existing styles ...
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    backdropFill: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: DRAWER_WIDTH,
        backgroundColor: theme.colors.background.secondary,
        zIndex: 1001,
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.border.subtle,
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },
    title: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.primary,
    },
    closeButton: {
        padding: theme.spacing.sm,
    },
    listContent: {
        padding: theme.spacing.lg,
        gap: theme.spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: theme.spacing.md,
    },
    emptyText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.secondary,
    },
    emptySubtext: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text.tertiary,
    },
    cartItem: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        backgroundColor: theme.colors.background.tertiary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.primary,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        marginBottom: 4,
    },
    itemPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    itemPrice: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.bold,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        padding: 4,
        gap: 12,
    },
    qtyButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: 6,
    },
    qtyText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.bold,
        minWidth: 16,
        textAlign: 'center',
    },
    removeButton: {
        justifyContent: 'center',
        paddingLeft: theme.spacing.sm,
    },
    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.subtle,
        backgroundColor: theme.colors.background.secondary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    totalLabel: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.md,
    },
    totalValue: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
    },
    checkoutButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.accent.primary,
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    checkoutButtonDisabled: {
        opacity: 0.5,
        backgroundColor: theme.colors.background.tertiary,
    },
    checkoutText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
    },
});
