import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kidsmovelearn.app',
  appName: 'Kids Move & Learn',
  webDir: 'dist',
  // Server configuration for the Capacitor webview
  server: {
    // Allow mixed content (http in https context) for development
    androidScheme: 'https',
    // Allow navigation to the Render.com API
    allowNavigation: ['kids-move-learn.onrender.com'],
  },
  android: {
    // Allow cleartext traffic for development (remove in production)
    allowMixedContent: true,
  },
  plugins: {
    // Status bar styling
    StatusBar: {
      backgroundColor: '#4F46E5',
      style: 'DARK',
    },
  },
};

export default config;
