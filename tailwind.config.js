/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        baloo: ['"Baloo 2"', 'sans-serif'],
      },
      colors: {
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        brand: {
          purple: '#7c3aed',
          'purple-light': '#a78bfa',
          'purple-pale': '#ede9fe',
          blue: '#3b82f6',
          'blue-light': '#93c5fd',
          yellow: '#f59e0b',
          'yellow-light': '#fde68a',
          green: '#10b981',
          'green-light': '#6ee7b7',
          coral: '#f43f5e',
          'coral-light': '#fda4af',
          mint: '#06b6d4',
          'mint-light': '#a5f3fc',
          orange: '#f97316',
          'orange-light': '#fed7aa',
        },
      },
      backgroundImage: {
        'sky-gradient': 'linear-gradient(180deg, #87ceeb 0%, #b0e2ff 40%, #e8f8ff 100%)',
        'header-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
        'btn-green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'btn-blue': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'btn-purple': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'btn-orange': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'btn-coral': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
        'btn-yellow': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'btn-cyan': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'btn-pink': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'btn': '0 4px 14px rgba(0,0,0,0.15)',
        'btn-hover': '0 8px 20px rgba(0,0,0,0.2)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
        'inner-white': 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'star-burst': 'starBurst 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'check-pop': 'checkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spin-slow': 'spin 3s linear infinite',
        'cloud-drift': 'cloudDrift 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(-20deg)', opacity: '0' },
          '60%': { transform: 'scale(1.2) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        checkPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
