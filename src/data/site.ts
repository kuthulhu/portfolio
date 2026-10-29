// Everything you'd edit to personalize the site lives in src/data: this file
// for the basics and tabs, work.ts for projects and tools.ts for the Tools tab.

export const site = {
  name: 'Kutlu Can Günay',
  role: 'Product Designer | Crafting User-Centric Solutions | Design Systems Advocate',
  // Optional link for the role line (e.g. your company). Set to undefined to render plain text.
  roleHref: undefined as string | undefined,
  // Link shown under the role. Opens in a new tab.
  portfolio: { label: 'View All Works on Behance', href: 'https://behance.net/kuthulhu' },
  // Shown in search results and link previews (aim for under ~155 characters).
  description:
    'Kutlu Can Günay is a product designer focused on design systems and turning complex products into clear, intuitive interfaces.',
  // Link preview image: a 1200×630 file in /public. Keep it small (JPG, < 300 KB)
  // so WhatsApp and others don't skip it. The domain is added at build time.
  ogImage: '/og.jpg' as string | undefined,
};

// Tabs render in this order, all on the home page; the first one opens by
// default. To add one: add an entry here, create its panel in
// src/components/panels and register it under the same id in src/pages/index.astro.
export const tabs = [
  { id: 'work', label: 'Selected Work' },
  { id: 'tools', label: 'Tools' },
  { id: 'about', label: 'About' },
];

// Icon row at the bottom of the About tab, in this order. `icon` is the file
// name in src/assets/social.
export const socials = [
  { label: 'Behance', icon: 'behance', href: 'https://www.behance.net/kuthulhu' },
  { label: 'GitHub', icon: 'github', href: 'https://github.com/kuthulhu' },
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/kuthulhu' },
  { label: 'Twitter', icon: 'twitter', href: 'https://twitter.com/kuthulhu' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/kuthulhu' },
  { label: 'Threads', icon: 'threads', href: 'https://www.threads.net/@kuthulhu' },
  { label: 'Steam', icon: 'steam', href: 'https://steamcommunity.com/id/kuthulhu' },
];
