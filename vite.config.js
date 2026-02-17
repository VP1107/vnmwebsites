// vite.config.js (FIXED)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react(),
        visualizer({ open: false }) // ✅ Don't auto-open on every build
    ],
    base: '/vnmwebsites/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // ✅ React core - loads first
                    'react-vendor': ['react', 'react-dom'],

                    // ✅ GSAP alone - loaded when hero needs it
                    'gsap-core': ['gsap'],

                    // ✅ Split-type separately - only used in HeroContent
                    'text-utils': ['split-type'],
                }
            }
        },
        // ✅ Increase warning limit to reduce noise
        chunkSizeWarningLimit: 150,

        // ✅ Minification settings
        minify: 'esbuild',
        target: 'esnext',

        // ✅ Enable CSS code splitting
        cssCodeSplit: true,
    },
    // ✅ Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'gsap']
    }
});