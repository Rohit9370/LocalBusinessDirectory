/**
 * Application Theme Colors
 * Main Theme: Light Color (Sky Blue/Teal)
 */

const PRIMARY_COLOR = '#40E0D0'; // Turquoise - Light & Fresh
const SECONDARY_COLOR = '#4facfe'; // Light Blue gradient feel
const ACCENT_COLOR = '#FF6B6B'; // Soft Red for actions/errors

export const COLORS = {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,
  accent: ACCENT_COLOR,

  // Backgrounds
  background: '#F0F4F8',
  surface: '#FFFFFF',

  // Text
  text: '#2D3748',
  textLight: '#718096',
  textInverted: '#FFFFFF',

  // Status
  success: '#48BB78',
  error: '#F56565',
  warning: '#ED8936',

  // UI Elements
  border: '#E2E8F0',
  placeholder: '#A0AEC0',

  // Gradients
  gradientStart: '#40E0D0',
  gradientEnd: '#4facfe',
};

// Backwards compatibility for Expo Router template
const tintColorLight = PRIMARY_COLOR;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: COLORS.text,
    background: COLORS.background,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const SIZES = {
  padding: 20,
  radius: 12,
};

// Scale utilities for responsive design
export const SCALE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Font sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
};
