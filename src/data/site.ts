// Everything you'd edit to personalize the site lives here.

export const site = {
  name: 'Kutlu Can Günay',
  role: 'Product Designer | Crafting User-Centric Solutions | Design Systems Advocate',
  // Optional link for the role line (e.g. your company). Set to undefined to render plain text.
  roleHref: undefined as string | undefined,
  // Link shown under the role. Opens in a new tab.
  portfolio: { label: 'Visit Portfolio', href: 'https://behance.net/kuthulhu' },
  description: 'Personal website and portfolio.',
};

// Tabs render in this order. To add one: add an entry here and create the
// matching page in src/pages (e.g. href '/explorations' → src/pages/explorations.astro).
export const tabs = [
  { label: 'Work', href: '/' },
  { label: 'About', href: '/about' },
];

export type WorkItem = {
  title: string;
  company?: string;
  // Leave out for full-time roles.
  type?: 'Contract' | 'Freelance' | 'Part-time' | 'Internship';
  // A single year ('2026') or a range ('2024–2026'). Keep the quotes:
  // without them, 2024-2026 is read as subtraction.
  year: string;
  href?: string;
};

export const work: WorkItem[] = [
  { title: 'Lead Product Designer', company: 'Climateware', year: '2024 - 2026' },
  { title: 'Lead UX/UI Designer', company: 'springfox', year: '2023 - 2024' },
  { title: 'UX/UI Designer', company: 'Semtrio', year: '2021 - 2023' },
  { title: 'UI Designer', company: 'Win2Win', year: '2019 - 2020', type: 'Contract' },
];
