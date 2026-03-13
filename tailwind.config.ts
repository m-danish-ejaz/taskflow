import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        "neon-red": "0 0 30px theme('colors.red.700')",
        "neon-green": "0 0 30px theme('colors.green.500')",
        "neon-purple": "0 0 30px theme('colors.purple.700')",
        "neon-blue": "0 0 30px theme('colors.blue.700')",
        "neon-pink": "0 0 30px theme('colors.pink.400')",
        "neon-orange": "0 0 30px theme('colors.orange.700')",
      },
      fontFamily: {
        poppins: "var(--font-poppins)",
        geist: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"), // 👈 yeh add karo
  ],
} satisfies Config;
