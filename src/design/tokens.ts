import { Platform } from 'react-native';

export const colors = {
  bg: '#0A0A0B',
  canvas: '#030304',
  surface: '#161618',
  surfaceRaised: '#202024',
  border: '#2B2B30',
  textPrimary: '#F7F7F8',
  textSecondary: '#A1A1A8',
  textMuted: '#74747C',
  accent: '#D7FF4A',
  accentPressed: '#BFE532',
  onAccent: '#0A0A0B',
  muscle: '#FF5A5F',
  warning: '#FFB74D',
  danger: '#FF5A5F',
  white: '#FFFFFF',
  black: '#000000',
  successMuted: '#2B3420',
} as const;

export const spacing = {
  micro: 4,
  compact: 8,
  related: 12,
  standard: 16,
  section: 24,
  major: 32,
  hero: 48,
} as const;

export const radii = {
  compact: 12,
  card: 20,
  media: 24,
  sheet: 28,
  pill: 999,
} as const;

export const typography = {
  displayXL: { fontSize: 40, lineHeight: 44, fontWeight: '700' as const },
  displayL: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  numeric: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '700' as const,
  },
} as const;

export const shadows = Platform.select({
  web: { boxShadow: '0 24px 80px rgba(0,0,0,0.45)' },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
});
