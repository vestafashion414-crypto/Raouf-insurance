/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FBF6E9",
          100: "#F7ECCF",
          200: "#EFD89F",
          300: "#E7C46F",
          400: "#DDB047",
          500: "#C79A2E",
          600: "#A87E22",
          700: "#7A5B19",
          800: "#5C4516",
          900: "#3D2E10",
        },
        ink: {
          950: "#0A0A0B",
          900: "#0F0F12",
          850: "#151519",
          800: "#1C1C21",
          700: "#26262D",
          600: "#33333C",
          500: "#44444F",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Cairo", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 30px -5px rgba(199, 154, 46, 0.35)",
        "gold-lg": "0 0 50px -8px rgba(199, 154, 46, 0.45)",
        "inner-gold": "inset 0 0 30px -10px rgba(199, 154, 46, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(199, 154, 46, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(199, 154, 46, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in": "fade-in 0.7s ease-out both",
        "scale-in": "scale-in 0.5s ease-out both",
        shimmer: "shimmer 3s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
