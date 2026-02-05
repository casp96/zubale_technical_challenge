import { theme } from '@/constants/theme';
import { useMarketplaceStore } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail } = useMarketplaceStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            setUserEmail(email);
            setIsLoggedIn(true);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
    };

    if (!isLoggedIn) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.loginContent}>
                    <View style={styles.loginHeader}>
                        <View style={styles.iconContainer}>
                            <FontAwesome name="user" size={40} color={theme.colors.accent.primary} />
                        </View>
                        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
                        <Text style={styles.subText}>Inicia sesión para continuar</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <FontAwesome name="envelope" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo electrónico"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                returnKeyType="next"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <FontAwesome name="lock" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                returnKeyType="go"
                            />
                        </View>

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Ingresar</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>O continúa con</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="google" size={20} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="facebook" size={20} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <FontAwesome name="apple" size={20} color={theme.colors.text.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container]} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header Profile */}
            <View style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/300?img=11' }}
                    style={styles.avatar}
                />
                <Text style={styles.userName}>Carlos Pérez</Text>
                <Text style={styles.userEmail}>{userEmail || 'usuario@ejemplo.com'}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Miembro Gold</Text>
                </View>
            </View>

            {/* Menu Options */}
            <View style={styles.menuContainer}>
                <MenuItem icon="shopping-bag" title="Mis Pedidos" subtitle="Ver historial de compras" />
                <MenuItem icon="map-marker" title="Direcciones" subtitle="Gestionar direcciones de entrega" />
                <MenuItem icon="credit-card" title="Métodos de Pago" subtitle="Tarjetas guardadas" />
                <MenuItem icon="bell" title="Notificaciones" subtitle="Gestionar alertas" hasSwitch />
                <MenuItem icon="question-circle" title="Ayuda y Soporte" subtitle="Centro de ayuda" />

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function MenuItem({ icon, title, subtitle, hasSwitch = false }: { icon: any, title: string, subtitle: string, hasSwitch?: boolean }) {
    return (
        <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}>
                <FontAwesome name={icon} size={20} color={theme.colors.accent.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            {hasSwitch ? (
                <Switch
                    trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.accent.primary }}
                    thumbColor={theme.colors.text.primary}
                    value={true}
                />
            ) : (
                <FontAwesome name="angle-right" size={20} color={theme.colors.text.tertiary} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    loginContent: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
    },
    loginHeader: {
        alignItems: 'center',
        marginBottom: theme.spacing['4xl'],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    welcomeText: {
        fontSize: theme.typography.sizes['3xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    subText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text.secondary,
    },
    form: {
        gap: theme.spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.xl,
        paddingHorizontal: theme.spacing.lg,
        height: 56,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    inputIcon: {
        marginRight: theme.spacing.md,
    },
    input: {
        flex: 1,
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.md,
    },
    loginButton: {
        backgroundColor: theme.colors.accent.primary,
        height: 56,
        borderRadius: theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    loginButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border.subtle,
    },
    dividerText: {
        color: theme.colors.text.tertiary,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.typography.sizes.sm,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.lg,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
    },
    // Profile Styles
    profileHeader: {
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        paddingBottom: theme.spacing.xl,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 3,
        borderColor: theme.colors.accent.primary,
    },
    userName: {
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    badge: {
        backgroundColor: theme.colors.accent.secondary + '20',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.accent.secondary,
    },
    badgeText: {
        color: theme.colors.accent.secondary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: 'bold',
    },
    menuContainer: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        gap: theme.spacing.md,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.bold,
        marginBottom: 2,
    },
    menuSubtitle: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.sizes.sm,
    },
    logoutButton: {
        marginTop: theme.spacing.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    logoutText: {
        color: theme.colors.status.error,
        fontWeight: 'bold',
        fontSize: theme.typography.sizes.lg,
    },
});
