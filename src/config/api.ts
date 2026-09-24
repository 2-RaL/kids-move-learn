/**
 * Dynamic API base URL configuration.
 *
 * - Web (dev):  empty string → Vite proxy handles /api → localhost:3001
 * - Web (prod): empty string → same-origin (Express serves both API + static)
 * - Capacitor (APK): full Render.com URL set via VITE_API_URL at build time
 * - Custom Override: can be configured directly in the app settings / login screen
 */

export function getApiBaseUrl(): string {
  try {
    if (typeof window !== 'undefined') {
      const custom = localStorage.getItem('custom_api_url');
      if (custom && custom.trim()) {
        return custom.trim().replace(/\/+$/, '');
      }
    }
  } catch (e) {
    // Ignore localStorage access errors
  }

  const defaultUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '');
  return defaultUrl || '';
}

export function setCustomApiUrl(url: string) {
  try {
    if (typeof window !== 'undefined') {
      if (!url || !url.trim()) {
        localStorage.removeItem('custom_api_url');
      } else {
        localStorage.setItem('custom_api_url', url.trim());
      }
    }
  } catch (e) {
    // Ignore localStorage access errors
  }
}

/**
 * Build a full API endpoint URL.
 * Usage:  apiUrl('/api/auth/login')  →  'https://render-host.com/api/auth/login'  (APK)
 *                                    →  '/api/auth/login'                          (web)
 */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
