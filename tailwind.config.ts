import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pandi: {
          50: "#f2fbf4",
          100: "#e8f7ed",
          500: "#35a56f",
          700: "#176b4c",
          900: "#104a3a"
        }
      },
      fontFamily: {
        display: ["Baloo 2", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
