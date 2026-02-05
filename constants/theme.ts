// Modern Design System for Infinite Marketplace
// Dark theme with vibrant accents

export const theme = {
    colors: {
        // Background colors
        background: {
            primary: '#0A0A0F',
            secondary: '#12121A',
            tertiary: '#1A1A2E',
            card: '#16161F',
            elevated: '#1E1E2D',
        },

        // Accent colors
        accent: {
            primary: '#6366F1', // Indigo
            secondary: '#22D3EE', // Cyan
            tertiary: '#A855F7', // Purple
            gradient: ['#6366F1', '#A855F7'],
        },

        // Status colors
        status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },

        // Text colors
        text: {
            primary: '#FFFFFF',
            secondary: '#A1A1AA',
            tertiary: '#71717A',
            muted: '#52525B',
            inverse: '#0A0A0F',
        },

        // Border colors
        border: {
            default: '#27272A',
            subtle: '#1F1F23',
            focused: '#6366F1',
        },

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.6)',
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
    },

    // Spacing scale
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        '2xl': 24,
        '3xl': 32,
        '4xl': 40,
        '5xl': 48,
    },

    // Border radius
    borderRadius: {
        sm: 6,
        md: 10,
        lg: 14,
        xl: 18,
        '2xl': 24,
        full: 9999,
    },

    // Typography
    typography: {
        sizes: {
            xs: 11,
            sm: 13,
            md: 15,
            lg: 17,
            xl: 20,
            '2xl': 24,
            '3xl': 30,
            '4xl': 36,
        },
        weights: {
            regular: '400' as const,
            medium: '500' as const,
            semibold: '600' as const,
            bold: '700' as const,
        },
        lineHeights: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75,
        },
    },

    // Shadows (for elevated surfaces)
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 8,
        },
        glow: {
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
    },

    // Animation durations
    animation: {
        fast: 150,
        normal: 250,
        slow: 350,
    },
} as const;

// Category colors for badges
export const categoryColors: Record<string, string> = {
    food_delivery: '#FF6B6B',
    shopping: '#4ECDC4',
    warehouse: '#FFE66D',
    cleaning: '#95E1D3',
    surveys: '#DDA0DD',
    delivery: '#87CEEB',
    driving: '#F0E68C',
    tech: '#B8B8FF',
};

export type Theme = typeof theme;
