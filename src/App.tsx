import { useEffect, useMemo } from 'react';
import CityCanvas from './components/city/CityCanvas';
import Hud from './components/ui/Hud';
import CinematicEntry from './components/ui/CinematicEntry';
import SceneBoundary from './components/ui/SceneBoundary';
import Joystick from './components/ui/Joystick';
import { useCityStore } from './store/cityStore';
import { supportsWebGL } from './lib/webgl';
import { profile } from './data/profile';
import { projects } from './data/projects';

export default function App() {
  const supported = useMemo(() => supportsWebGL(), []);
  const entered = useCityStore((state) => state.entered);
  const activeView = useCityStore((state) => state.activeView);
  const clearSelection = useCityStore((state) => state.clearSelection);
  const toggleOffice = useCityStore((state) => state.enterOffice);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'Escape') clearSelection();
      if (event.key.toLowerCase() === 'o') {
        if (useCityStore.getState().activeView === 'office') useCityStore.getState().exitOffice();
        else toggleOffice();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clearSelection, toggleOffice]);

  if (!supported) return <NoWebGL />;

  return (
    <div className="app">
      <SceneBoundary>
        <CityCanvas />
      </SceneBoundary>
      {entered && activeView ? <Hud /> : null}
      {entered && activeView === 'city' ? <Joystick /> : null}
      <CinematicEntry />
    </div>
  );
}

function NoWebGL() {
  return (
    <div className="no-webgl">
      <div className="glass-card">
        <h1>This city needs WebGL</h1>
        <p>
          Your browser could not start a WebGL context, so the 3D city cannot be rendered. Everything important is
          also available here as text.
        </p>
        <h2>{profile.name}</h2>
        <p>{profile.title} — {profile.location}</p>
        <p>{profile.bio}</p>
        <h3>Projects</h3>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <a href={project.url} target="_blank" rel="noreferrer noopener">{project.name}</a> — {project.description}
            </li>
          ))}
        </ul>
        <p>
          Contact: <a href={'mailto:' + profile.email}>{profile.email}</a>
        </p>
      </div>
    </div>
  );
}
