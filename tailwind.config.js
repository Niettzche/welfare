/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        welfare: {
          blue: '#0047AB', // Brand Royal Blue
          hover: '#003580',
          light: '#E6F0FF',
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'elegant-float': 'elegantFloat 4s ease-in-out infinite',
        'reveal-up': 'revealUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'scale-fade-out': 'scaleFadeOut 0.8s cubic-bezier(0.5, 0, 0, 1) forwards',
        'spin-slow-reverse': 'spin 12s linear infinite reverse',
        'spin-slower': 'spin 15s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        elegantFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleFadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
