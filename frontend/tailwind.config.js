/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors : {
        primary: {
          blue: '#0095f6',
        },
        primaryhover: {
          blue: '#00AAf6',
        },
        primaryLoading: {
          blue: '#9fc2f8',
        },
        error : {
          red : '#EF4056'
        },
        admin : {
          navy : "#24303F",
          black : "#1A222C",
          low : "#dee4ee",
          High: "#8a99af",
          plus: "#10B981",
          minus: "#259AE6",
        }
      }
    },
  },
  darkMode : "class",
  plugins: [],
}

