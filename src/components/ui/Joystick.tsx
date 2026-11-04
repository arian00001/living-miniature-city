import { useEffect, useRef, useState } from 'react';
import { setPlayerInput } from '../../lib/player';

const RADIUS = 46;

export default function Joystick() {
  const pad = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  useEffect(() => () => setPlayerInput(0, 0), []);

  const track = (clientX: number, clientY: number) => {
    const node = pad.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    let dx = clientX - (rect.left + rect.width / 2);
    let dy = clientY - (rect.top + rect.height / 2);
    const length = Math.hypot(dx, dy);
    if (length > RADIUS) {
      dx = (dx / length) * RADIUS;
      dy = (dy / length) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    setPlayerInput(dx / RADIUS, -dy / RADIUS);
  };

  const release = () => {
    dragging.current = false;
    setKnob({ x: 0, y: 0 });
    setPlayerInput(0, 0);
  };

  return (
    <div
      ref={pad}
      className="joy"
      role="button"
      aria-label="Walk"
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        track(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (dragging.current) track(event.clientX, event.clientY);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <div className="joy-knob" style={{ transform: 'translate3d(' + knob.x + 'px,' + knob.y + 'px,0)' }} />
      <span className="joy-label">Walk</span>
    </div>
  );
}
