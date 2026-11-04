import { Building2, Minus, Plus, RotateCcw, Trees } from 'lucide-react';
import { useCityStore } from '../../store/cityStore';
import { officeFloors } from '../../data/office';

export default function BottomControls() {
  const zoom = useCityStore((state) => state.zoom);
  const focusPreset = useCityStore((state) => state.focusPreset);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const activeView = useCityStore((state) => state.activeView);
  const enterOffice = useCityStore((state) => state.enterOffice);
  const exitOffice = useCityStore((state) => state.exitOffice);
  const selectedFloor = useCityStore((state) => state.selectedFloor);
  const setFloor = useCityStore((state) => state.setFloor);

  return (
    <footer className="bottom glass-card">
      <div className="group">
        <button type="button" className="chip" onClick={() => focusPreset('city')} title="Reset the camera">
          <RotateCcw size={13} /> Reset
        </button>
        <button type="button" className="chip" onClick={() => zoom(0.78)} title="Zoom in" aria-label="Zoom in">
          <Plus size={13} />
        </button>
        <button type="button" className="chip" onClick={() => zoom(1.28)} title="Zoom out" aria-label="Zoom out">
          <Minus size={13} />
        </button>
      </div>

      <span className="divider" />

      <div className="group">
        <button type="button" className="chip" onClick={() => focusPreset('business')}>
          Business district
        </button>
        <button type="button" className="chip" onClick={() => selectBuilding('headquarters')}>
          <Building2 size={13} /> Headquarters
        </button>
        <button type="button" className="chip" onClick={() => focusPreset('park')}>
          <Trees size={13} /> Park
        </button>
      </div>

      <span className="divider" />

      <div className="group">
        {activeView === 'office' ? (
          <>
            <div className="floors">
              {officeFloors.map((floor) => (
                <button
                  type="button"
                  key={floor.index}
                  className={'chip' + (floor.index === selectedFloor ? ' active' : '')}
                  onClick={() => setFloor(floor.index)}
                  title={floor.name}
                >
                  F{floor.index}
                </button>
              ))}
            </div>
            <button type="button" className="chip" onClick={exitOffice}>
              City view
            </button>
          </>
        ) : (
          <button type="button" className="chip active" onClick={enterOffice}>
            Office mode
          </button>
        )}
      </div>
    </footer>
  );
}
