/**
 * S1S2 Design Tokens
 *
 * S1 (warm coral) = systole, beginnings, energy
 * S2 (cool blue) = diastole, completion, calm
 * The deep space palette creates an atmospheric, premium feel.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  // S1S2 Brand Colors
  s1: {
    primary: '#E85D5D',    // warm coral — the "lub"
    light: '#FF8A8A',
    dark: '#B84343',
    muted: '#E85D5D40',
  },
  s2: {
    primary: '#5D8DE8',    // cool blue — the "dub"
    light: '#8AB4FF',
    dark: '#4367B8',
    muted: '#5D8DE840',
  },
  harmonic: {
    primary: '#C490E4',    // bridge between S1 and S2
    light: '#DDB8F5',
    dark: '#9A6AB8',
    muted: '#C490E440',
  },

  // Space Palette
  space: {
    void: '#050810',       // deepest black
    deep: '#0A0E1A',       // main background
    mid: '#121A2E',        // card backgrounds
    surface: '#1A2340',    // elevated surfaces
    nebula: '#1E2A4A',     // subtle highlight areas
  },

  // Star & Accent Colors
  star: {
    gold: '#FFD666',       // streaks, milestones, discoveries
    silver: '#C8D6E5',     // secondary accents
    ember: '#FF9147',      // fuel, energy indicators
    aurora: '#47FFCB',     // health positive indicators
  },

  // Text
  text: {
    primary: '#E8ECF4',    // main text
    secondary: '#8892A8',  // subdued text
    muted: '#4A5568',      // very subtle text
    inverse: '#0A0E1A',    // text on light backgrounds
  },

  // Rarity Colors
  rarity: {
    common: '#8892A8',
    uncommon: '#47FFCB',
    rare: '#5D8DE8',
    epic: '#C490E4',
    legendary: '#FFD666',
    mythic: '#FF6B9D',
  },

  // System Type Colors (for galaxy map)
  biome: {
    nebula: '#7B68EE',
    asteroidField: '#C8D6E5',
    gasGiant: '#E85D5D',
    binaryStar: '#FFD666',
    deepVoid: '#1A1A2E',
    stellarNursery: '#47FFCB',
    pulsar: '#5D8DE8',
    blackHole: '#C490E4',
  },

  // Keep light/dark for system components
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#E8ECF4',
    background: '#0A0E1A',
    backgroundElement: '#121A2E',
    backgroundSelected: '#1A2340',
    textSecondary: '#8892A8',
  },

  // Semantic
  success: '#47FFCB',
  warning: '#FFD666',
  error: '#E85D5D',
  info: '#5D8DE8',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
  hero: 48,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
