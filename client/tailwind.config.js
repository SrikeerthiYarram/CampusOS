/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          bg: "#070913",
          card: "rgba(15, 23, 42, 0.65)",
          cardHover: "rgba(23, 37, 84, 0.75)",
          border: "rgba(56, 189, 248, 0.15)",
          borderGlow: "rgba(99, 102, 241, 0.4)",
          accent: "#38bdf8", // Sky / Cyan
          purple: "#818cf8", // Indigo / Purple
          violet: "#a855f7", // Violet
          neon: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444"
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(129, 140, 248, 0.15) 50%, rgba(168, 85, 247, 0.15) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glow-radial': 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
        'purple-radial': 'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.18) 0%, transparent 60%)',
        'blue-radial': 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.18) 0%, transparent 60%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px -5px rgba(56, 189, 248, 0.3), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'purple-glow': '0 0 30px -5px rgba(168, 85, 247, 0.35)',
        'cyber-button': '0 0 20px rgba(56, 189, 248, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
