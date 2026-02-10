// API Configuration
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Local development
      return 'http://localhost:5001';
    } else {
      // Production - use the same domain or a configured backend URL
      // You can either use a relative path or set a production backend URL
      // For deployment, you'll need to set the actual backend URL here
      // Or use environment variables if supported by your hosting platform
      const backendUrl = process.env.REACT_APP_API_URL || (window as any).ENV?.REACT_APP_API_URL;
      return backendUrl || `${window.location.protocol}//${window.location.host}`;
    }
  }
  // Server-side rendering fallback
  return 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();

// Alternative: Allow configuring the API URL via environment variable or window object
export const getConfiguredApiUrl = (endpoint: string): string => {
  // Check if there's a configured API URL in window (can be set by hosting platform)
  const configuredApiUrl = typeof window !== 'undefined' 
    ? (window as any).__CONFIGURED_API_URL__ 
    : undefined;

  if (configuredApiUrl) {
    return `${configuredApiUrl}${endpoint}`;
  }

  // Otherwise use the base URL we determined
  const baseUrl = getApiBaseUrl(); // Use function directly to ensure fresh value
  return `${baseUrl}/api${endpoint}`;
};