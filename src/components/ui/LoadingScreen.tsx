import { useCityStore } from '../../store/cityStore';

export default function LoadingScreen() {
  const ready = useCityStore((state) => state.ready);
  const entered = useCityStore((state) => state.entered);
  const enterCity = useCityStore((state) => state.enterCity);

  if (entered) return null;

  return (
    <div className="loading">
      <div className="loading-card">
        <span className="brand-mark" style={{ margin: '0 auto', width: 44, height: 44, borderRadius: 14, fontSize: 17 }}>
          LC
        </span>
        <h1>Living Miniature City</h1>
        <p>
          An island city you can explore: eight districts, a five-floor headquarters, pedestrians, traffic and a
          portfolio hidden inside.
        </p>
        {ready ? (
          <button type="button" className="btn primary" style={{ marginTop: 20 }} onClick={enterCity}>
            Enter city
          </button>
        ) : (
          <div className="spinner" />
        )}
        <div className="loading-note">
          Drag to orbit · scroll or pinch to zoom · click a building
        </div>
      </div>
    </div>
  );
}
