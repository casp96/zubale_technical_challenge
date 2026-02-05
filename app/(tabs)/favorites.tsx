import { MasonryList } from '@/components/marketplace/MasonryList';
import { theme } from '@/constants/theme';
import { useMarketplaceStore } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { items, favorites } = useMarketplaceStore();
  const scrollY = useSharedValue(0);

  const favoriteItems = useMemo(() => {
    return items.filter(item => favorites.includes(item.id));
  }, [items, favorites]);

  if (favoriteItems.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <View style={styles.emptyIconContainer}>
          <FontAwesome name="star-o" size={60} color={theme.colors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>Sin favoritos todavía</Text>
        <Text style={styles.emptySubtitle}>
          Explora el marketplace y marca con una estrella los productos que te interesan.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Tus Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteItems.length} {favoriteItems.length === 1 ? 'producto guardado' : 'productos guardados'}
        </Text>
      </View>

      <MasonryList
        items={favoriteItems}
        scrollY={scrollY}
        refreshing={false}
        onRefresh={() => { }}
      />
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
    paddingHorizontal: theme.spacing['3xl'],
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
