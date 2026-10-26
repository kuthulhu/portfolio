// Projects on the Selected Work tab, grouped by role.

export type WorkProject = {
  title: string;
  // A single year ('2026') or a range ('2024–2026'). Keep the quotes:
  // without them, 2024-2026 is read as subtraction.
  year: string;
  // The project's Behance page. Opens in a new tab.
  href?: string;
  // Cover shown on hover (larger screens only). Filename of an image in
  // src/assets/works, e.g. 'climateware.jpg'. Leave out to show a placeholder.
  image?: string;
};

export type WorkRole = {
  title: string;
  company?: string;
  // Leave out for full-time roles.
  type?: 'Contract' | 'Freelance' | 'Part-time';
  // Listed under the role, in this order.
  projects: WorkProject[];
};

export const work: WorkRole[] = [
  {
    title: 'Lead Product Designer',
    company: 'Climateware',
    projects: [
      {
        title: 'Climateware Brand Refresh',
        year: '2026',
        image: 'climateware2.png',
        href: 'https://www.behance.net/gallery/250318735/Climateware-Brand-Refresh',
      },
      {
        title: 'Carbondeck, Web Design',
        year: '2024 - 2026',
        image: 'carbondeck.png',
        href: 'https://www.behance.net/gallery/250319813/Carbondeck-Web-Design',
      },
      {
        title: 'Climateware Design System',
        year: '2023 - 2026',
        image: 'climateware-ds.png',
        href: 'https://www.behance.net/gallery/250318739/Climateware-Design-System',
      },
    ],
  },
  {
    title: 'Lead UX/UI Designer',
    company: 'springfox',
    projects: [
      {
        title: 'climacarta Design System',
        year: '2022 - 2023',
        image: 'climacarta-ds.png',
        href: 'https://www.behance.net/gallery/250318717/climacarta-Design-System-for-Web3-Climate-Finance',
      },
      {
        title: 'climacarta, Branding',
        year: '2022',
        image: 'climacarta.png',
        href: 'https://www.behance.net/gallery/162225517/climacarta-Branding',
      },
      {
        title: 'springfox, Branding',
        year: '2022',
        image: 'springfox.png',
        href: 'https://www.behance.net/gallery/162211801/springfox-ICS',
      },
      {
        title: 'Peerless Ventures, Branding',
        year: '2022',
        image: 'peerlessventures.png',
        href: 'https://www.behance.net/gallery/162211785/Peerless-Ventures',
      },
      {
        title: 'Climateware, Branding',
        year: '2022',
        image: 'climateware.png',
        href: 'https://www.behance.net/gallery/162160845/Climateware-Bright-side-of-innovation',
      },
      {
        title: 'Nextep, Branding and App Design',
        year: '2022',
        image: 'nextep.png',
        href: 'https://www.behance.net/gallery/154235979/Nextep-Walk-Reduce-Impact',
      },
    ],
  },
  {
    title: 'UX/UI Designer',
    company: 'Semtrio',
    projects: [
      {
        title: 'Semtrio Brand Refresh',
        year: '2026',
        image: 'semtrio.png',
        href: 'https://www.behance.net/gallery/251072201/Semtrio-Brand-Refresh',
      },
      {
        title: 'Conference Branding for Semtrio',
        year: '2022',
        image: 'semtrio-con.png',
        href: 'https://www.behance.net/gallery/151103635/Semtrio-Branding-for-Digital-Transformation-Conf',
      },
      {
        title: 'Co2mission Platform for Turkish Airlines',
        year: '2021 - 2022',
        image: 'co2mission.png',
        href: 'https://www.behance.net/gallery/150129905/Co2mission-Turkish-Airlines-Flight-Offset-Program',
      },
      {
        title: 'Net Zero, Branding',
        year: '2021',
        image: 'netzero.png',
        href: 'https://www.behance.net/gallery/146189831/Net-Zero-Branding-Web-Design',
      },
    ],
  },
  {
    title: 'UI Designer',
    company: 'Win2Win',
    type: 'Contract',
    projects: [
      {
        title: 'Win2Win, Mobile App Redesign',
        year: '2019 - 2020',
        image: 'w2w.png',
        href: 'https://www.behance.net/gallery/120484885/Win2Win-Mobile-App-Redesign',
      },
    ],
  },
];
