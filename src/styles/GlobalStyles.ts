import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.base};
    font-weight: ${theme.fontWeights.normal};
    line-height: ${theme.lineHeights.normal};
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.gradientSecondary};
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 ${theme.spacing.md} 0;
    font-family: ${theme.fonts.secondary};
    font-weight: ${theme.fontWeights.bold};
    line-height: ${theme.lineHeights.tight};
    color: ${theme.colors.textPrimary};
  }

  h1 {
    font-size: ${theme.fontSizes['4xl']};
    font-weight: ${theme.fontWeights.extrabold};
    background: ${theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.primary};
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
    font-weight: ${theme.fontWeights.semibold};
    color: ${theme.colors.textPrimary};
  }

  h4 {
    font-size: ${theme.fontSizes.xl};
    font-weight: ${theme.fontWeights.semibold};
    color: ${theme.colors.textSecondary};
  }

  h5 {
    font-size: ${theme.fontSizes.lg};
    font-weight: ${theme.fontWeights.medium};
    color: ${theme.colors.textSecondary};
  }

  h6 {
    font-size: ${theme.fontSizes.base};
    font-weight: ${theme.fontWeights.medium};
    color: ${theme.colors.textTertiary};
  }

  p {
    margin: 0 0 ${theme.spacing.md} 0;
    line-height: ${theme.lineHeights.relaxed};
    color: ${theme.colors.textSecondary};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: all ${theme.transitions.fast};
    position: relative;
    
    &:hover {
      color: ${theme.colors.primaryHover};
      transform: translateY(-1px);
    }
    
    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
  }

  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: none;
    background: none;
    cursor: pointer;
    transition: all ${theme.transitions.fast};
    border-radius: ${theme.borderRadius.md};
    
    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: ${theme.shadows.md};
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: 2px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    background-color: ${theme.colors.surface};
    transition: all ${theme.transitions.fast};
    box-shadow: ${theme.shadows.sm};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}20, ${theme.shadows.md};
      transform: translateY(-1px);
    }
    
    &::placeholder {
      color: ${theme.colors.textTertiary};
    }
    
    &:hover {
      border-color: ${theme.colors.borderDark};
      box-shadow: ${theme.shadows.base};
    }
  }

  ul, ol {
    margin: 0 0 ${theme.spacing.md} 0;
    padding-left: ${theme.spacing.xl};
  }

  li {
    margin-bottom: ${theme.spacing.xs};
    line-height: ${theme.lineHeights.relaxed};
    color: ${theme.colors.textSecondary};
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${theme.borderRadius.md};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.secondaryLight};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gradientPrimary};
    border-radius: ${theme.borderRadius.full};
    transition: all ${theme.transitions.fast};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primaryHover};
    transform: scale(1.1);
  }

  /* Selection styles */
  ::selection {
    background: ${theme.colors.gradientPrimary};
    color: ${theme.colors.white};
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Enhanced animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -8px, 0);
    }
    70% {
      transform: translate3d(0, -4px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .slide-in {
    animation: slideIn 0.4s ease-out;
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  .shimmer {
    background: linear-gradient(90deg, transparent, ${theme.colors.primary}20, transparent);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }

  .bounce {
    animation: bounce 1s ease-in-out;
  }

  /* Glass morphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: ${theme.shadows.lg};
  }

  /* Card styles */
  .card {
    background: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.xl};
    box-shadow: ${theme.shadows.lg};
    padding: ${theme.spacing.xl};
    transition: all ${theme.transitions.base};
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows['2xl']};
    }
  }

  /* Button variants */
  .btn-primary {
    background: ${theme.colors.gradientPrimary};
    color: ${theme.colors.white};
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    font-weight: ${theme.fontWeights.semibold};
    box-shadow: ${theme.shadows.md};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  }

  .btn-secondary {
    background: ${theme.colors.gradientSecondary};
    color: ${theme.colors.white};
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    font-weight: ${theme.fontWeights.semibold};
    box-shadow: ${theme.shadows.md};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  }

  /* Responsive utilities */
  @media (max-width: ${theme.breakpoints.sm}) {
    html {
      font-size: 14px;
    }
    
    h1 {
      font-size: ${theme.fontSizes['3xl']};
    }
    
    h2 {
      font-size: ${theme.fontSizes['2xl']};
    }
    
    h3 {
      font-size: ${theme.fontSizes.xl};
    }
    
    .card {
      padding: ${theme.spacing.lg};
    }
  }
`; 