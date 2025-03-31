import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pistaink/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  server: {
    port: 3000,
    open: true,
  },
}); 