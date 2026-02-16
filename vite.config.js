import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  base: "/vnmwebsites/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap', '@gsap/react', 'gsap/ScrollTrigger'],
          'particles-vendor': ['@tsparticles/react', '@tsparticles/slim']
        }
      }
    }
  }
});
