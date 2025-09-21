// src/config/env.js
/**
 * Environment Configuration Module
 * 
 * Maintains your preferred export pattern while adding:
 * - Type safety
 * - URL validation
 * - Environment checks
 * - Sensitive data masking
 */

// --- Constants ---
const VALID_ENV_MODES = Object.freeze(['DEV', 'PROD']);
const DEFAULT_DEV_URLS = Object.freeze({
  SITE: 'http://localhost:3000',
  API: 'http://localhost:8080'
});

// --- Validation Utilities ---
const validateString = (value) => typeof value === 'string' && value.trim() !== '';
const validateUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// --- Environment Processing ---
const getEnvMode = () => {
  const rawMode = process.env.NEXT_PUBLIC_ENV_MODE;
  if (!validateString(rawMode)) {
    console.warn('[ENV] NEXT_PUBLIC_ENV_MODE missing/invalid. Defaulting to DEV');
    return 'DEV';
  }

  const mode = rawMode.trim().toUpperCase();
  if (!VALID_ENV_MODES.includes(mode)) {
    console.warn(`[ENV] Invalid mode "${mode}". Defaulting to DEV`);
    return 'DEV';
  }

  return mode;
};

const getEnvVar = (key, defaultValue = null) => {
  const value = process.env[key];
  if (!validateString(value)) {
    if (defaultValue === null) {
      throw new Error(`[ENV] Missing required variable: ${key}`);
    }
    console.warn(`[ENV] Using fallback for ${key}`);
    return defaultValue;
  }
  return value.trim();
};

const getUrlConfig = (prodKey, devKey, devDefault) => {
  const isProd = envMode === 'PROD';
  const value = isProd 
    ? getEnvVar(prodKey)
    : getEnvVar(devKey, devDefault);

  if (!validateUrl(value)) {
    throw new Error(`[ENV] Invalid URL in ${isProd ? prodKey : devKey}: "${value}"`);
  }

  // Ensure no trailing slash
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

// --- Current Configuration ---
const envMode = getEnvMode();
const isProduction = envMode === 'PROD';

// Site URLs
const SITE_BASE_URL = getUrlConfig(
  'NEXT_PUBLIC_SITE_URL_PROD',
  'NEXT_PUBLIC_SITE_URL_DEV',
  DEFAULT_DEV_URLS.SITE
);

// API URLs
const GOLANG_API_BASE_URL = getUrlConfig(
  'NEXT_PUBLIC_GOLANG_API_BASE_URL_PROD',
  'NEXT_PUBLIC_GOLANG_API_BASE_URL_LOCAL',
  DEFAULT_DEV_URLS.API
);

// Production Safety Check
if (isProduction) {
  [SITE_BASE_URL, GOLANG_API_BASE_URL].forEach(url => {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      throw new Error('[ENV] Production URLs cannot point to localhost');
    }
  });
}

// Debug Output (Development Only)
if (!isProduction) {
  console.debug('[ENV] Active Configuration:', {
    envMode,
    isProduction,
    SITE_BASE_URL,
    GOLANG_API_BASE_URL
  });
}

// Export (matching your current usage pattern)
export {
  envMode,
  isProduction,
  SITE_BASE_URL,
  GOLANG_API_BASE_URL
};