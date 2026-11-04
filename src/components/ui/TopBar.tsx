import { useState } from 'react';
import { CloudRain, CloudSun, Maximize2, Moon, Pause, Play, Sun, Sunset, Volume2, VolumeX } from 'lucide-react';
import { useCityStore } from '../../store/cityStore';
import { useAmbientAudio } from './useAmbientAudio';

function formatClock(minutes: number) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = Math.floor(minutes % 60);
  return String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0');
}

export default function TopBar() {
  useAmbientAudio();
  const [fullscreen, setFullscreen] = useState(false);
  const minutes = useCityStore((state) => state.minutes);
  const lightingMode = useCityStore((state) => state.lightingMode);
  const setLighting = useCityStore((state) => state.setLighting);
  const weather = useCityStore((state) => state.weather);
  const toggleWeather = useCityStore((state) => state.toggleWeather);
  const soundEnabled = useCityStore((state) => state.soundEnabled);
  const toggleSound = useCityStore((state) => state.toggleSound);
  const simulationEnabled = useCityStore((state) => state.simulationEnabled);
  const toggleSimulation = useCityStore((state) => state.toggleSimulation);
  const speed = useCityStore((state) => state.simulationSpeed);
  const setSpeed = useCityStore((state) => state.setSpeed);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    }
  };

  return (
    <header className="topbar glass-card">
      <div className="brand">
        <span className="brand-mark">LC</span>
        <div>
          <div className="brand-title">Living Miniature City</div>
          <div className="brand-sub">Interactive portfolio · 8 districts · 5 office floors</div>
        </div>
      </div>

      <div className="chip-row">
        <span className="chip mono" title="Simulated city time">{formatClock(minutes)}</span>
        <button type="button" className="chip" onClick={toggleSimulation} title="Pause or resume the simulation">
          {simulationEnabled ? <Pause size={13} /> : <Play size={13} />}
          {simulationEnabled ? 'Live' : 'Paused'}
        </button>
        <button type="button" className={'chip' + (speed === 1 ? ' active' : '')} onClick={() => setSpeed(1)}>1x</button>
        <button type="button" className={'chip' + (speed === 4 ? ' active' : '')} onClick={() => setSpeed(4)}>4x</button>

        <button type="button" className={'chip' + (lightingMode === 'day' ? ' active' : '')} onClick={() => setLighting('day')} title="Day">
          <Sun size={13} /> Day
        </button>
        <button type="button" className={'chip' + (lightingMode === 'sunset' ? ' active' : '')} onClick={() => setLighting('sunset')} title="Sunset">
          <Sunset size={13} /> Sunset
        </button>
        <button type="button" className={'chip' + (lightingMode === 'night' ? ' active' : '')} onClick={() => setLighting('night')} title="Night">
          <Moon size={13} /> Night
        </button>

        <button type="button" className={'chip' + (weather === 'rain' ? ' active' : '')} onClick={toggleWeather} title="Toggle rain">
          {weather === 'rain' ? <CloudRain size={13} /> : <CloudSun size={13} />}
          {weather === 'rain' ? 'Rain' : 'Clear'}
        </button>

        <button type="button" className={'chip' + (soundEnabled ? ' active' : '')} onClick={toggleSound} title="Toggle ambient sound">
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          {soundEnabled ? 'Sound on' : 'Sound off'}
        </button>

        <button type="button" className="chip" onClick={toggleFullscreen} title="Fullscreen">
          <Maximize2 size={13} /> {fullscreen ? 'Exit' : 'Full'}
        </button>
      </div>
    </header>
  );
}
