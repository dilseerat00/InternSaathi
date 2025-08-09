/** @type {import('tailwindcss').Config} */
export default {
  // CRITICAL: This 'content' array must correctly point to all your JSX/TSX files
  // where you use Tailwind classes.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is essential
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3) translateY(-50px)' },
          '50%': { opacity: '1', transform: 'scale(1.05) translateY(10px)' },
          '70%': { transform: 'scale(0.95) translateY(-5px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'bounce-in': 'bounceIn 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
