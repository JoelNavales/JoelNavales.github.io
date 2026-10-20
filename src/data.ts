import type { CarouselPhoto } from './components/PhotoCarousel';
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
  // Describes the cover image. A real screenshot also sets `screenshot`, which drops the
  // concept-art label, and `position` to aim the crop at the part of the screen that matters.
  imageAlt: string;
  screenshot?: boolean;
  position?: string;
  // What I did on the project, shown on the cards so it doesn't hide in the dialog.
  role: string;
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
    imageAlt: 'Concept illustration for Locker',
    role: 'My capstone: designing and building the app in Flutter and Firebase.',
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
    image: assetUrl('assets/Clario-web.jpg'),
    imageAlt: 'The Clario dashboard, with the day’s mood check-in, a focus timer and streak counts',
    screenshot: true,
    position: '50% 0%',
    role: 'Built the whole app: mood log, habit streaks, tasks and themes.',
    color: 'green',
    repo: 'https://github.com/JoelNavales/clario-v1',
    demo: 'https://joelnavales.github.io/clario-v1/',
  },
  {
    id: 'aspire',
    number: '03',
    title: 'Aspire',
    category: 'Mobile app & UI/UX',
    status: 'Open source',
    description: 'Helping students connect their interests and strengths to future career paths.',
    detail:
      'Aspire is a team-built career guidance app for students. My contribution focused on interface design and Flutter UI/UX: making assessments and career exploration approachable. The app brings together quizzes about interests, skills, personality, and work values, then uses Google Gemini to suggest career paths with explanations and required skills. Built with Flutter and Dart, it uses Firebase Authentication and Cloud Firestore for accounts and saved progress. The public repository includes the app source and project documentation.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Gemini AI'],
    image: assetUrl('assets/aspire.svg'),
    imageAlt: 'Concept illustration for Aspire',
    role: 'Team project. My part: interface design and the Flutter UI.',
    color: 'lavender',
    repo: 'https://github.com/senRyuu286/SE-Aspire',
  },
  {
    id: 'steelbound',
    number: '04',
    title: 'SteelBound',
    category: 'Game development',
    status: 'Open source',
    description:
      'A 2.5D action-platformer where a cursed knight fights to escape a shifting dungeon.',
    detail:
      'SteelBound is a fast-paced 2.5D action-platformer where you play as a cursed knight fighting to escape a dangerous, ever-changing dungeon. With tight combat, deadly traps, and rogue-lite progression, every run is a new challenge. Can you break the chains and survive the depths? I built it in Java with my partner, Justin B. Ramas.',
    stack: ['Java', 'Swing'],
    image: assetUrl('assets/SteelBound-web.jpg'),
    imageAlt: 'Title screen of SteelBound',
    screenshot: true,
    position: '50% 25%',
    role: 'Built in Java with my partner, Justin B. Ramas.',
    color: 'lavender',
    repo: 'https://github.com/senRyuu286/SteelBound',
  },
];

export const skills = [
  {
    title: 'Build & develop',
    items: [
      'Flutter',
      'React',
      'TypeScript',
      'PHP',
      'Laravel',
      'Firebase',
      'Node.js',
      'Next.js',
      'Angular.js',
    ],
  },
  { title: 'Design & explore', items: ['Figma', 'Canva', 'Adobe Photoshop', 'UI/UX'] },
  {
    title: 'Learning next',
    items: ['BLoC & Clean Architecture', 'Laravel APIs', 'Unit testing'],
  },
];

// Senior high research awards, all from the 5th Josenian SHS Research Summit (April 2023).
export const achievements = [
  {
    title: 'Best Oral Presenter',
    meta: '“People” category · April 2023',
    description:
      'Awarded for achieving the highest overall evaluation score among finalists in research presentation and defense.',
  },
  {
    title: 'Panelists’ Choice Award',
    meta: '“People” category · April 2023',
    description:
      'Recognized for exceptional research contributions through the feasibility study of SenSOIL, a smart farming soil nutrient sensor.',
  },
  {
    title: 'HARMONY Evaluators’ Choice Award',
    meta: 'Team Sereen · April 2023',
    description:
      'Recognized as the STEM capstone team receiving the highest number of evaluator votes for its research project.',
  },
];

export const achievementPhotos: CarouselPhoto[] = [
  {
    src: assetUrl('assets/SHS-RESEARCH-web.jpg'),
    alt: 'Team Sereen at the SenSOIL research booth, beside the feasibility study poster',
    caption: 'Our SenSOIL booth and research poster',
  },
  {
    src: assetUrl('assets/SHS-Award-web.jpg'),
    alt: 'The team on stage at the 5th Josenian SHS Research Summit with their awards',
    caption: 'On stage after the awarding',
  },
  {
    src: assetUrl('assets/SHS-Awards-2-web.jpg'),
    alt: 'The team outside the University of San Jose–Recoletos holding their certificates and medals',
    caption: 'Certificates and medals, outside USJ–R',
    position: '50% 85%',
  },
  {
    src: assetUrl('assets/SenSOIL-web.jpg'),
    alt: 'The SenSOIL device modeled in Fusion 360: a control box wired to an NPK soil probe',
    caption: 'The SenSOIL device, modeled in Fusion 360',
  },
];

export const email = 'navales546@gmail.com';

// Drop the PDF at public/assets/Joel-Navales-Resume.pdf; every résumé link points here.
export const resumeUrl = assetUrl('assets/Joel-Navales-Resume.pdf');

export const socials = [
  { name: 'GitHub', url: 'https://github.com/JoelNavales' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/joel-franco-v-navales-5bba6831a/' },
  { name: 'Instagram', url: 'https://instagram.com/_joelnavales' },
  { name: 'Facebook', url: 'https://facebook.com/JoelNavales' },
  { name: 'TikTok', url: 'https://tiktok.com/@navales_7' },
];
