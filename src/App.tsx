import { useEffect, useMemo } from 'react';
import CityCanvas from './components/city/CityCanvas';
import TopBar from './components/ui/TopBar';
import SideNav from './components/ui/SideNav';
import InfoPanel from './components/ui/InfoPanel';
import BottomControls from './components/ui/BottomControls';
import LoadingScreen from './components/ui/LoadingScreen';
import { useCityStore } from './store/cityStore';
import { supportsWebGL } from './lib/webgl';
import { profile } from './data/profile';
import { projects } from './data/projects';

export default function App() {
  const supported = useMemo(() => supportsWebGL(), []);
  const cycleLighting = useCityStore((state) => state.cycleLighting);
  const clearSelection = useCityStore((state) => state.clearSelection);
  const focusPreset = useCityStore((state) => state.focusPreset);
  const toggleSimulation = useCityStore((state) => state.toggleSimulation);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'Escape') clearSelection();
      if (event.key.toLowerCase() === 'n') cycleLighting();
      if (event.key.toLowerCase() === 'r') focusPreset('city');
      if (event.key === ' ') {
        event.preventDefault();
        toggleSimulation();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cycleLighting, clearSelection, focusPreset, toggleSimulation]);

  if (!supported) return <NoWebGL />;

  return (
    <div className="app">
      <CityCanvas />
      <div className="ui">
        <TopBar />
        <div className="ui-mid">
          <SideNav />
          <InfoPanel />
        </div>
        <BottomControls />
      </div>
      <LoadingScreen />
    </div>
  );
}

function NoWebGL() {
  return (
    <div className="no-webgl">
      <div className="glass-card">
        <h1>This city needs WebGL</h1>
        <p>
          Your browser could not start a WebGL context, so the 3D island cannot be rendered. Everything important is
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
