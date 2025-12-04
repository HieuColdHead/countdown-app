import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  // Quan trọng: set base path cho asset
  build: {
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    open: true
  }
})