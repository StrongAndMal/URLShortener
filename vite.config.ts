import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/URLShortener/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://urlshortener-production-40c8.up.railway.app',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}) 