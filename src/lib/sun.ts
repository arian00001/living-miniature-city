export const DHAKA_TZ = 'Asia/Dhaka';

export function dhakaMinutes(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: DHAKA_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0') % 24;
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  return hour * 60 + minute;
}

export function formatClock(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = Math.floor(minutes % 60);
  return String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0');
}

export interface CelestialState {
  minutes: number;
  sunDir: [number, number, number];
  moonDir: [number, number, number];
  elevation: number;
  night: number;
}

function normalize(v: [number, number, number]): [number, number, number] {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function smooth(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0 || 1e-6)));
  return t * t * (3 - 2 * t);
}

/** Sun travels east to west; 06:00 sunrise, 12:00 noon, 18:00 sunset. */
export function celestial(minutes: number): CelestialState {
  const t = ((minutes % 1440) + 1440) % 1440;
  const angle = (t / 1440 - 0.25) * Math.PI * 2;
  const sunTilt = 0.42;
  const sun = normalize([
    Math.cos(angle) * Math.cos(sunTilt),
    Math.sin(angle),
    -Math.cos(angle) * Math.sin(sunTilt) - 0.2,
  ]);
  const moonAngle = angle + Math.PI;
  const moon = normalize([
    Math.cos(moonAngle) * Math.cos(0.62),
    Math.sin(moonAngle),
    -Math.cos(moonAngle) * Math.sin(0.62) + 0.24,
  ]);
  return {
    minutes: t,
    sunDir: sun,
    moonDir: moon,
    elevation: sun[1],
    night: smooth(0.14, -0.18, sun[1]),
  };
}

export interface SkyPalette {
  zenith: string;
  horizon: string;
  ground: string;
  fog: string;
  sunColor: string;
  ambient: number;
  hemi: number;
  sunIntensity: number;
  moonIntensity: number;
  exposure: number;
  glow: number;
}

interface Stop extends SkyPalette {
  el: number;
}

const STOPS: Stop[] = [
  { el: -1.0, zenith: '#04060d', horizon: '#0b1524', ground: '#070c14', fog: '#0a1421', sunColor: '#3a5a9e', ambient: 0.1, hemi: 0.18, sunIntensity: 0.0, moonIntensity: 0.42, exposure: 0.92, glow: 0.0 },
  { el: -0.16, zenith: '#0a1530', horizon: '#1d2b49', ground: '#101a2a', fog: '#131f33', sunColor: '#6c86bd', ambient: 0.14, hemi: 0.24, sunIntensity: 0.12, moonIntensity: 0.34, exposure: 0.95, glow: 0.15 },
  { el: 0.0, zenith: '#26385f', horizon: '#d0724f', ground: '#3c3a34', fog: '#8a6559', sunColor: '#ff8752', ambient: 0.26, hemi: 0.34, sunIntensity: 0.95, moonIntensity: 0.12, exposure: 1.0, glow: 0.9 },
  { el: 0.16, zenith: '#3a6ea8', horizon: '#f2b98d', ground: '#5c584a', fog: '#c0ad9c', sunColor: '#ffc78e', ambient: 0.4, hemi: 0.42, sunIntensity: 1.95, moonIntensity: 0.0, exposure: 1.02, glow: 0.75 },
  { el: 0.42, zenith: '#356aa4', horizon: '#cfe0ef', ground: '#7c8672', fog: '#c6d6e4', sunColor: '#fff1d4', ambient: 0.5, hemi: 0.5, sunIntensity: 2.65, moonIntensity: 0.0, exposure: 1.03, glow: 0.55 },
  { el: 1.0, zenith: '#2c659f', horizon: '#dce9f4', ground: '#8b9581', fog: '#cdddea', sunColor: '#fff9ea', ambient: 0.56, hemi: 0.56, sunIntensity: 3.0, moonIntensity: 0.0, exposure: 1.04, glow: 0.42 },
];

function mixChannel(a: string, b: string, t: number): number {
  const av = parseInt(a, 16);
  const bv = parseInt(b, 16);
  return Math.round(av + (bv - av) * t);
}

function mixHex(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const to = (value: number) => Math.round(value).toString(16).padStart(2, '0');
  return '#' + to(ar + (br - ar) * t) + to(ag + (bg - ag) * t) + to(ab + (bb - ab) * t);
}

export function skyPalette(elevation: number): SkyPalette {
  const el = Math.max(-1, Math.min(1, elevation));
  let index = 0;
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    if (el >= STOPS[i].el) index = i;
  }
  const a = STOPS[index];
  const b = STOPS[Math.min(index + 1, STOPS.length - 1)];
  const span = b.el - a.el || 1e-6;
  const t = smooth(0, 1, Math.min(1, Math.max(0, (el - a.el) / span)));
  return {
    zenith: mixHex(a.zenith, b.zenith, t),
    horizon: mixHex(a.horizon, b.horizon, t),
    ground: mixHex(a.ground, b.ground, t),
    fog: mixHex(a.fog, b.fog, t),
    sunColor: mixHex(a.sunColor, b.sunColor, t),
    ambient: a.ambient + (b.ambient - a.ambient) * t,
    hemi: a.hemi + (b.hemi - a.hemi) * t,
    sunIntensity: a.sunIntensity + (b.sunIntensity - a.sunIntensity) * t,
    moonIntensity: a.moonIntensity + (b.moonIntensity - a.moonIntensity) * t,
    exposure: a.exposure + (b.exposure - a.exposure) * t,
    glow: a.glow + (b.glow - a.glow) * t,
  };
}

export { mixChannel };
