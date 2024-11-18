/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "color-primary": "#01051e",
        "color-primary-light": "#020726",
        "color-new": "#1b203c",
        "color-primary-dark": "#010417",
        "color-secondary": "#ff7d3b",
        "color-gray": "#333",
        "color-white": "#fff",
        "color-blob": "#A427DF"
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '20px', 
          md: "50px"
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite', // Define marquee animation
        fadeIn: 'fadeIn 2s ease-in forwards',  // Example fade-in animation
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(80%)' },
          '100%': { transform: 'translateX(-80%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: [],
};
