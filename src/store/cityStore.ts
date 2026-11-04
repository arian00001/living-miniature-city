import { create } from 'zustand';
import { buildingById, cameraFor } from '../data/buildings';
import type { CameraPreset, LightingMode, Panel, WeatherMode } from '../types';
import { dhakaMinutes } from '../lib/sun';

export interface CameraRequest {
  position: [number, number, number];
  target: [number, number, number];
  key: number;
}

export interface ZoomRequest {
  factor: number;
  key: number;
}

const PRESETS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  city: { position: [0, 96, 108], target: [0, 2, 0] },
  business: { position: [50, 38, 54], target: [8, 4, 0] },
  headquarters: { position: [0, 20, 42], target: [0, 4, 0] },
  park: { position: [-16, 22, -28], target: [-16, 1, -52] },
  office: { position: [0, 22, 26], target: [0, 1, 0] },
};

let keyCounter = 0;
function nextKey() {
  keyCounter += 1;
  return keyCounter;
}

// The clock is anchored to the visitor's real Asia/Dhaka time and keeps its own
// fractional cursor so the UI only re-renders on whole minutes.
const START_MINUTES = Math.round(dhakaMinutes()) % 1440;
let minuteCursor = START_MINUTES;

function modeFor(minutes: number): LightingMode {
  if (minutes >= 360 && minutes < 1020) return 'day';
  if (minutes >= 1020 && minutes < 1170) return 'sunset';
  return 'night';
}

export interface CityStore {
  ready: boolean;
  entered: boolean;
  cinematic: boolean;
  tourKey: number;
  selectedBuildingId: string | null;
  activeView: 'city' | 'office';
  selectedFloor: number;
  preset: CameraPreset;
  panel: Panel;
  lightingMode: LightingMode;
  weather: WeatherMode;
  soundEnabled: boolean;
  volume: number;
  simulationEnabled: boolean;
  simulationSpeed: number;
  minutes: number;
  cameraRequest: CameraRequest | null;
  zoomRequest: ZoomRequest | null;

  setReady: (value: boolean) => void;
  enterCity: () => void;
  setCinematic: (value: boolean) => void;
  restartTour: () => void;
  selectBuilding: (id: string) => void;
  clearSelection: () => void;
  setPanel: (panel: Panel) => void;
  enterOffice: () => void;
  exitOffice: () => void;
  setFloor: (index: number) => void;
  focusPreset: (preset: CameraPreset) => void;
  moveCamera: (position: [number, number, number], target: [number, number, number]) => void;
  zoom: (factor: number) => void;
  setLighting: (mode: LightingMode) => void;
  cycleLighting: () => void;
  toggleWeather: () => void;
  toggleSound: () => void;
  setVolume: (value: number) => void;
  toggleSimulation: () => void;
  setSpeed: (speed: number) => void;
  tick: (delta: number) => void;
}

export const useCityStore = create<CityStore>((set, get) => ({
  ready: false,
  entered: false,
  cinematic: false,
  tourKey: 0,
  selectedBuildingId: null,
  activeView: 'city',
  selectedFloor: 1,
  preset: 'city',
  panel: null,
  lightingMode: modeFor(START_MINUTES),
  weather: 'clear',
  soundEnabled: false,
  volume: 0.5,
  simulationEnabled: true,
  simulationSpeed: 1,
  minutes: START_MINUTES,
  cameraRequest: null,
  zoomRequest: null,

  setReady: (value) => set({ ready: value }),

  // Entering starts the cinematic fly-through instead of dropping the visitor in a static view.
  enterCity: () => set((state) => ({ entered: true, cinematic: true, tourKey: state.tourKey + 1 })),

  setCinematic: (value) => set({ cinematic: value }),

  restartTour: () => set((state) => ({ cinematic: true, tourKey: state.tourKey + 1, activeView: 'city' })),

  selectBuilding: (id) => {
    const building = buildingById(id);
    if (!building) return;
    set({
      selectedBuildingId: id,
      activeView: 'city',
      panel: 'building',
      preset: 'city',
      cinematic: false,
      cameraRequest: {
        position: cameraFor(building.cameraTarget, building.cameraDistance),
        target: building.cameraTarget,
        key: nextKey(),
      },
    });
  },

  clearSelection: () => set({ selectedBuildingId: null, panel: null }),

  setPanel: (panel) => set({ panel }),

  enterOffice: () =>
    set({
      activeView: 'office',
      selectedBuildingId: 'headquarters',
      panel: null,
      cinematic: false,
      cameraRequest: { ...PRESETS.office, key: nextKey() },
    }),

  exitOffice: () =>
    set({ activeView: 'city', cinematic: false, cameraRequest: { ...PRESETS.headquarters, key: nextKey() } }),

  setFloor: () => set({ selectedFloor: 1 }),

  focusPreset: (preset) => {
    const view = preset === 'office' ? 'office' : 'city';
    set({ preset, activeView: view, cinematic: false, cameraRequest: { ...PRESETS[preset], key: nextKey() } });
  },

  moveCamera: (position, target) => set({ cinematic: false, cameraRequest: { position, target, key: nextKey() } }),

  zoom: (factor) => set({ cinematic: false, zoomRequest: { factor, key: nextKey() } }),

  // Jumping a preset only moves the clock; the sky keeps following real time.
  setLighting: (mode) => {
    const target = mode === 'day' ? 12 * 60 : mode === 'sunset' ? 18 * 60 + 15 : 22 * 60;
    minuteCursor = target;
    set({ lightingMode: mode, minutes: target, simulationEnabled: true });
  },

  cycleLighting: () => {
    const order: LightingMode[] = ['day', 'sunset', 'night'];
    const current = order.indexOf(get().lightingMode);
    const next = order[(current + 1) % order.length];
    const target = next === 'day' ? 12 * 60 : next === 'sunset' ? 18 * 60 + 15 : 22 * 60;
    minuteCursor = target;
    set({ lightingMode: next, minutes: target });
  },

  toggleWeather: () => set({ weather: get().weather === 'rain' ? 'clear' : 'rain' }),

  toggleSound: () => set({ soundEnabled: !get().soundEnabled }),

  setVolume: (value) => set({ volume: value }),

  toggleSimulation: () => set({ simulationEnabled: !get().simulationEnabled }),

  setSpeed: (speed) => set({ simulationSpeed: speed }),

  tick: (delta) => {
    const state = get();
    if (!state.simulationEnabled) return;
    minuteCursor = (minuteCursor + (delta / 60) * state.simulationSpeed) % 1440;
    const whole = Math.floor(minuteCursor);
    if (whole !== state.minutes) set({ minutes: whole, lightingMode: modeFor(whole) });
  },
}));
