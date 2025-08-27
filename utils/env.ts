/**
 * Safe environment utilities for Vite
 * Provides fallbacks for when import.meta.env properties might not be available
 */

// Safe development mode detection with multiple fallbacks
export const isDev = (() => {
  try {
    // Primary check: Vite's DEV flag
    if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.DEV === 'boolean') {
      return import.meta.env.DEV;
    }
    
    // Fallback 1: Check MODE
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) {
      return import.meta.env.MODE === 'development';
    }
    
    // Fallback 2: Check if we're not in production
    if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.PROD === 'boolean') {
      return !import.meta.env.PROD;
    }
    
    // Fallback 3: Check hostname (development usually runs on localhost)
    if (typeof window !== 'undefined' && window.location) {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('localhost');
    }
    
    // Final fallback: assume production for safety
    return false;
  } catch (error) {
    console.warn('Error detecting development mode:', error);
    return false;
  }
})();

// Safe environment variable getter with fallbacks
export const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    return fallback;
  } catch (error) {
    console.warn(`Error accessing environment variable ${key}:`, error);
    return fallback;
  }
};

// Environment info for debugging
export const envInfo = (() => {
  try {
    return {
      isDev,
      mode: getEnvVar('MODE', 'unknown'),
      prod: getEnvVar('PROD', 'unknown'),
      dev: getEnvVar('DEV', 'unknown'),
      hasImportMeta: typeof import.meta !== 'undefined',
      hasEnv: typeof import.meta !== 'undefined' && !!import.meta.env,
    };
  } catch (error) {
    return {
      isDev: false,
      mode: 'error',
      prod: 'unknown',
      dev: 'unknown',
      hasImportMeta: false,
      hasEnv: false,
      error: error.message,
    };
  }
})();

// Log environment info in development
if (isDev) {
  console.log('📊 Environment Info:', envInfo);
}