import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        fg: "#F4F4F5",
        muted: "#9CA3AF",
        "gold-1": "#D4AF37",
        "gold-2": "#F6E7B2"
      },
      boxShadow: {
        glow: "0 0 80px rgba(212,175,55,0.22)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
