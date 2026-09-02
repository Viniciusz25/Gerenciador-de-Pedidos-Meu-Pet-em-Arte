import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/superfrete-api': {
        target: 'https://api.superfrete.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/superfrete-api/, ''),
        secure: true,
      },
      '/superfrete-sandbox': {
        target: 'https://sandbox.superfrete.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/superfrete-sandbox/, ''),
        secure: true,
      }
    }
  }
});
