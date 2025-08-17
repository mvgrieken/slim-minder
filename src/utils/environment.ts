// Environment detection utilities
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// App environment (from REACT_APP_ENVIRONMENT)
export const appEnvironment = process.env.REACT_APP_ENVIRONMENT || 'development';
export const isProductionApp = appEnvironment === 'production';

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: isProduction ? 10000 : 5000, // 10s in prod, 5s in dev
  retries: isProduction ? 3 : 1,
  enableLogs: isDevelopment,
  enableMockData: isDevelopment && !process.env.REACT_APP_SUPABASE_URL,
};

// Feature flags
export const FEATURES = {
  // Development-only features
  debugPanel: isDevelopment,
  databaseTest: isDevelopment,
  mockData: isDevelopment && !process.env.REACT_APP_SUPABASE_URL,
  
  // Production features
  realTimeData: isProductionApp,
  analytics: isProductionApp,
  errorReporting: isProductionApp,
  performanceMonitoring: isProductionApp,
  
  // Always enabled
  notifications: true,
  darkMode: true,
  accessibility: true,
};

// Logging utilities
export const logger = {
  debug: (...args: any[]) => {
    if (API_CONFIG.enableLogs) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (API_CONFIG.enableLogs || isProduction) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    
    // In production, you might want to send to error reporting service
    if (FEATURES.errorReporting) {
      // TODO: Send to Sentry, LogRocket, etc.
    }
  },
};

// Performance monitoring
export const performance = {
  mark: (name: string) => {
    if (FEATURES.performanceMonitoring && 'performance' in window) {
      window.performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark?: string) => {
    if (FEATURES.performanceMonitoring && 'performance' in window) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
        
        const measure = window.performance.getEntriesByName(name)[0];
        logger.info(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        logger.warn('Performance measurement failed:', error);
      }
    }
  },
};

// Environment info for debugging
export const getEnvironmentInfo = () => ({
  nodeEnv: process.env.NODE_ENV,
  appEnv: appEnvironment,
  isDev: isDevelopment,
  isProd: isProduction,
  isProdApp: isProductionApp,
  features: FEATURES,
  apiConfig: {
    ...API_CONFIG,
    // Don't expose sensitive URLs in logs
    baseUrl: API_CONFIG.baseUrl.includes('localhost') ? API_CONFIG.baseUrl : '[HIDDEN]',
  },
  buildInfo: {
    timestamp: process.env.REACT_APP_BUILD_TIME || 'unknown',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    commit: process.env.REACT_APP_GIT_COMMIT || 'unknown',
  },
});