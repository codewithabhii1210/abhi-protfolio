/**
 * Single source of truth for everything displayed on the public site.
 *
 * Keeping content out of components means:
 *  - Sections become pure presentational and are easy to reorder or delete.
 *  - Non-devs can edit copy without touching JSX.
 *  - VITE_* env vars can override anything without a rebuild of the source.
 */

const env = import.meta.env;
const or = (value, fallback) => value || fallback;

export const PERSONAL = {
  name: 'Abhishek Singh',
  shortName: 'Abhi',
  initials: 'AS',
  tagline: 'Computer Science Student',
  headline: 'Building Digital Experiences.',
  availability: 'Available for opportunities',
  bio: [
    "I'm a Computer Science undergraduate at LNCT Group of Colleges, Bhopal, focused on full-stack development and problem solving.",
    'I enjoy turning ideas into functional web applications and continuously improving my programming fundamentals by solving coding problems across competitive programming platforms.',
  ],
  email: or(env.VITE_EMAIL, 'abhisingh12102007@gmail.com'),
  github: or(env.VITE_GITHUB_URL, '#'),
  linkedin: or(env.VITE_LINKEDIN_URL, 'https://www.linkedin.com/in/abhishek-singh-20a9ab2b1'),
  photo: or(env.VITE_PHOTO, '/profile.jpg'),
  roles: ['Full-Stack Developer.', 'Problem Solver.', 'Creative Developer.'],
};

export const STATS = {
  problemsSolved: 400,
  streakDays: 100,
};

export const STACK = {
  Programming: ['Java', 'C', 'JavaScript'],
  Frontend: ['HTML', 'CSS', 'React.js', 'Vite', 'Tailwind CSS'],
  Backend: ['Node.js', 'Express.js', 'REST APIs'],
  'Database & Cloud': ['MongoDB', 'Mongoose', 'Cloudinary'],
  Tools: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA'],
  'Creative & Productivity': [
    'Canva',
    'MS Office',
    'Prompt Engineering',
    'Vibe Coding',
    'Video Editing',
  ],
};

export const MARQUEE_WORDS = [
  'React.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Java',
  'Tailwind CSS',
  'Gemini API',
  'REST APIs',
  'Vite',
  'GSAP',
  'Git',
];

/**
 * Fallback for the featured project. The live site prefers the API response
 * and only uses this when the network or database is unavailable, so the
 * featured section is never blank.
 */
export const FEATURED_FALLBACK = {
  title: 'SehatSaarthi',
  year: 2026,
  tag: 'Featured Project',
  description:
    'SehatSaarthi is a full-stack healthcare application designed to provide accessible digital healthcare assistance through a modern web platform.',
  highlights: [
    'Architected a full-stack app with React.js, Vite and Tailwind CSS using reusable components.',
    'Built role-based interfaces across the platform.',
    'Engineered RESTful services with Node.js and Express.js.',
    'Integrated Google Gemini API for AI-driven healthcare assistance and prediction workflows.',
  ],
  technologies: [
    'React.js',
    'Vite',
    'Tailwind CSS',
    'Node.js',
    'Express.js',
    'REST APIs',
    'Gemini API',
  ],
  githubUrl: or(env.VITE_SEHATSAARTHI_GITHUB, '#'),
  liveUrl: or(env.VITE_SEHATSAARTHI_LIVE, '#'),
};

export const ARCHITECTURE_FLOWS = [
  {
    title: 'Application Flow',
    nodes: ['React / Vite', 'REST API', 'Node.js + Express', 'Controllers', 'MongoDB'],
  },
  {
    title: 'AI Flow',
    nodes: ['Frontend', 'Gemini API', 'AI-powered assistance'],
  },
];

export const MORE_WORK = [
  { name: 'BMW Clone', url: env.VITE_BMW_URL || null },
  { name: 'Apple Clone', url: env.VITE_APPLE_URL || null },
  { name: 'Netflix Clone', url: env.VITE_NETFLIX_URL || null },
  { name: 'Clothing Brand Website', url: env.VITE_CLOTHING_URL || null },
];

export const ACHIEVEMENTS = [
  {
    metric: `${STATS.problemsSolved}+`,
    title: 'Coding Problems',
    description:
      'Consistently solving programming and competitive coding problems across coding platforms.',
  },
  {
    metric: '100-Day',
    title: 'LeetCode Streak',
    description: 'Maintained a 100-day coding streak on LeetCode.',
  },
  {
    metric: 'Internshala',
    title: 'Student Partner',
    description:
      'Selected as an Internshala Student Partner, promoting career and internship awareness among students.',
  },
];

export const EDUCATION = [
  {
    year: '2025-2029',
    institution: 'LNCT Group of Colleges, Bhopal',
    degree: 'B.Tech - Computer Science Engineering',
    note: 'Second Year Undergraduate',
  },
  {
    year: '2025',
    institution: 'K V Bhind, Bhind',
    degree: 'Senior Secondary - Class XII',
    note: '79.6%',
  },
  {
    year: '2023',
    institution: 'EMHSS, Bhind',
    degree: 'Secondary - Class X',
    note: '',
  },
];

export const CERTIFICATION = {
  title: 'Introduction to Data Science',
  issuer: 'Cisco Networking Academy',
  issued: 'November 2025',
  imageUrl: env.VITE_CERT_IMAGE || '',
};

export const BEYOND = {
  highlights: [
    { title: 'Hackathons', description: 'Participated in various hackathons.' },
    { title: 'Collaboration', description: 'Worked with Reffto in college projects and activities.' },
    {
      title: 'Creative Design',
      description: 'Designed posters and videos for school and college events.',
    },
  ],
  strengths: [
    'Creative thinking',
    'Problem-solving',
    'Teamwork',
    'Leadership',
    'Communication',
    'Sports',
    'Music',
    'Writing',
  ],
  interests: [
    'Video editing',
    'Graphic designing',
    'Exploring new technologies',
    'Reading about tech innovations',
  ],
};

/** Nav links, in order. `id` must match a section's id attribute. */
export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Work', href: '#work' },
  { label: 'Journey', href: '#journey' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];
