export type BuildingCategory = 'business' | 'commercial' | 'residential' | 'green' | 'contact';

export interface BuildingDef {
  id: string;
  name: string;
  category: BuildingCategory;
  description: string;
  highlights: string[];
  cameraTarget: [number, number, number];
  cameraDistance: number;
  hasInterior?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  url: string;
  repo: string;
  category: string;
}

export interface Skill {
  name: string;
  category: string;
  level: number;
}

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  socials: { label: string; url: string }[];
}

export type LightingMode = 'day' | 'sunset' | 'night';
export type WeatherMode = 'clear' | 'rain';
export type CameraPreset = 'city' | 'business' | 'headquarters' | 'park' | 'office';
export type Panel = 'building' | 'projects' | 'about' | 'contact' | null;
