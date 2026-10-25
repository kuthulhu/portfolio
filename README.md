# Kutlu Can Günay — Portfolio

Personal website of Kutlu Can Günay, product designer. A small, quiet site with my work history and a bit about me.

**Live:** [kutlucangunay.com](https://kutlucangunay.com) · **Portfolio:** [behance.net/kuthulhu](https://behance.net/kuthulhu)

## Built with

- [Astro](https://astro.build): static pages, with view transitions between tabs
- [Tailwind CSS](https://tailwindcss.com) v4
- [Inter](https://rsms.me/inter/) for body text, [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) for headings, self-hosted through Astro's Fonts API
- Light and dark mode that follow the system setting

## Running locally

Requires Node.js 22.23.4 or newer.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in ./dist
npm run preview  # preview the production build
```

## Editing content

Almost everything lives in [`src/data/site.ts`](src/data/site.ts):

- **Name, role and portfolio link:** the `site` object
- **Work history:** the `work` list. Write years in quotes, e.g. `'2024 – 2026'`
- **Tabs:** the `tabs` list. To add a tab, add an entry there and create a matching page in `src/pages/` (e.g. `/explorations` → `src/pages/explorations.astro`)

The About text is in [`src/pages/about.astro`](src/pages/about.astro).

## Design tokens

Colors and the type scale are defined in [`src/styles/global.css`](src/styles/global.css) and available as Tailwind classes:

| Type | Classes |
| --- | --- |
| Headings (Inter Tight) | `text-h1`, `text-h2`, `text-h3`, `text-h4` |
| Body (Inter) | `text-body-lg`, `text-body-md`, `text-body-sm` |
| Colors | `text-fg`, `text-muted`, `text-accent`, `bg-line` |

## Project structure

```text
src/
├── assets/       avatar and background image
├── components/   Header, Tabs
├── data/         site.ts, all editable content
├── layouts/      page shell (head, fonts, header, tabs)
├── pages/        one file per tab
└── styles/       global.css, colors and type scale
```
