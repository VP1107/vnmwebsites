import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react(),
        visualizer({ open: false })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // ✅ GSAP - catches core + all plugins
                    if (id.includes('node_modules/gsap')) {
                        return 'gsap-vendor';
                    }

                    // ✅ Lenis smooth scroll
                    if (id.includes('node_modules/lenis')) {
                        return 'scroll-vendor';
                    }

                    // ✅ SplitType text library
                    if (id.includes('node_modules/split-type')) {
                        return 'text-utils';
                    }

                    // ✅ FIX: Be MORE specific with React
                    // Only match exact react packages, not anything else
                    if (id.includes('node_modules/react-dom/')) {
                        return 'react-vendor';
                    }
                    if (
                        id.includes('node_modules/react/') &&
                        !id.includes('node_modules/react-dom/')
                    ) {
                        return 'react-vendor';
                    }
                    if (id.includes('node_modules/scheduler/')) {
                        return 'react-vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 200,
        minify: 'esbuild',
        target: 'esnext',
        cssCodeSplit: true,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'gsap', 'lenis']
    }
});
