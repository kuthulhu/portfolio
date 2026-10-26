// Software and hardware on the Tools tab.

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
