import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色 - 琥珀橙
        primary: {
          DEFAULT: '#E67E22',
          dark: '#D35400',
          light: '#F39C12',
        },
        // 辅助色 - 奶油米
        cream: {
          DEFAULT: '#FAF3E0',
          warm: '#F5E6D3',
          light: '#F9E7C4',
        },
        // 中性色 - 冷灰
        gray: {
          cold: '#F0F0F0',
          border: '#E0E0E0',
          text: '#666666',
        },
        // 功能色
        success: '#52C41A',
        error: '#FF4D4F',
        warning: '#F1C40F',
        info: '#3498DB',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)',
        'cream-gradient': 'linear-gradient(135deg, #FAF3E0 0%, #F5E6D3 100%)',
        'page-bg': 'linear-gradient(180deg, #FAF3E0 0%, #FFFFFF 100%)',
      },
      borderRadius: {
        'button': '24px',
        'card': '12px',
        'input': '8px',
      },
      spacing: {
        'page': '16px',
        'module': '24px',
        'card': '16px',
      },
    },
  },
  plugins: [],
}
export default config
