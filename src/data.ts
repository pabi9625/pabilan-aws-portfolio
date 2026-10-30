// Single source of truth for all site content.
// Only verified facts live here. Anything missing is marked TODO, not invented.

export const profile = {
  name: 'Kumarathass Pabilan',
  handle: 'pabilan',
  host: 'baner',
  title: 'Computer Science Undergraduate',
  university: 'University of Colombo School of Computing (UCSC)',
  universityShort: 'UCSC',
  focus: 'Machine Learning and Full-Stack Development',
  location: 'Sri Lanka',
  status: 'open to internships',
  // Started at UCSC in May 2024; uptime counts from here.
  uptimeSince: new Date('2024-05-01T00:00:00+05:30'),
};

export const links = {
  github: 'https://github.com/pabi9625',
  linkedin: 'https://www.linkedin.com/in/kumarathass-pabilan',
  cv: 'https://pabilan.dev/Kumarathass_Pabilan_CV.pdf',
  email: 'pabilankumarathass@gmail.com' as string | null,
};

export const about: string[] = [
  'I am a third-year Computer Science undergraduate at the University of Colombo School of Computing (UCSC), with a prior Diploma in Software Engineering. I build and ship full-stack applications end to end, from a custom PHP MVC pharmacy management system to production web apps I deploy and run on my own domain using AWS Amplify, Cognito, and AppSync.',
  'My research focus is machine learning, specifically applying data-driven models to practical, real-world problems. I am looking for internship and project opportunities where I can combine solid software engineering with ML to deliver working products.',
  'I also run a self-hosted home server called "baner".',
];

export type SkillGroup = { id: string; label: string; items: string[] };

export const skills: SkillGroup[] = [
  { id: 'lang', label: 'Languages', items: ['C', 'C++', 'Java', 'Python', 'PHP', 'JavaScript', 'TypeScript'] },
  { id: 'web', label: 'Web', items: ['HTML', 'CSS', 'React', 'Next.js', 'Node.js'] },
  { id: 'data', label: 'Databases & Cloud', items: ['MySQL', 'AWS (Amplify, Cognito, AppSync)', 'Azure'] },
  { id: 'tools', label: 'Tools', items: ['Git', 'Docker', 'Linux'] },
];

export type ProjectStatus = 'live' | 'in-progress' | 'repo';

export type Project = {
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  url: string | null;
};

export const projects: Project[] = [
  {
    slug: 'stridetrack',
    name: 'StrideTrack',
    subtitle: 'Walking & Weight-Loss Tracker',
    description:
      'A mobile-first walking and weight-loss tracker with streaks, charts, badges, and safe-pace weight goals. Built on AWS Amplify with Cognito and AppSync, and synced across devices.',
    tags: ['React', 'TypeScript', 'AWS Amplify'],
    status: 'live',
    url: 'https://stridetrack.pabilan.dev',
  },
  {
    slug: 'planner',
    name: 'Planner',
    description:
      'A web-based planner for scheduling lectures and study time. Scheduled cron jobs check upcoming sessions and push reminders through a Telegram bot webhook.',
    tags: ['Web App', 'Telegram Webhook', 'Cron Jobs'],
    status: 'live',
    url: 'https://planner.pabilan.dev',
  },
  {
    slug: 'medinex',
    name: 'MediNex',
    subtitle: 'Online Pharmacy Management System',
    description:
      'A second-year UCSC group project built with a custom PHP MVC architecture for medicine inventory, prescriptions, sales, and role-based dashboards. I was the team lead of the four-person group and developed the admin part, including core administration workflows and management features.',
    tags: ['PHP', 'MySQL', 'Team Lead', 'Admin Panel'],
    status: 'repo',
    url: 'https://github.com/pabi9625/MediNex',
  },
  {
    slug: 'deepseek-toolkit',
    name: 'DeepSeek Toolkit',
    subtitle: 'Chrome Extension',
    description:
      'A Chrome extension for chat.deepseek.com with language enforcement, custom rules, quick prompts, and Markdown chat export. All data stays local in the browser.',
    tags: ['JavaScript', 'Chrome Extension', 'CSS'],
    status: 'repo',
    url: 'https://github.com/pabi9625/deepseek-toolkit',
  },
  {
    slug: 'europe-bus',
    name: 'Europe Bus',
    subtitle: 'Bus Booking Desktop App',
    description:
      'A Java Swing desktop application for booking inter-city bus routes across Europe, backed by a MySQL database. Built in 2020 as coursework for the ESOFT Metro Campus Diploma in Software Engineering.',
    tags: ['Java Swing', 'MySQL'],
    status: 'repo',
    url: 'https://github.com/pabi9625/europe-bus-booking-system',
  },
  {
    slug: 'paperpal',
    name: 'PaperPal',
    description:
      'A past-paper MCQ practice platform for Sri Lankan O/L and A/L students, planned for deployment on AWS.',
    tags: ['Coming soon'],
    status: 'in-progress',
    url: null,
  },
];

export type EducationEntry = {
  date: string;
  message: string;
  details: string[];
  refs?: string;
};

