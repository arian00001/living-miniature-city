import type { Project } from '../types';

// Starting showcase. Everything here is editable from the Admin panel.
export const projects: Project[] = [
  {
    id: 'devayan-site',
    name: 'DEV // AYAN',
    description: 'Personal portfolio with motion, 3D and a private admin for content.',
    tech: ['React', 'TypeScript', 'Motion'],
    url: 'https://arian00001.site',
    repo: 'https://github.com/arian00001',
    category: 'Portfolio',
  },
  {
    id: 'living-city',
    name: 'Living Miniature City',
    description: 'A real-time WebGL city with a day/night cycle and a walkable office.',
    tech: ['Three.js', 'R3F', 'Vite'],
    url: 'https://living-miniature-city.vercel.app',
    repo: 'https://github.com/arian00001/living-miniature-city',
    category: '3D experience',
  },
  {
    id: 'ai-products',
    name: 'AI Web Products',
    description: 'AI-powered websites and apps with premium UI systems shipped for clients.',
    tech: ['Next.js', 'Node.js', 'AI'],
    url: 'https://arian00001.site',
    repo: 'https://github.com/arian00001',
    category: 'Client work',
  },
  {
    id: 'mobile-apps',
    name: 'Premium Mobile Apps',
    description: 'Cross-platform apps with native-feeling motion and clean design systems.',
    tech: ['React Native', 'Swift', 'Figma'],
    url: 'https://arian00001.site',
    repo: 'https://github.com/arian00001',
    category: 'Mobile',
  },
];