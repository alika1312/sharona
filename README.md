# sharona-bar-nes.com

The website of Sharona Kadoshai Bar-Nes (emotional therapy, couples counselling,
parent guidance). Hebrew, right-to-left, statically prerendered.

## Stack

- React 18 + React Router 6 (data routes in `src/routes.jsx`)
- [vite-react-ssg](https://github.com/Daydreamer-riri/vite-react-ssg) — every route is
  prerendered to `dist/<route>/index.html` at build time and hydrated in the browser
- Styling: `src/design/organic.css` (design tokens + page styles), inline styles in the
  components, Tailwind only for its base reset
- Homepage scroll choreography: `src/design/motion.js` (progressive enhancement — the
  page is complete without it)
- Contact form: EmailJS. Analytics: gtag, configured through `.env` (see `.env.example`)

## Commands

```sh
npm run dev      # dev server
npm run build    # generate sitemap/robots/llms.txt, then prerender into dist/
npm run qa       # checks over the built dist/: meta tags, links, images, JSON-LD, a11y structure
npm test         # build + qa
npm run lint
```

## Where things live

| What | Where |
| --- | --- |
| Phone, e-mail, WhatsApp, site URL | `src/information/contact.js` |
| Articles, workshops, areas of work, testimonials, FAQ | `src/information/*.js` |
| Pages | `src/Pages/` |
| Site-wide head tags, JSON-LD | `src/components/Layout.jsx`, `src/components/StructuredData.jsx` |
| Images | `public/` (WebP for photos; keep them ~2× their on-page size) |

## Deploying

Upload the contents of `dist/` to the Apache host. `public/.htaccess` serves the
prerendered `/404/` page for unknown URLs.
