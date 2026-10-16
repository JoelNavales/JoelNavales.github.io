export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  status: string;
  description: string;
  detail: string;
  stack: string[];
  image: string;
  color: string;
};

export const projects: Project[] = [
  {
    id: 'car-rental',
    number: '01',
    title: 'Car rental app',
    category: 'Mobile development',
    status: 'In progress',
    description:
      'Putting my mobile development skills into practice with a real-world car rental application.',
    detail:
      'A car rental application I’m currently building with Flutter, Firebase, and a PHP backend. This is ongoing work as I explore how mobile interfaces and backend services come together.',
    stack: ['Flutter', 'Firebase', 'PHP'],
    image: '/assets/car-rental.svg',
    color: 'coral',
  },
  {
    id: 'e-shop',
    number: '02',
    title: 'e-shop',
    category: 'Web development',
    status: 'Private repository',
    description: 'A PHP project in my current development workspace.',
    detail:
      'e-shop is a private PHP project I’m currently working on. The source code is not publicly available. Get in touch if you’d like to talk about my work and what I’m learning.',
    stack: ['PHP'],
    image: '/assets/e-shop.svg',
    color: 'green',
  },
  {
    id: 'traits',
    number: '03',
    title: 'Traits',
    category: 'PHP development',
    status: 'Private repository',
    description: 'More hands-on development and exploration with PHP.',
    detail:
      'Traits is another private PHP repository in my current work. It’s part of my ongoing exploration of backend development. The source code is not publicly available.',
    stack: ['PHP'],
    image: '/assets/traits.svg',
    color: 'lavender',
  },
];

export const toolkit = ['Flutter', 'Laravel', 'Firebase', 'PHP', 'Figma'];

export const skills = [
  {
    title: 'Build & develop',
    items: [
      'Flutter',
      'PHP',
      'Laravel',
      'Firebase',
      'Node.js',
      'Next.js',
      'Angular.js',
      'NPM',
      'Apache',
    ],
  },
  { title: 'Design & explore', items: ['Figma', 'Canva', 'Adobe Photoshop', 'UI/UX'] },
  {
    title: 'Learning next',
    items: [
      'BLoC & Clean Architecture',
      'Laravel APIs',
      'React',
      'Unit testing',
      'Maintainable code',
    ],
  },
];

export const socials = [
  { name: 'GitHub', url: 'https://github.com/JoelNavales' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/joel-franco-v-navales-5bba6831a/' },
  { name: 'Instagram', url: 'https://instagram.com/_joelnavales' },
  { name: 'Facebook', url: 'https://facebook.com/JoelNavales' },
  { name: 'TikTok', url: 'https://tiktok.com/@navales_7' },
];
