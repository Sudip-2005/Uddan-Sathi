/**
 * API Configuration for UdaanSathi
 * 
 * This module provides a centralized configuration for all API calls.
 * It uses Vite's environment variable system which requires:
 * - All env vars to be prefixed with VITE_
 * - Variables set in .env.local for development
 * - Variables set in Vercel dashboard for production
 * 
 * The base URL MUST be set via VITE_BACKEND_URL environment variable.
 * There is NO fallback to localhost to prevent production errors.
 */

// Get the backend URL from Vite environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Validate that the environment variable is set
if (!backendUrl) {
  throw new Error(
    '❌ VITE_BACKEND_URL is not defined!\n' +
    'Please set it in:\n' +
    '  - .env.local for local development\n' +
    '  - Vercel dashboard for production deployment'
  );
}

// Remove trailing slash if present for consistency
export const API_BASE_URL = backendUrl.replace(/\/$/, '');

/**
 * Helper function to construct API endpoints
 * @param path - The API endpoint path (e.g., '/flights', '/bookings/ABC123')
 * @returns Complete API URL
 */
export const getApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Common fetch wrapper with error handling
 * @param path - The API endpoint path
 * @param options - Fetch options
 * @returns Promise with parsed JSON response
 */
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const url = getApiUrl(path);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export default API_BASE_URL;
