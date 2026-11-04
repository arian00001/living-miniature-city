# Living Miniature City

An interactive 3D miniature city that doubles as a developer portfolio. React + TypeScript + Vite,
rendered with Three.js through React Three Fiber on a single shared WebGL canvas.

## Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production bundle in dist/
```

## What is implemented

- **City**: floating island, four-lane grid of roads with crossings, sidewalks, curbs, street lamps,
  trees, flowers, a pond + fountain park, a parking bay, and eight selectable buildings
  (headquarters, development lab, creative studio, data center, cafe, residence, park, contact center).
- **Headquarters**: five modelled floors with glass facade, entrance canopy, sign, rooftop garden and a
  management balcony. "Enter office" swaps the shell for a cutaway interior where only the selected
  floor is solid and the others fade out.
- **Office interior**: reception (desk, receptionist, waiting sofas, elevator, stairs), development floor
  (six workstations with typing developers), creative floor, meeting floor (table, chairs, screen,
  whiteboard, participants), management suite with balcony rail.
- **Simulation**: a shared simulated clock (start 09:00) drives the office schedule — employees only sit
  at their desks between 08:00 and 19:00. Twelve pedestrians walk waypoint loops on the sidewalks and
  through the park, five vehicles drive the perimeter ring, four traffic lights alternate NS/EW and stop
  cars at the corners.
- **Environment**: day / sunset / night with animated lighting, sky, fog and lit windows; optional rain
  with a particle field and denser fog.
- **Portfolio**: profile, projects, skills and experience data files; project cards with live and
  repository links; contact details.
- **UI**: glass top bar (clock, speed, day/night, weather, sound, fullscreen), left navigation, right
  information panel, bottom camera/floor controls, loading screen with a real readiness gate.
- **Audio**: optional procedural ambience generated with WebAudio (no audio files, starts only after a
  user gesture).
- **Accessibility**: keyboard shortcuts (Esc, N, R, Space), focus rings, and a text-only fallback page
  when WebGL is unavailable.

## Sample content

Everything under `src/data/` is clearly labelled sample content. Replace `profile.ts`, `projects.ts`,
`skills.ts` and `experience.ts` with real details before publishing. Project demo and repository links
are placeholders that open example.com / github.com.

## QA checklist (verified in the production build)

| Test | Status |
| --- | --- |
| City loads without a broken scene | pass |
| Real 3D architecture, roads, landscaping | pass |
| All eight buildings clickable | pass |
| Selecting a building animates the camera | pass |
| Headquarters opens office mode | pass |
| All five floors selectable | pass |
| Office contains furniture and props | pass |
| Employees perform different activities | pass |
| Pedestrians follow paths (no teleporting) | pass |
| Cars follow the road ring | pass |
| Traffic lights change vehicle state | pass |
| Day / sunset / night transition | pass |
| Sound toggle works | pass |
| Project links open correct destinations | pass |
| Camera reset works from every view | pass |
| Touch / mobile controls | pass (OrbitControls touch + responsive UI) |
| Single canvas, single animation loop | pass |
| No missing imports or local assets | pass |
| No major console errors | pass |
| Production build succeeds | pass |

## Known limitations

- No GLB assets: all geometry (buildings, furniture, characters, vehicles) is procedural Three.js.
- Office floors are a cutaway view rather than a walkable first-person interior; there is no collision
  system, so the camera uses bounded orbit instead of free-flight.
- Weather is clear/rain only; clouds and fog banks are not modelled.
- Characters use scripted limb animation on waypoint loops, not a physics or navmesh pathfinder.
