module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeBounce: 'fadeBounce 6.5s ease-in-out infinite',
        spinSlow: 'spinSlow 40s linear infinite',
        rotatePulse: 'rotatePulse 6s linear infinite',
      },
      keyframes: {
        fadeBounce: {
          '0%, 100%': { opacity: 0, transform: 'translateY(0)' },
          '50%': { opacity: 1, transform: 'translateY(-10px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        rotatePulse: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
