import preact from "@preact/preset-vite"
import tailwindcss from "tailwindcss"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
