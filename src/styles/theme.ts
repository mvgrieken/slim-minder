export const theme = {
  colors: {
    // Primary colors - Warm gold/yellow theme
    primary: '#FFD700', // Bright gold
    primaryLight: '#FFE55C', // Light gold
    primaryDark: '#B8860B', // Darker gold (DarkGoldenrod)
    primaryHover: '#FFC107', // Amber gold for hover states
    
    // Secondary colors - Donkerdere steunkleuren
    secondary: '#1A1A2E', // Very dark navy blue
    secondaryLight: '#16213E', // Dark blue-gray
    secondaryDark: '#0F0F23', // Almost black blue
    
    // Accent colors - Donkerdere accenten
    accent: '#C17817', // Dark orange-brown
    accentLight: '#D4A574', // Warm beige
    accentDark: '#8B4513', // Saddle brown
    
    // Success/Error/Warning colors - Meer verfijnd
    success: '#2D5A27', // Dark green
    successLight: '#4A7C59', // Muted green
    error: '#8B2635', // Dark red
    errorLight: '#A0522D', // Sienna red
    warning: '#B8860B', // Dark goldenrod
    info: '#2C5F2D', // Dark forest green
    
    // Neutral colors - Warmere tinten
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FDFDFD',
    gray100: '#F5F5F5',
    gray200: '#E8E8E8',
    gray300: '#D1D1D1',
    gray400: '#A8A8A8',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    gray900: '#171717',
    
    // Background colors - Warmere tinten
    background: '#FEFEFE',
    surface: '#FFFFFF',
    surfaceHover: '#F8F8F8',
    surfaceActive: '#F0F0F0',
    
    // Text colors - Donkerder voor betere leesbaarheid
    textPrimary: '#1A1A1A',
    textSecondary: '#404040',
    textTertiary: '#737373',
    textInverse: '#FFFFFF',
    
    // Border colors - Subtielere tinten
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    borderDark: '#C0C0C0',
    
    // Shadow colors - Meer subtiel
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',
    shadowLight: 'rgba(0, 0, 0, 0.03)',
    
    // Gradient colors
    gradientPrimary: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
    gradientSecondary: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    gradientAccent: 'linear-gradient(135deg, #C17817 0%, #8B4513 100%)',
    gradientSuccess: 'linear-gradient(135deg, #2D5A27 0%, #4A7C59 100%)',
    gradientError: 'linear-gradient(135deg, #8B2635 0%, #A0522D 100%)',
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
  
  // Shadows - Meer verfijnd
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
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