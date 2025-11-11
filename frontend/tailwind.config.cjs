/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(180, 75%, 97%)",
          100: "hsl(180, 75%, 90%)",
          200: "hsl(180, 75%, 80%)",
          300: "hsl(180, 75%, 65%)",
          400: "hsl(180, 75%, 52%)",
          500: "hsl(180, 75%, 42%)",
          600: "hsl(180, 75%, 35%)",
          700: "hsl(180, 75%, 28%)",
          800: "hsl(180, 75%, 22%)",
          900: "hsl(180, 75%, 15%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "hsl(35, 95%, 97%)",
          100: "hsl(35, 95%, 90%)",
          200: "hsl(35, 95%, 80%)",
          300: "hsl(35, 95%, 70%)",
          400: "hsl(35, 95%, 62%)",
          500: "hsl(35, 95%, 55%)",
          600: "hsl(35, 95%, 48%)",
          700: "hsl(35, 95%, 40%)",
          800: "hsl(35, 95%, 32%)",
          900: "hsl(35, 95%, 25%)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        strong: "var(--shadow-strong)",
      },
    },
  },
  plugins: [],
};
