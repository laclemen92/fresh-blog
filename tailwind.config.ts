import { type Config } from "tailwindcss";
import tailwindForms from "@tailwindcss/forms";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    tailwindForms,
  ],
} satisfies Config;
