import { assetUrl } from './lib/assets';

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
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    id: 'locker',
    number: '01',
    title: 'Locker',
    category: 'Mobile development',
    status: 'In development',
    description: 'A study app where every subject is a locker you open, not a boring folder.',
    detail:
      'Locker is my capstone project: a mobile study app built with Flutter and Firebase, where each subject becomes a locker you unlock. It’s being designed around priority colors that flag what’s urgent across lockers, the calendar, and tasks, a focus timer with an ambient sound mixer, and a study crew that keeps you accountable. It’s still in development.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    image: assetUrl('assets/locker.svg'),
    color: 'coral',
    repo: 'https://github.com/JoelNavales/locker',
  },
  {
    id: 'clario',
    number: '02',
    title: 'Clario',
    category: 'Web development',
    status: 'Live demo',
    description: 'A fast, offline-ready life dashboard for tracking mood, habits, and tasks.',
    detail:
      'Clario v1 is a life dashboard built with React, TypeScript, and Tailwind CSS. You log one mood a day with an optional journal note, check off habits to build streaks, and manage tasks by priority, with light, dark, and custom themes. It has no backend or accounts: everything runs in the browser and is saved to local storage, a deliberately simple first version to test the core experience before adding cloud sync.',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    image: assetUrl('assets/clario.svg'),
    color: 'green',
    repo: 'https://github.com/JoelNavales/clario-v1',
    demo: 'https://joelnavales.github.io/clario-v1/',
  },
  {
    id: 'aspire',
    number: '03',
    title: 'Aspire',
    category: 'Mobile app & UI/UX',
    status: 'Public repository',
    description: 'Helping students connect their interests and strengths to future career paths.',
    detail:
      'Aspire is a team-built career guidance app for students. My contribution focused on interface design and Flutter UI/UX: making assessments and career exploration approachable. The app brings together quizzes about interests, skills, personality, and work values, then uses Google Gemini to suggest career paths with explanations and required skills. Built with Flutter and Dart, it uses Firebase Authentication and Cloud Firestore for accounts and saved progress. The public repository includes the app source and project documentation.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Gemini AI'],
    image: assetUrl('assets/aspire.svg'),
    color: 'lavender',
    repo: 'https://github.com/senRyuu286/SE-Aspire',
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
