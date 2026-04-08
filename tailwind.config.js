/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色系 - 温暖橙
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFEDD5',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA87',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // 辅助色系 - 米黄/暖灰
        beige: {
          50: '#FDFBF7',
          100: '#F9F5F0',
          200: '#F3EBE0',
          300: '#E8D5C0',
          400: '#D4B996',
          500: '#C4A47C',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // 强调色
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 4px rgba(249, 115, 22, 0.2)',
      }
    },
  },
  plugins: [],
}
