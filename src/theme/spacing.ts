export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    extraBold: 'System',
  },
  fontSize: {
    caption: 13,
    body: 16,
    subtitle: 18,
    title: 22,
    heading: 28,
    display: 36,
    hero: 48,
  },
  lineHeight: {
    body: 24,
    heading: 34,
    display: 44,
  },
} as const;
