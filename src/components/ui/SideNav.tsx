import { Building2, Compass, Layers, Mail, User } from 'lucide-react';
import { useCityStore } from '../../store/cityStore';

export default function SideNav() {
  const panel = useCityStore((state) => state.panel);
  const activeView = useCityStore((state) => state.activeView);
  const clearSelection = useCityStore((state) => state.clearSelection);
  const focusPreset = useCityStore((state) => state.focusPreset);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const setPanel = useCityStore((state) => state.setPanel);

  return (
    <nav className="nav glass-card" aria-label="City navigation">
      <button
        type="button"
        className={activeView === 'city' && !panel ? 'active' : ''}
        onClick={() => {
          clearSelection();
          focusPreset('city');
        }}
      >
        <Compass size={14} /> Explore city
      </button>
      <button
        type="button"
        className={panel === 'building' ? 'active' : ''}
        onClick={() => selectBuilding('headquarters')}
      >
        <Building2 size={14} /> Headquarters
      </button>
      <button
        type="button"
        className={panel === 'projects' ? 'active' : ''}
        onClick={() => {
          selectBuilding('devlab');
          setPanel('projects');
        }}
      >
        <Layers size={14} /> Projects
      </button>
      <button type="button" className={panel === 'about' ? 'active' : ''} onClick={() => setPanel('about')}>
        <User size={14} /> About
      </button>
      <button
        type="button"
        className={panel === 'contact' ? 'active' : ''}
        onClick={() => {
          selectBuilding('contact');
          setPanel('contact');
        }}
      >
        <Mail size={14} /> Contact
      </button>
    </nav>
  );
}
