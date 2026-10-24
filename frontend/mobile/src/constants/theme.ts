/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Brand = {
  bgBrand: '#155e54',
  bgSurface: '#ffffff',
  textOnBrand: '#ffffff',
  bgCanvas: '#f5f7f7',
  textPrimary: '#162120',
  textSecondary: '#4e5d5b',
  textTertiary: '#6b7b79',
  textLink: '#1b7266',
  borderDefault: '#dde4e3',
  borderStrong: '#c3cdcc',
  borderFocus: '#4aaa9c',
  dangerFg: '#b91c1c',
} as const;

export const Ring = {
  focus: 'rgba(42, 140, 126, 0.35)',
  danger: 'rgba(220, 38, 38, 0.25)',
} as const;

export const Radius = {
  xs: 4,
  md: 8,
  xl: 16,
  xl2: 24,
} as const;

export const FigmaSpace = {
  onePointFive: 6,
  three: 12,
  five: 20,
} as const;

export const InterFonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
} as const;

export const BottomTabInset =Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
