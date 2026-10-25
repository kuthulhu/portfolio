// Everything you'd edit to personalize the site lives here.

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
  { id: 'work', label: 'Work' },
  { id: 'tools', label: 'Tools' },
  { id: 'about', label: 'About' },
];

export type WorkItem = {
  title: string;
  company?: string;
  // Leave out for full-time roles.
  type?: 'Contract' | 'Freelance' | 'Part-time';
  // A single year ('2026') or a range ('2024–2026'). Keep the quotes:
  // without them, 2024-2026 is read as subtraction.
  year: string;
  href?: string;
  // Preview shown on hover (larger screens only). Filename of an image in
  // src/assets/works, e.g. 'climateware.jpg'. Leave out to show a placeholder.
  image?: string;
  // Shown under the preview image.
  description?: string;
};

export const work: WorkItem[] = [
  {
    title: 'Lead Product Designer',
    company: 'Climateware',
    year: '2024 - 2026',
    image: 'climateware.png',
    description: 'Led and scaled the design team, and architected token-based design systems and AI-driven workflows across a multi-app enterprise B2B SaaS ecosystem.',
    href: 'https://www.behance.net/gallery/250318739/Climateware-Design-System',
  },
  {
    title: 'Lead UX/UI Designer',
    company: 'springfox',
    year: '2023 - 2024',
    image: 'springfox.png',
    description: 'Directed design operations and 0-to-1 launches for venture-backed brands, leading web and product teams to build component libraries, Web3 marketplaces, and mobile apps.',
    href: 'https://www.behance.net/gallery/162211801/springfox-ICS',
  },
  {
    title: 'UX/UI Designer',
    company: 'Semtrio',
    year: '2021 - 2023',
    image: 'semtrio.png',
    description: 'Designed responsive enterprise web platforms, built wireframes and high-fidelity prototypes, and established design system workflows that streamlined front-end handoffs.',
    href: 'https://www.behance.net/gallery/251072201/Semtrio-Brand-Refresh',
  },
  {
    title: 'UI Designer',
    company: 'Win2Win',
    year: '2019 - 2020',
    type: 'Contract',
    image: 'w2w.png',
    description: 'Executed a complete UI redesign of an AI-powered sports analytics mobile app, translating legacy client requirements into a modern, intuitive user experience.',
    href: 'https://www.behance.net/gallery/120484885/Win2Win-Mobile-App-Redesign',
  },
];

export type ToolItem = {
  name: string;
  // Filename (without .svg) of a logo in src/assets/tools. Colored logos come
  // from the "Logos" set on icones.js.org (download as SVG).
  logo: string;
  // Opens in a new tab.
  href?: string;
};

// Shown in the first column of the Tools page, in this order.
export const software: ToolItem[] = [
  { name: 'Figma', logo: 'figma' },
  { name: 'Illustrator', logo: 'illustrator' },
  { name: 'Photoshop', logo: 'photoshop' },
  { name: 'InDesign', logo: 'indesign' },
  { name: 'VS Code', logo: 'vscode' },
  { name: 'Claude', logo: 'claude' },
];

export type HardwareItem = {
  name: string;
  // Filename (without .svg) of an icon in src/assets/hardware. These are
  // outline icons from the Tabler set on icones.js.org and take on the text color.
  icon: string;
};

// Shown in the second column of the Tools page, in this order.
export const hardware: HardwareItem[] = [
  { name: 'MacBook Pro M5', icon: 'laptop' },
  { name: 'iPhone 17 Pro', icon: 'phone' },
  { name: 'Nothing Headphone (1)', icon: 'headphones' },
  { name: 'Soundcore Liberty 4 NC', icon: 'earbuds' },
  { name: 'Fujifilm X-T5', icon: 'camera' },
  { name: 'ViewSonic VP2756-4K', icon: 'monitor' },
  { name: 'Logitech MX Master 3S', icon: 'mouse' },
];
