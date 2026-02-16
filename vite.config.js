import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  base: '/vnmwebsites/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'gsap': ['gsap', 'split-type'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 100 // Warn if chunk exceeds 100KB
  }
});
