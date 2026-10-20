/** @type {import('tailwindcss').Config} */
// Tailwind is only here for its base reset and a few layout utilities; the
// site's colours, type and spacing live in src/design/organic.css.
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