// Newest first, like `git log`.
export const education: EducationEntry[] = [
  {
    date: 'May 2028',
    message: 'Expected graduation',
    details: ['B.Sc. (Hons) in Computer Science, University of Colombo School of Computing'],
    refs: 'origin/planned',
  },
  {
    date: 'May 2024 – Present',
    message: 'University of Colombo School of Computing: B.Sc. (Hons) in Computer Science',
    details: [
      'GPA 3.75/4.0 (first two years)',
      "Director's List Year 1, Semester 2 (AY21)",
      "Director's List Year 2, Semester 2 (AY22)",
    ],
    refs: 'HEAD -> main',
  },
  {
    date: '2022',
    message: 'G.C.E. Advanced Level, Hindu College Colombo',
    details: ['Physical Science stream (Mathematics, Physics, ICT)', '3 A, Z-score 2.1155'],
  },
  {
    date: 'Jan 2020 – Oct 2020',
    message: 'ESOFT Metro Campus: Diploma in Software Engineering (Java)',
    details: [],
  },
  {
    date: '2019',
    message: 'G.C.E. Ordinary Level, Hindu College Colombo',
    details: ['8 A, 1 B'],
    refs: 'tag: init',
  },
];

export type Cert = { name: string; url: string };
export type CertGroup = { provider: string; pkg: string; year: string; items: Cert[] };

export const certifications: CertGroup[] = [
  {
    provider: 'AWS',
    pkg: 'aws',
    year: '2026',
    items: [
      { name: 'AWS Cloud Practitioner Essentials', url: 'https://pabilan.dev/certificates/AWS_Cloud_Practitioner_Essentials.pdf' },
      { name: 'AWS SimuLearn: AI Practitioner (Training Badge)', url: 'https://www.credly.com/badges/d593482c-9adb-4563-baf7-4e0f56bb579f/public_url' },
    ],
  },
  {
    provider: 'Boot.dev',
    pkg: 'bootdev',
    year: '2026',
    items: [
      { name: 'Learn to Code in Python', url: 'https://www.boot.dev/certificates/61a9c1e3-d0c7-4cfc-9eba-9a85de199f42' },
      { name: 'Learn Git', url: 'https://www.boot.dev/certificates/a7171ab3-507c-4347-a9eb-13ba7f4d643e' },
      { name: 'Learn Linux', url: 'https://www.boot.dev/certificates/2ff28d66-dfb3-49b2-92b2-75a12b9b559f' },
      { name: 'Object Oriented Programming in Python', url: 'https://www.boot.dev/certificates/ea278fad-caab-4d45-88c3-9b7a9e8c95e5' },
      { name: 'Functional Programming in Python', url: 'https://www.boot.dev/certificates/502c0fb5-d385-4987-8b28-073ab2470f36' },
      { name: 'Build Asteroids using Python and Pygame', url: 'https://www.boot.dev/certificates/e743a2fb-9b17-466a-826e-f0e2ff1b2603' },
    ],
  },
  {
    provider: 'LinkedIn Learning',
    pkg: 'linkedin-learning',
    year: '2026',
    items: [
      { name: 'Learning REST APIs', url: 'https://www.linkedin.com/learning/certificates/d9ed0079f19f41d5c795bedb5997dd4f0b9906123f428c0cc177b7f10dff31d2' },
      { name: 'DevOps Foundations: CD/CI', url: 'https://www.linkedin.com/learning/certificates/f182df4257ff00abc159dfbcf6bbae98ba67bc68f88b13afac431410da9d6297' },
      { name: 'React Essential Training', url: 'https://www.linkedin.com/learning/certificates/cc3f1812180a376b557568ec6e7a90127ee9174e74c7065565ee6fa0d46b40d2' },
      { name: 'Microsoft Azure AI Essentials', url: 'https://www.linkedin.com/learning/certificates/de13c8616757c3a1557b59f4abc2bbcb722723b1f0157305eb8756b28a4d1325' },
    ],
  },
  {
    provider: 'Google – Coursera',
    pkg: 'google-coursera',
    year: '2023',
    items: [
      { name: 'Foundations: Data, Data, Everywhere', url: 'https://www.coursera.org/account/accomplishments/certificate/XELL67F2T56U' },
      { name: 'Technical Support Fundamentals', url: 'https://www.coursera.org/account/accomplishments/certificate/XK8C2BJJXUPV' },
      { name: 'Ask Questions to Make Data-Driven Decisions', url: 'https://www.coursera.org/account/accomplishments/certificate/TMEME6M5X9GD' },
      { name: 'Prepare Data for Exploration', url: 'https://www.coursera.org/account/accomplishments/certificate/WF8WYFM4EXAT' },
    ],
  },
  {
    provider: 'HackerRank',
    pkg: 'hackerrank',
    year: '2026',
    items: [
      { name: 'Software Engineer Intern', url: 'https://www.hackerrank.com/certificates/2d14089b92a7' },
      { name: 'Problem Solving (Basic)', url: 'https://www.hackerrank.com/certificates/bbbc74f58414' },
    ],
  },
];

export const contactBlurb = 'Open to internships, collaborations, and interesting conversations.';

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'contact', label: 'Contact' },
] as const;

// Deterministic short "commit hash" for decorative git-log styling.
export function shortHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
