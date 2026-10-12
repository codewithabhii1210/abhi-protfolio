import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-only: forward API calls to the Express server.
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy 3D vendor code in its own chunk so the initial
        // paint doesn't wait on Three.js.
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap'],
          'three-vendor': ['three', '@react-three/fiber'],
        },
      },
    },
  },
});
