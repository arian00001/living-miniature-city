import { create } from 'zustand';
import { projects as seed } from '../data/projects';
import type { Project } from '../types';

const KEY = 'devayan.projects.v1';

function read(): Project[] {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) && parsed.length ? parsed : seed;
  } catch {
    return seed;
  }
}

function write(list: Project[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — the session still works in memory */
  }
}

interface ProjectState {
  projects: Project[];
  selectedId: string | null;
  add: (project: Project) => void;
  update: (id: string, project: Project) => void;
  remove: (id: string) => void;
  select: (id: string | null) => void;
  reset: () => void;
}

export const useProjects = create<ProjectState>((set) => ({
  projects: read(),
  selectedId: null,
  add: (project) =>
    set((state) => {
      const next = [project, ...state.projects];
      write(next);
      return { projects: next };
    }),
  update: (id, project) =>
    set((state) => {
      const next = state.projects.map((item) => (item.id === id ? project : item));
      write(next);
      return { projects: next };
    }),
  remove: (id) =>
    set((state) => {
      const next = state.projects.filter((item) => item.id !== id);
      write(next);
      return { projects: next, selectedId: state.selectedId === id ? null : state.selectedId };
    }),
  select: (id) => set({ selectedId: id }),
  reset: () => {
    write(seed);
    set({ projects: seed });
  },
}));

export const emptyProject = (): Project => ({
  id: 'p-' + Date.now().toString(36),
  name: '',
  description: '',
  tech: [],
  url: '',
  repo: '',
  category: '',
});