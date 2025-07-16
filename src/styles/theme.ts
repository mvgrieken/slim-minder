export const theme = {
  colors: {
    // Primary colors - Warm gold/yellow theme
    primary: '#FFD700', // Bright gold
    primaryLight: '#FFE55C', // Light gold
    primaryDark: '#DAA520', // Darker gold
    primaryHover: '#FFC107', // Amber gold for hover states
    
    // Secondary colors
    secondary: '#2C3E50', // Dark blue-gray
    secondaryLight: '#34495E', // Lighter blue-gray
    secondaryDark: '#1B2631', // Very dark blue-gray
    
    // Accent colors
    accent: '#E67E22', // Orange accent
    accentLight: '#F39C12', // Light orange
    accentDark: '#D35400', // Dark orange
    
    // Success/Error/Warning colors
    success: '#27AE60', // Green
    successLight: '#2ECC71', // Light green
    error: '#E74C3C', // Red
    errorLight: '#FF6B6B', // Light red
    warning: '#F39C12', // Orange warning
    info: '#3498DB', // Blue info
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F8F9FA',
    gray100: '#F1F3F4',
    gray200: '#E8EAED',
    gray300: '#DADCE0',
    gray400: '#BDC1C6',
    gray500: '#9AA0A6',
    gray600: '#80868B',
    gray700: '#5F6368',
    gray800: '#3C4043',
    gray900: '#202124',
    
    // Background colors
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceHover: '#F8F9FA',
    surfaceActive: '#F1F3F4',
    
    // Text colors
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    textTertiary: '#9AA0A6',
    textInverse: '#FFFFFF',
    
    // Border colors
    border: '#E8EAED',
    borderLight: '#F1F3F4',
    borderDark: '#DADCE0',
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
  },
  
  // Typography
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

export type Theme = typeof theme; 