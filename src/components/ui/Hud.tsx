import { Compass, Film, Monitor } from 'lucide-react';
import { useCityStore } from '../../store/cityStore';

function formatClock(minutes: number) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = Math.floor(minutes % 60);
  return String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0');
}

export default function Hud() {
  const minutes = useCityStore((state) => state.minutes);
  const cinematic = useCityStore((state) => state.cinematic);
  const setCinematic = useCityStore((state) => state.setCinematic);
  const restartTour = useCityStore((state) => state.restartTour);
  const activeView = useCityStore((state) => state.activeView);
  const enterOffice = useCityStore((state) => state.enterOffice);
  const exitOffice = useCityStore((state) => state.exitOffice);

  return (
    <header className="hud">
      <div className="hud-brand">
        <span className="hud-mark">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M3 21V9l4-2v14H3zm6 0V4l5 3v14H9zm7 0V8l5-3v16h-5z" />
          </svg>
        </span>
        <div className="hud-title">
          <strong>DevStyle Tech</strong>
          <small>Living Miniature City</small>
        </div>
      </div>

      <div className="hud-actions">
        <span className="hud-chip">{formatClock(minutes)} Dhaka</span>
        <button
          type="button"
          className={'hud-pill' + (cinematic ? ' is-on' : '')}
          onClick={() => (cinematic ? setCinematic(false) : restartTour())}
          title={cinematic ? 'Stop the tour and take control' : 'Play the cinematic tour'}
        >
          {cinematic ? <Compass size={14} /> : <Film size={14} />}
          <span>{cinematic ? 'Free look' : 'Cinematic'}</span>
        </button>
        <button
          type="button"
          className={'hud-pill' + (activeView === 'office' ? ' is-on' : '')}
          onClick={() => (activeView === 'office' ? exitOffice() : enterOffice())}
        >
          <Monitor size={14} />
          <span>{activeView === 'office' ? 'City' : 'Office'}</span>
        </button>
      </div>
    </header>
  );
}
