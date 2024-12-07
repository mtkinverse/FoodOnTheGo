module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeBounce: 'fadeBounce 3.5s ease-in-out infinite',
        spinSlow: 'spin-slow 20s linear infinite',
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
      },
    },
  },
  plugins: [],
}