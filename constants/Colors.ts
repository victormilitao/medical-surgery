/**
 * Centralized color palette for the entire app.
 * This is the single source of truth — used by both tailwind.config.js (for className styling)
 * and directly in components (for color props like <Icon color={Colors.primary.main} />).
 *
 * NEVER use raw hex values in components. Always import from here.
 */

export const Colors = {
    // Base
    white: '#ffffff',
    black: '#000000',

    // Primary palette (azul institucional)
    primary: {
        50: '#E8EDF3',
        100: '#C5D3E5',
        200: '#9AB4D1',
        300: '#6F95BD',
        400: '#4F7DAD',
        500: '#2F659D',
        600: '#275590',
        700: '#1B3A5C',
        800: '#142D47',
        900: '#0D1F33',
        /** Alias for primary-700 — the main brand color */
        main: '#1B3A5C',
    },

    // Gray palette
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },

    // Semantic / Status colors
    status: {
        success: '#16A34A',
        successDark: '#166534',
        active: '#22c55e',
        critical: '#DC2626',
        danger: '#EF4444',
        warning: '#D97706',
        caution: '#eab308',
    },

    // Accent / Feature colors
    accent: {
        teal: '#00BFA5',
        blue: '#2563EB',
        blueMedium: '#3B82F6',
        purple: '#9333EA',
        pink: '#EC4899',
        link: '#0a7ea4',
    },
} as const;
