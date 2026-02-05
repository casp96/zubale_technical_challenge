import { theme } from '@/constants/theme';
import { useMarketplaceStore } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
    const insets = useSafeAreaInsets();
    const { cart, getCartTotal, clearCart } = useMarketplaceStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            Alert.alert(
                '¡Compra Exitosa!',
                'Tu pedido ha sido procesado correctamente.',
                [
                    {
                        text: 'Volver al Inicio',
                        onPress: () => {
                            clearCart();
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );
        }, 2000);
    };

    if (cart.length === 0) {
        router.replace('/(tabs)');
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={20} color={theme.colors.text.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Steps */}
                <View style={styles.stepsContainer}>
                    <View style={styles.stepActive}>
                        <Text style={styles.stepNumber}>1</Text>
                        <Text style={styles.stepLabel}>Resumen</Text>
                    </View>
                    <View style={styles.stepDivider} />
                    <View style={styles.stepInactive}>
                        <Text style={styles.stepNumberIn}>2</Text>
                        <Text style={styles.stepLabelIn}>Pago</Text>
                    </View>
                    <View style={styles.stepDivider} />
                    <View style={styles.stepInactive}>
                        <Text style={styles.stepNumberIn}>3</Text>
                        <Text style={styles.stepLabelIn}>Fin</Text>
                    </View>
                </View>

                {/* Items Summary */}
                <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
                <View style={styles.card}>
                    {cart.map((cartItem, index) => (
                        <View key={`${cartItem.item.id}-${index}`} style={styles.itemRow}>
                            <Image source={{ uri: cartItem.item.imageUrl }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle} numberOfLines={1}>{cartItem.item.title}</Text>
                                <Text style={styles.itemQty}>Cant: {cartItem.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>${(cartItem.item.price * cartItem.quantity).toFixed(0)}</Text>
                        </View>
                    ))}
                </View>

                {/* Shipping Method */}
                <Text style={styles.sectionTitle}>Método de Envío</Text>
                <View style={[styles.card, styles.shippingCard]}>
                    <View style={styles.radioSelected}>
                        <View style={styles.radioInner} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.shippingTitle}>Envío Estándar</Text>
                        <Text style={styles.shippingDesc}>Llega mañana</Text>
                    </View>
                    <Text style={styles.shippingPrice}>
                        {shipping === 0 ? 'GRATIS' : `$${shipping}`}
                    </Text>
                </View>

                {/* Payment Method */}
                <Text style={styles.sectionTitle}>Método de Pago</Text>
                <View style={styles.paymentCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardBank}>Monzo</Text>
                        <FontAwesome name="cc-mastercard" size={24} color="white" opacity={0.8} />
                    </View>
                    <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.cardLabel}>Titular</Text>
                            <Text style={styles.cardValue}>Carlos Pérez</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expira</Text>
                            <Text style={styles.cardValue}>09/28</Text>
                        </View>
                    </View>
                </View>

                {/* Totals */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>
                            {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabelFinal}>Total</Text>
                        <Text style={styles.totalValueFinal}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer Actions */}
            <Animated.View
                entering={SlideInDown}
                style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}
            >
                <Pressable
                    style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                    onPress={handleCheckout}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color={theme.colors.text.primary} />
                    ) : (
                        <>
                            <Text style={styles.payButtonText}>Confirmar Pagar ${total.toFixed(0)}</Text>
                            <FontAwesome name="lock" size={16} color={theme.colors.text.primary} />
                        </>
                    )}
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.background.secondary,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.background.tertiary,
    },
    headerTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.primary,
    },
    content: {
        padding: theme.spacing.lg,
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xl,
    },
    stepActive: {
        alignItems: 'center',
        gap: 4,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.accent.primary,
        color: theme.colors.text.primary,
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: 'bold',
    },
    stepLabel: {
        color: theme.colors.accent.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepDivider: {
        width: 40,
        height: 2,
        backgroundColor: theme.colors.border.default,
        marginHorizontal: 8,
        top: -10,
    },
    stepInactive: {
        alignItems: 'center',
        gap: 4,
        opacity: 0.5,
    },
    stepNumberIn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.background.tertiary,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    stepLabelIn: {
        color: theme.colors.text.secondary,
        fontSize: 12,
    },
    sectionTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.tertiary,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
    itemQty: {
        color: theme.colors.text.tertiary,
        fontSize: 12,
    },
    itemPrice: {
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    shippingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    radioSelected: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.accent.primary,
    },
    shippingTitle: {
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    shippingDesc: {
        color: theme.colors.accent.secondary,
        fontSize: 12,
    },
    shippingPrice: {
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    paymentCard: {
        backgroundColor: '#1E1E2E', // Slightly lighter than secondary
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        marginTop: theme.spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 180,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBank: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    cardNumber: {
        color: 'white',
        fontSize: 22,
        letterSpacing: 2,
        fontFamily: 'SpaceMono',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    summaryContainer: {
        marginTop: theme.spacing.xl,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
        color: theme.colors.text.secondary,
    },
    summaryValue: {
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.subtle,
        marginVertical: theme.spacing.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabelFinal: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
    },
    totalValueFinal: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.subtle,
    },
    payButton: {
        backgroundColor: theme.colors.accent.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: theme.borderRadius.xl,
        gap: 10,
        shadowColor: theme.colors.accent.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonDisabled: {
        opacity: 0.7,
    },
    payButtonText: {
        color: theme.colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
