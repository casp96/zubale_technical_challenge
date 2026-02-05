import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>Tus trabajos guardados</Text>
      </View>

      <View style={styles.emptyState}>
        <View style={styles.iconContainer}>
          <FontAwesome name="heart-o" size={48} color={theme.colors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>Sin favoritos todavía</Text>
        <Text style={styles.emptyText}>
          Guarda los trabajos que te interesen para acceder a ellos fácilmente después
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['3xl'],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.md,
    textAlign: 'center',
    lineHeight: theme.typography.sizes.md * 1.5,
  },
});
