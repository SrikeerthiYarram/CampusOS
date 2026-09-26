import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          threeVendor: ['three', '@react-three/fiber', '@react-three/drei'],
          reactVendor: ['react', 'react-dom', 'react-router-dom'],
          uiVendor: ['lucide-react', 'clsx', 'tailwind-merge', 'canvas-confetti'],
        },
      },
    },
  },
});