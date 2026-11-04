import type { Project } from '../types';

// SAMPLE CONTENT — replace with real projects, demo URLs and repositories.
export const projects: Project[] = [
  {
    id: 'atlas',
    name: 'Atlas Dashboard',
    description: 'A real-time operations dashboard with streaming metrics and a small design system of its own.',
    tech: ['React', 'TypeScript', 'WebSocket'],
    url: 'https://example.com',
    repo: 'https://github.com',
    category: 'Web application',
  },
  {
    id: 'orbit',
    name: 'Orbit Commerce',
    description: 'Headless storefront with a checkout flow, inventory sync and an admin console.',
    tech: ['Next.js', 'Postgres', 'Stripe'],
    url: 'https://example.com',
    repo: 'https://github.com',
    category: 'Commerce',
  },
  {
    id: 'fieldnotes',
    name: 'Field Notes',
    description: 'An offline-first note app with a tiny sync engine and a fully keyboard-driven interface.',
    tech: ['React', 'IndexedDB', 'Service worker'],
    url: 'https://example.com',
    repo: 'https://github.com',
    category: 'Productivity',
  },
];
