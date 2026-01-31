import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for production debugging
    sourcemap: false,
    // Minification options
    minify: 'esbuild',
    // Target modern browsers for optimal bundle size
    target: 'esnext',
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for Vue and core dependencies
          'vendor': ['vue'],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.')
          const ext = info?.[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext ?? '')) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|ttf|otf|eot/i.test(ext ?? '')) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
  },
  // Base public path
  base: './',
})
