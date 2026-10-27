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
  textDisabled: '#94a3a1',
  textLink: '#1b7266',
  borderDefault: '#dde4e3',
  borderStrong: '#c3cdcc',
  borderFocus: '#4aaa9c',
  borderBrand: '#1b7266',
  dangerFg: '#b91c1c',
  bgBrandMuted: '#d5efea',
  bgBrandSubtle: '#eef8f6',
  bgBrandHover: '#124b44',
  bgNote: '#f2f5f5',
  sheetHandle: '#d9dede',
  scrim: 'rgba(11, 19, 18, 0.45)',
  bgMuted: '#edf1f1',
  borderSubtle: '#edf1f1',
  textBrand: '#155e54',
  dangerSolid: '#dc2626',
} as const;

export const Ring = {
  focus: 'rgba(42, 140, 126, 0.35)',
  danger: 'rgba(220, 38, 38, 0.25)',
} as const;

export const Radius = {
  xs: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xl2: 24,
} as const;

/** Ticket priority, status and SLA colours from the Figma badge components. */
export const TicketColors = {
  priority: {
    critical: { bg: '#fef2f2', fg: '#b91c1c', solid: '#dc2626' },
    high: { bg: '#fff7ed', fg: '#c2410c', solid: '#ea580c' },
    medium: { bg: '#fffbeb', fg: '#b45309', solid: '#d97706' },
    normal: { bg: '#edf1f1', fg: '#4e5d5b', solid: '#94a3a1' },
  },
  status: {
    assigned: { bg: '#f5f3ff', fg: '#6d28d9' },
    claimed: { bg: '#eef8f6', fg: '#155e54' },
    inProgress: { bg: '#fffbeb', fg: '#b45309' },
    escalated: { bg: '#fef2f2', fg: '#b91c1c' },
    resolved: { bg: '#f0fdf4', fg: '#15803d' },
    closed: { bg: '#edf1f1', fg: '#3a4746' },
  },
  sla: {
    onTrack: { bg: '#f0fdf4', fg: '#15803d' },
    met: { bg: '#f0fdf4', fg: '#15803d' },
    warning: { bg: '#fffbeb', fg: '#b45309' },
    breached: { bg: '#fef2f2', fg: '#b91c1c' },
  },
  successBg: '#f0fdf4',
  successFg: '#15803d',
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

export const MonoFonts = {
  medium: 'JetBrainsMono_500Medium',
} as const;

export const BottomTabInset =Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
