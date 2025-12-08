// Runtime configuration helper
// In production, values come from window.__RUNTIME_CONFIG__ (injected at container startup)
// In development, values come from import.meta.env (Vite)

interface RuntimeConfig {
  VITE_ASGARDEO_CLIENT_ID: string;
  VITE_ASGARDEO_BASE_URL: string;
  VITE_REDIRECT_URL: string;
  VITE_API_BASE_URL: string;
  VITE_USER_SERVICE_URL: string;
  VITE_TASK_SERVICE_URL: string;
  VITE_PROJECT_SERVICE_URL: string;
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

/**
 * Get configuration value with fallback chain:
 * 1. Runtime config (production - injected by container)
 * 2. Vite env (development)
 * 3. Default value
 */
export function getConfig(key: keyof RuntimeConfig, defaultValue: string = ''): string {
  // Check runtime config first (production)
  const runtimeValue = window.__RUNTIME_CONFIG__?.[key];
  if (runtimeValue && !runtimeValue.startsWith('__')) {
    return runtimeValue;
  }
  
  // Fall back to Vite env (development)
  const envValue = import.meta.env[key];
  if (envValue) {
    return envValue;
  }
  
  // Use default
  return defaultValue;
}

// Export individual config getters for convenience
export const config = {
  get asgardeoClientId() {
    return getConfig('VITE_ASGARDEO_CLIENT_ID', 'OfCxVt2EjHcXMsIgfeXgH9ZCbzIa');
  },
  get asgardeoBaseUrl() {
    return getConfig('VITE_ASGARDEO_BASE_URL', 'https://api.asgardeo.io/t/assignmnent');
  },
  get redirectUrl() {
    return getConfig('VITE_REDIRECT_URL', window.location.origin);
  },
  get apiBaseUrl() {
    return getConfig('VITE_API_BASE_URL', 'http://localhost:3002');
  },
  get userServiceUrl() {
    return getConfig('VITE_USER_SERVICE_URL', 'http://localhost:3002/api/v1');
  },
  get taskServiceUrl() {
    return getConfig('VITE_TASK_SERVICE_URL', 'http://localhost:3000/api/v1');
  },
  get projectServiceUrl() {
    return getConfig('VITE_PROJECT_SERVICE_URL', 'http://localhost:3001/api/v1');
  },
};

