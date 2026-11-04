export const FLOOR_HEIGHT = 2.8;
export const FLOOR_BASE = 0.8;
export const FLOOR_SIZE = 15;

export const officeFloors = [
  { index: 1, name: 'Reception', description: 'Reception desk, waiting area, elevator and staircase.' },
  { index: 2, name: 'Development', description: 'Six workstations with developers at work.' },
  { index: 3, name: 'Creative', description: 'Design workstations, mood board and meeting corner.' },
  { index: 4, name: 'Meetings', description: 'Conference table, presentation screen and whiteboard.' },
  { index: 5, name: 'Management', description: 'Executive office with a private balcony.' },
];

export function floorY(index: number) {
  return FLOOR_BASE + (index - 1) * FLOOR_HEIGHT;
}

export function isWorkingHours(minutes: number) {
  return minutes >= 8 * 60 && minutes <= 19 * 60;
}
