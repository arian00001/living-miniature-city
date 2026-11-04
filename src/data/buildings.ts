import type { BuildingDef } from '../types';

// SAMPLE PORTFOLIO CONTENT — replace descriptions with your own words.
export const buildings: BuildingDef[] = [
  {
    id: 'headquarters',
    name: 'Headquarters',
    category: 'business',
    description:
      'The centre of the city: a five-storey glass headquarters with reception, development, creative and meeting floors, a management suite and a rooftop garden.',
    highlights: ['Reception lobby', 'Development floor', 'Creative floor', 'Meeting floor', 'Management suite'],
    cameraTarget: [0, 7, 0],
    cameraDistance: 42,
    hasInterior: true,
  },
  {
    id: 'devlab',
    name: 'Development Lab',
    category: 'business',
    description: 'Where the projects are built. Open this building to browse the project showcase with demos and repositories.',
    highlights: ['Project showcase', 'Live demos', 'Source code'],
    cameraTarget: [30, 7, -30],
    cameraDistance: 34,
  },
  {
    id: 'studio',
    name: 'Creative Studio',
    category: 'commercial',
    description: 'A staggered brick-and-glass studio for interface design, art direction and motion work.',
    highlights: ['Product design', 'Art direction', 'Motion'],
    cameraTarget: [-30, 6, -30],
    cameraDistance: 32,
  },
  {
    id: 'datacenter',
    name: 'Data Center',
    category: 'business',
    description: 'A low ribbed shell with rooftop chillers — the quiet machinery that keeps everything else running.',
    highlights: ['Infrastructure', 'Reliability', 'Automation'],
    cameraTarget: [-30, 4, 30],
    cameraDistance: 34,
  },
  {
    id: 'cafe',
    name: 'Corner Cafe',
    category: 'commercial',
    description: 'The city lunch spot. Employees gather here at noon and the terrace stays busy until the light turns orange.',
    highlights: ['Terrace seating', 'Open all day', 'Busy at noon'],
    cameraTarget: [30, 3, 30],
    cameraDistance: 26,
  },
  {
    id: 'house',
    name: 'Residence',
    category: 'residential',
    description: 'A small modern house with a fenced garden, trees and a front path on the quiet east edge of the island.',
    highlights: ['Garden', 'Quiet street', 'Evening lights'],
    cameraTarget: [52, 3, 0],
    cameraDistance: 26,
  },
  {
    id: 'park',
    name: 'Central Park',
    category: 'green',
    description: 'Trees, a pond, a fountain and long benches. Pedestrians loop through it all day long.',
    highlights: ['Pond', 'Fountain', 'Walking paths'],
    cameraTarget: [-16, 1, -52],
    cameraDistance: 42,
  },
  {
    id: 'contact',
    name: 'Contact Center',
    category: 'contact',
    description: 'Get in touch: email, social profiles and availability. The sign tower on the west edge of the island.',
    highlights: ['Email', 'Social links', 'Availability'],
    cameraTarget: [-52, 3, 0],
    cameraDistance: 26,
  },
];

export function buildingById(id: string) {
  return buildings.find((building) => building.id === id);
}

export function cameraFor(target: [number, number, number], distance: number): [number, number, number] {
  return [target[0] + distance * 0.62, target[1] + distance * 0.6, target[2] + distance * 0.66];
}
