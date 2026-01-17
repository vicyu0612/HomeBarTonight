/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-amber-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-zinc-400",
    "bg-blue-400",
    "bg-pink-400",
    "bg-green-500",
    "border-amber-500",
    "border-orange-500",
    "border-red-500",
    "border-zinc-400",
    "border-blue-400",
    "border-pink-400",
    "border-green-500"
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Zinc 950
        surface: "#18181b", // Zinc 900
        primary: "#8b5cf6", // Violet 500
        secondary: "#ec4899", // Pink 500
        accent: "#22d3ee", // Cyan 400
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
