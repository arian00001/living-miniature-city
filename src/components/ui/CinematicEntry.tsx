import { useEffect, useState } from 'react';
import { useCityStore } from '../../store/cityStore';

function Skyline() {
  return (
    <svg className="entry-skyline" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sky-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9f0ab" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f4fbe8" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        fill="url(#sky-fill)"
        d="M0 220V138h52V96h34v42h46V74h58v64h40v-38h44v38h48V58h62v80h38v-46h50v46h46v-70h56v70h44v-52h48v52h52v-38h40v38h44V86h54v52h46v-64h48v64h44v-28h44v28h42v-42h50v42h46v-30h40v30h38v82z"
      />
    </svg>
  );
}

export default function CinematicEntry() {
  const ready = useCityStore((state) => state.ready);
  const entered = useCityStore((state) => state.entered);
  const enterCity = useCityStore((state) => state.enterCity);
  const [phase, setPhase] = useState<'loading' | 'closing' | 'gone'>('loading');
  const [tick, setTick] = useState(6);

  useEffect(() => {
    if (ready || entered) return;
    const timer = window.setInterval(() => {
      setTick((value) => (value >= 92 ? 92 : value + Math.random() * 7 + 2));
    }, 220);
    return () => window.clearInterval(timer);
  }, [ready, entered]);

  useEffect(() => {
    if (phase !== 'closing') return;
    const timer = window.setTimeout(() => setPhase('gone'), 720);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'gone') return null;
  const progress = ready ? 100 : Math.min(92, Math.round(tick));

  return (
    <div className={'entry' + (phase === 'closing' ? ' is-closing' : '')}>
      <Skyline />
      <div className="entry-card">
        <span className="entry-mark">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 21V9l4-2v14H3zm6 0V4l5 3v14H9zm7 0V8l5-3v16h-5z"
            />
          </svg>
        </span>
        <p className="entry-kicker">DevStyle Tech · Dhaka, Bangladesh</p>
        <h1 className="entry-title">Living Miniature City</h1>
        <p className="entry-sub">
          A cinematic walk through a working city: real-time sky, live traffic, an open-plan studio and the people
          inside it.
        </p>

        <div className="entry-meter">
          <div className="entry-bar"><span style={{ width: progress + '%' }} /></div>
          <div className="entry-meta">
            <span>{progress < 100 ? 'Building the skyline' : 'Ready'}</span>
            <span className="entry-pct">{progress}%</span>
          </div>
        </div>

        <button type="button" className="entry-btn" onClick={() => { setPhase('closing'); enterCity(); }} disabled={!ready}>
          {ready ? 'Enter the city' : 'Loading city'}<span aria-hidden="true">→</span>
        </button>
        <p className="entry-note">The cinematic tour begins on entry · drag or scroll to take control</p>
      </div>
    </div>
  );
}
