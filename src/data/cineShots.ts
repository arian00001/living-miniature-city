export interface Shot {
  from: [number, number, number];
  to: [number, number, number];
  lookFrom: [number, number, number];
  lookTo: [number, number, number];
  fovFrom: number;
  fovTo: number;
  duration: number;
}

// A closed loop of camera moves: every shot ends where the next one begins, so the
// tour can run forever without a visible cut.
export const cineShots: Shot[] = [
  {
    from: [132, 138, 164],
    to: [92, 86, 120],
    lookFrom: [0, 8, 0],
    lookTo: [0, 5, 0],
    fovFrom: 40,
    fovTo: 37,
    duration: 9,
  },
  {
    from: [92, 86, 120],
    to: [96, 22, 58],
    lookFrom: [0, 5, 0],
    lookTo: [10, 6, 20],
    fovFrom: 37,
    fovTo: 46,
    duration: 7,
  },
  {
    from: [96, 22, 58],
    to: [18, 16, 64],
    lookFrom: [10, 6, 20],
    lookTo: [-4, 4, 10],
    fovFrom: 46,
    fovTo: 44,
    duration: 8,
  },
  {
    from: [18, 16, 64],
    to: [-44, 26, 44],
    lookFrom: [-4, 4, 10],
    lookTo: [0, 3, 4],
    fovFrom: 44,
    fovTo: 41,
    duration: 8,
  },
  {
    from: [-44, 26, 44],
    to: [-26, 20, 32],
    lookFrom: [0, 3, 4],
    lookTo: [0, 2, 2],
    fovFrom: 41,
    fovTo: 38,
    duration: 6,
  },
  {
    from: [-26, 20, 32],
    to: [16, 13, 21],
    lookFrom: [0, 2, 2],
    lookTo: [2, 1, 0],
    fovFrom: 38,
    fovTo: 35,
    duration: 7,
  },
  {
    from: [16, 13, 21],
    to: [-12, 12, 17],
    lookFrom: [2, 1, 0],
    lookTo: [-2, 1, -1],
    fovFrom: 35,
    fovTo: 34,
    duration: 7,
  },
  {
    from: [-12, 12, 17],
    to: [-18, 15, -14],
    lookFrom: [-2, 1, -1],
    lookTo: [0, 5, 0],
    fovFrom: 34,
    fovTo: 39,
    duration: 6,
  },
  {
    from: [-18, 15, -14],
    to: [-30, 46, -2],
    lookFrom: [0, 5, 0],
    lookTo: [0, 9, 0],
    fovFrom: 39,
    fovTo: 42,
    duration: 7,
  },
  {
    from: [-30, 46, -2],
    to: [-52, 22, -30],
    lookFrom: [0, 9, 0],
    lookTo: [-16, 3, -48],
    fovFrom: 42,
    fovTo: 45,
    duration: 7,
  },
  {
    from: [-52, 22, -30],
    to: [-16, 15, -48],
    lookFrom: [-16, 3, -48],
    lookTo: [-14, 2, -54],
    fovFrom: 45,
    fovTo: 44,
    duration: 6,
  },
  {
    from: [-16, 15, -48],
    to: [-34, 70, -76],
    lookFrom: [-14, 2, -54],
    lookTo: [0, 8, 0],
    fovFrom: 44,
    fovTo: 42,
    duration: 7,
  },
  {
    from: [-34, 70, -76],
    to: [132, 138, 164],
    lookFrom: [0, 8, 0],
    lookTo: [0, 8, 0],
    fovFrom: 42,
    fovTo: 40,
    duration: 8,
  },
];
