# Kutlu Can Günay — Portfolio

Personal website of Kutlu Can Günay, product designer. A small, quiet site with my work history, the tools I use, some photos and a bit about me.

**Live:** [kutlucangunay.com](https://kutlucangunay.com) · **Portfolio:** [behance.net/kuthulhu](https://behance.net/kuthulhu)

## What's on it

Everything sits on one page, split into tabs:

- **Selected Work:** projects grouped by role, with a cover that shows on hover on larger screens. An interactive garden drawn out of 0s and 1s grows at the foot of this tab
- **Tools:** the software and hardware I work with
- **Camera Roll:** a photo grid you can filter by tag, with a lightbox you can swipe through on phones
- **About:** a short bio and a row of social links

A lamp switch in the corner picks light or dark mode. Until it's used, the site follows the system setting.

## Built with

- [Astro](https://astro.build) 7: a static site, no framework components
- [Tailwind CSS](https://tailwindcss.com) v4
- [Inter](https://rsms.me/inter/) for body text, [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) for headings, self-hosted through Astro's Fonts API
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) for the sitemap, which `robots.txt` points to
- GitHub Pages for hosting, deployed by GitHub Actions

## Running locally

Requires Node.js 22.23.4 or newer.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in ./dist
npm run preview  # preview the production build
```

## Editing content

Almost everything lives in [`src/data`](src/data). Each file has comments explaining its fields.

- **Name, role, description and link preview image:** the `site` object in [`site.ts`](src/data/site.ts). The preview image is a 1200×630 JPG in `public/`
- **Tabs:** the `tabs` list in [`site.ts`](src/data/site.ts). To add a tab, add an entry there, create its panel in `src/components/panels` and register it under the same id in [`src/pages/index.astro`](src/pages/index.astro)
- **Social links:** the `socials` list in [`site.ts`](src/data/site.ts). Icons go in `src/assets/social`
- **Selected work:** the `work` list in [`work.ts`](src/data/work.ts), grouped by role. Write years in quotes, e.g. `'2024–2026'`. Covers go in `src/assets/works`
- **Software and hardware:** the `software` and `hardware` lists in [`tools.ts`](src/data/tools.ts). Logos go in `src/assets/tools`, hardware icons in `src/assets/hardware`
- **Camera Roll:** the `gallery` list in [`gallery.ts`](src/data/gallery.ts). Put the original photo in `src/assets/gallery`; smaller versions are made at build. Photos are sorted newest first by `date`, and each `tag` gets a filter button

The About text is in [`src/components/panels/About.astro`](src/components/panels/About.astro).

## Deploying

Every push to `main` builds the site and deploys it to GitHub Pages ([`astro.yml`](.github/workflows/astro.yml)).

## Design tokens

Colors and the type scale are defined in [`src/styles/global.css`](src/styles/global.css) and available as Tailwind classes:

| Type | Classes |
| --- | --- |
| Headings (Inter Tight) | `text-h1`, `text-h2`, `text-h3`, `text-h4` |
| Body (Inter) | `text-body-lg`, `text-body-md`, `text-body-sm`, `text-body-xs` |
| Colors | `bg`, `fg`, `card`, `muted`, `line`, `accent`, e.g. `text-muted` or `bg-card` |

Each color has a light and a dark value.

## Project structure

```text
src/
├── assets/       images, icons and sounds, one folder per kind
├── components/   Header, Tabs, ThemeSwitch, Garden
│   └── panels/   one panel per tab
├── data/         all editable content
├── layouts/      page shell (head, fonts, theme)
├── pages/        the home page, 404 and robots.txt
├── scripts/      the garden's drawing and animation
└── styles/       global.css, colors and type scale
public/           favicons, link preview image
```
