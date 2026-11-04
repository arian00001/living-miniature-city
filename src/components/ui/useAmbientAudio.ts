import { useEffect, useRef } from 'react';
import { useCityStore } from '../../store/cityStore';

// Procedural city ambience: filtered noise, no audio files to download.
export function useAmbientAudio() {
  const enabled = useCityStore((state) => state.soundEnabled);
  const volume = useCityStore((state) => state.volume);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return;

    const context: AudioContext = new Ctor();
    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.1;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;

    const gain = context.createGain();
    gain.gain.value = volume * 0.16;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    gainRef.current = gain;

    return () => {
      source.stop();
      context.close();
      gainRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume * 0.16;
  }, [volume]);
}
