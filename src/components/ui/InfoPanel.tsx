import { ArrowUpRight, X } from 'lucide-react';
import { useCityStore } from '../../store/cityStore';
import { buildingById } from '../../data/buildings';
import { officeFloors } from '../../data/office';
import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { skills } from '../../data/skills';
import { experience } from '../../data/experience';

function ProjectList() {
  return (
    <div>
      {projects.map((project) => (
        <div className="project-card" key={project.id}>
          <strong>{project.name}</strong>
          <p>{project.description}</p>
          <div className="tag-row">
            {project.tech.map((tech) => (
              <span className="tag" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <div className="links">
            <a href={project.url} target="_blank" rel="noreferrer noopener">
              Live demo <ArrowUpRight size={11} />
            </a>
            <a href={project.repo} target="_blank" rel="noreferrer noopener">
              Repository <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InfoPanel() {
  const panel = useCityStore((state) => state.panel);
  const selectedId = useCityStore((state) => state.selectedBuildingId);
  const activeView = useCityStore((state) => state.activeView);
  const selectedFloor = useCityStore((state) => state.selectedFloor);
  const setPanel = useCityStore((state) => state.setPanel);
  const setFloor = useCityStore((state) => state.setFloor);
  const enterOffice = useCityStore((state) => state.enterOffice);
  const exitOffice = useCityStore((state) => state.exitOffice);
  const clearSelection = useCityStore((state) => state.clearSelection);

  if (!panel) return null;

  const building = selectedId ? buildingById(selectedId) : undefined;
  const floor = officeFloors.find((item) => item.index === selectedFloor);

  let title = 'City';
  let subtitle = '';
  if (panel === 'projects') {
    title = 'Projects';
    subtitle = 'Built in the Development Lab';
  } else if (panel === 'about') {
    title = 'About';
    subtitle = profile.title;
  } else if (panel === 'contact') {
    title = 'Contact';
    subtitle = profile.location;
  } else if (building) {
    title = building.name;
    subtitle = building.category;
  }

  return (
    <aside className="panel glass-card" aria-live="polite">
      <div className="panel-head">
        <h2>{title}</h2>
        {subtitle ? <p style={{ marginTop: 0, textTransform: 'capitalize' }}>{subtitle}</p> : null}
        <button type="button" className="panel-close" onClick={clearSelection} aria-label="Close panel">
          <X size={16} />
        </button>
      </div>

      {panel === 'building' && building ? (
        <div>
          <p>{building.description}</p>
          <div className="tag-row">
            {building.highlights.map((highlight) => (
              <span className="tag" key={highlight}>
                {highlight}
              </span>
            ))}
          </div>

          <div className="actions">
            {building.hasInterior ? (
              activeView === 'office' ? (
                <button type="button" className="btn primary" onClick={exitOffice}>
                  Back to the city
                </button>
              ) : (
                <button type="button" className="btn primary" onClick={enterOffice}>
                  Enter office
                </button>
              )
            ) : null}
            {building.id === 'devlab' || building.id === 'studio' ? (
              <button type="button" className="btn" onClick={() => setPanel('projects')}>
                View projects
              </button>
            ) : null}
            {building.id === 'contact' ? (
              <button type="button" className="btn" onClick={() => setPanel('contact')}>
                Contact details
              </button>
            ) : null}
          </div>

          {activeView === 'office' && building.hasInterior ? (
            <>
              <h3>Floors</h3>
              <div className="floors" style={{ flexWrap: 'wrap' }}>
                {officeFloors.map((item) => (
                  <button
                    type="button"
                    key={item.index}
                    className={'chip' + (item.index === selectedFloor ? ' active' : '')}
                    onClick={() => setFloor(item.index)}
                  >
                    {item.index}. {item.name}
                  </button>
                ))}
              </div>
              {floor ? <p style={{ marginTop: 10 }}>{floor.description}</p> : null}
            </>
          ) : null}
        </div>
      ) : null}

      {panel === 'projects' ? <ProjectList /> : null}

      {panel === 'about' ? (
        <div>
          <p>{profile.bio}</p>
          <h3>Skills</h3>
          <div className="tag-row">
            {skills.map((skill) => (
              <span className="tag" key={skill.name}>
                {skill.name} · {skill.category}
              </span>
            ))}
          </div>
          <h3>Experience</h3>
          {experience.map((item) => (
            <div className="project-card" key={item.role + item.org}>
              <strong>{item.role}</strong>
              <p>
                {item.org} · {item.period}
              </p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {panel === 'contact' ? (
        <div>
          <p>{profile.bio}</p>
          <div className="actions">
            <a className="btn primary" href={'mailto:' + profile.email}>
              {profile.email}
            </a>
            {profile.socials.map((social) => (
              <a className="btn" key={social.label} href={social.url} target="_blank" rel="noreferrer noopener">
                {social.label} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
