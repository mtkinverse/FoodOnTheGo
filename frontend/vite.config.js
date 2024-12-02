export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://foodgo-backend-94833a018ab4.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
