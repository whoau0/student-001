import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        room: {
          bg: "#FDFBF7",         // 웜 화이트 (벽지/배경)
          beige: "#F3EFEA",      // 크림 베이지 (카드/선반)
          wood: {
            light: "#EADBCE",
            DEFAULT: "#D7C4B7",  // 소프트 우드 (테이블/오브젝트)
            medium: "#BFA594",
            dark: "#8C6D58",
            deep: "#5C4033",
          },
          accent: {
            warm: "#E07A5F",     // 코지 코랄/오렌지 포인트
            olive: "#819870",    // 올리브 그린 (화분/힐링)
            yellow: "#F2CC8F",   // 스탠드 조명 옐로우
            navy: "#3D5A80",     // 볼펜/스마트 기기 네이비
          },
          paper: "#FFFFFF",
          text: {
            main: "#3D3A37",     // 잉크 브라운/다크 차콜
            muted: "#7D756D",
            light: "#A8A096",
          }
        },
      },
      boxShadow: {
        'desk': '0 8px 30px rgba(92, 64, 51, 0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'wood-shelf': '0 4px 20px rgba(140, 109, 88, 0.12)',
        'paper-pin': '0 2px 10px rgba(0, 0, 0, 0.07)',
        'monitor': '0 12px 36px rgba(40, 44, 52, 0.15)',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'cozy': '1rem',
        'wood': '1.25rem',
      }
    },
  },
  plugins: [],
};
export default config;
