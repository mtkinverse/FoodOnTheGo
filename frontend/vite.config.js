import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://foodgo-backend-94833a018ab4.herokuapp.com',
        rewrite: (path) => path.replace(/^\/api/, ''), // Keeps this to forward requests to backend
      },
    },
  },
});
