// Design System - Color Tokens
export const colors = {
  // Neutrals (White/Gray)
  gray: {
    50: '#ffffff',
    100: '#f8f9fa',
    200: '#f0f2f5',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#9ca3af',
    600: '#6b7280',
    700: '#4b5563',
    800: '#2d3748',
    900: '#1a202c',
  },
  
  // Brand - Blue (Primary)
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
  },
  
  // Accent - Light Blue
  lightBlue: {
    50: '#f0f9ff',
    500: '#06b6d4',
    600: '#0891b2',
  },
  
  // Semantic
  white: '#ffffff',
  black: '#000000',
}

// Spacing Scale
export const spacing = {
  0: '0',
  2: '0.5rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  24: '6rem',
  32: '8rem',
  48: '12rem',
}

// Typography Scale
export const typography = {
  h1: {
    size: '2.25rem', // 36px
    weight: 700,
    lineHeight: 1.2,
  },
  h2: {
    size: '1.875rem', // 30px
    weight: 600,
    lineHeight: 1.3,
  },
  h3: {
    size: '1.5rem', // 24px
    weight: 600,
    lineHeight: 1.4,
  },
  h4: {
    size: '1.25rem', // 20px
    weight: 600,
    lineHeight: 1.4,
  },
  body: {
    lg: {
      size: '1rem', // 16px
      weight: 400,
      lineHeight: 1.5,
    },
    sm: {
      size: '0.875rem', // 14px
      weight: 400,
      lineHeight: 1.5,
    },
  },
}

// Shadow System
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
}

// Border Radius
export const borderRadius = {
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
}

// Z-Index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
}

// Container
export const container = {
  maxWidth: '1240px',
  padding: '0 1rem',
}

// Grid
export const grid = {
  columns: 12,
  gap: '1.5rem',
}
