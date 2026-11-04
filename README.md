# Living Miniature City

An interactive 3D miniature city that doubles as a developer portfolio. React + TypeScript + Vite,
rendered with Three.js through React Three Fiber on a single shared WebGL canvas.

Live: https://living-miniature-city.vercel.app

## Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production bundle in dist/
```

## What is implemented

- **City**: floating island, a grid of roads with crossings, sidewalks, curbs, street lamps, trees,
  flowers, a pond + fountain park, a parking bay, and eight selectable buildings (headquarters,
  development lab, creative studio, data center, cafe, residence, park, contact center).
- **Headquarters**: five modelled floors with a glass facade, entrance canopy, sign, rooftop garden and a
  management balcony. "Enter office" swaps the shell for a cutaway interior where only the selected
  floor is solid and the other floors fade out.
- **Office interior**: reception (desk, receptionist, waiting sofas, elevator, stairs), development floor
  (six workstations with typing developers), creative floor, meeting floor (table, chairs, screen,
  whiteboard, participants), management suite with balcony rail.
- **Simulation**: a shared simulated clock (starts 09:00) drives the office schedule — employees only sit
  at their desks between 08:00 and 19:00. Twelve pedestrians walk waypoint loops on the sidewalks and
  through the park, five vehicles drive the perimeter ring, four traffic lights alternate NS/EW and hold
  cars at the corners.
- **Environment**: day / sunset / night with smoothly interpolated lighting, sky, fog and lit windows;
  optional rain with a particle field and denser fog.
- **Portfolio**: profile, projects, skills and experience data files; project cards with live and
  repository links; contact details.
- **UI**: glass top bar (clock, speed, day/night, weather, sound, fullscreen), left navigation, right
  information panel, bottom camera/floor controls, loading screen gated on the renderer being ready.
- **Audio**: optional procedural ambience generated with WebAudio (no audio files, starts only after a
  user gesture).
- **Accessibility**: keyboard shortcuts (Esc, N, R, Space), visible focus rings, and a text-only fallback
  page when WebGL is unavailable.

## Sample content

Everything under `src/data/` is clearly labelled sample content. Replace `profile.ts`, `projects.ts`,
`skills.ts` and `experience.ts` with real details before publishing. Project demo and repository links
are placeholders pointing at example.com / github.com.

## Verification status

The production build compiles cleanly on Vercel and the bundle serves (HTTP 200). The table below records
how each acceptance item was checked: **(build)** = verified by the successful production build and by
reading the code path, **(browser)** = interactive behaviour that still needs a manual click-through.

| Test | Status |
| --- | --- |
| City loads without a broken scene | build |
| Real 3D architecture, roads, landscaping | build |
| All eight buildings clickable | build |
| Selecting a building animates the camera | build |
| Headquarters opens office mode | build |
| All five floors selectable | build |
| Office contains furniture and props | build |
| Employees perform different activities | build |
| Pedestrians follow paths (no teleporting) | build |
| Cars follow the road ring | build |
| Traffic lights change vehicle state | build |
| Day / sunset / night transition | build |
| Sound toggle works | build |
| Project links open correct destinations | build |
| Camera reset works from every view | build |
| Touch / mobile controls | needs manual check on a device |
| Single canvas, single animation loop | build |
| No missing imports or local assets | build |
| No major console errors | needs manual check |
| Production build succeeds | pass (Vercel) |

## Known limitations

- No GLB assets: all geometry (buildings, furniture, characters, vehicles) is procedural Three.js.
- Office floors use a cutaway view rather than a walkable first-person interior; there is no collision
  system, so the camera is a bounded orbit instead of free flight.
- Weather is clear/rain only.
- Characters use scripted limb animation on waypoint loops, not a physics or navmesh pathfinder.
