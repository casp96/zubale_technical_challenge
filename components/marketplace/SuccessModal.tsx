import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
;

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export function SuccessModal({ visible, onClose }: SuccessModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    entering={FadeIn}
                    style={styles.backdrop}
                >
                    <Pressable style={styles.flex} />
                </Animated.View>

                <Animated.View
                    entering={ZoomIn.springify()}
                    style={styles.modalContainer}
                >
                    <View style={styles.iconCircle}>
                        <FontAwesome name="check" size={40} color={theme.colors.text.primary} />
                    </View>

                    <Text style={styles.title}>¡Compra Exitosa!</Text>
                    <Text style={styles.description}>
                        Tu pedido ha sido procesado correctamente y llegará pronto a tu destino.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.closeButton,
                            pressed && styles.closeButtonPressed
                        ]}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Volver al Inicio</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    flex: {
        flex: 1,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 24,
        padding: theme.spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: theme.colors.text.tertiary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing['2xl'],
    },
    closeButton: {
        width: '100%',
        backgroundColor: theme.colors.accent.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    closeButtonText: {
        color: theme.colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
